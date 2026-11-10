import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserLocalDate } from '@/lib/streaks'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const today = getUserLocalDate(user.timezone)
  const monthParam = searchParams.get('month') || today.substring(0, 7) // "YYYY-MM"

  try {
    const startDate = `${monthParam}-01`
    const endDate = `${monthParam}-31`

    const completions = await prisma.dailyCompletion.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate, lte: endDate },
      },
      include: {
        activity: { select: { id: true, name: true, category: true, color: true } },
      },
    })

    const completed = completions.filter((c) => c.status === 'COMPLETED')
    const missed = completions.filter((c) => c.status === 'MISSED')
    const totalMinutes = completed.reduce((acc, c) => acc + c.durationMinutes, 0)

    // Milestones achieved this month
    const milestones = await prisma.milestone.findMany({
      where: {
        userId: user.id,
        achievedAt: {
          gte: new Date(`${startDate}T00:00:00Z`),
          lte: new Date(`${endDate}T23:59:59Z`),
        },
      },
    })

    // Activity breakdown
    const activityMap: Record<string, { name: string; hours: number; count: number }> = {}
    completed.forEach((c) => {
      const actId = c.activity.id
      if (!activityMap[actId]) {
        activityMap[actId] = { name: c.activity.name, hours: 0, count: 0 }
      }
      activityMap[actId].hours += c.durationMinutes / 60
      activityMap[actId].count += 1
    })

    // Growth analysis text
    const totalHours = (totalMinutes / 60).toFixed(1)
    const consistency = completions.length > 0
      ? Math.round((completed.length / completions.length) * 100)
      : 0

    let growthAnalysis = `During ${monthParam}, you proved your commitment with ${totalHours} verified hours across ${completed.length} sessions.`
    let improvementArea = 'Zero missed sessions recorded.'
    if (missed.length > 0) {
      improvementArea = `${missed.length} sessions were missed. Review rest-day scheduling to protect streaks.`
    }

    return NextResponse.json({
      month: monthParam,
      totalCompleted: completed.length,
      totalMissed: missed.length,
      totalHours,
      consistencyRate: consistency,
      milestones,
      activityBreakdown: Object.values(activityMap).map((a) => ({
        ...a,
        hours: Number(a.hours.toFixed(1)),
      })),
      growthAnalysis,
      areasForImprovement: improvementArea,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
