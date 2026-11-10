import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserLocalDate, getPreviousDate } from '@/lib/streaks'
import { aiService } from '@/lib/ai/aiService'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const today = getUserLocalDate(user.timezone)
  const weekOffset = parseInt(searchParams.get('offset') || '0', 10) // 0 = current week, 1 = last week

  try {
    // Current 7-day window
    const endDaysAgo = weekOffset * 7
    const startDaysAgo = endDaysAgo + 6

    const endDate = getPreviousDate(today, endDaysAgo)
    const startDate = getPreviousDate(today, startDaysAgo)

    // Previous 7-day window for comparison
    const prevEndDate = getPreviousDate(today, endDaysAgo + 7)
    const prevStartDate = getPreviousDate(today, startDaysAgo + 7)

    // Completions in target week
    const currentWeekCompletions = await prisma.dailyCompletion.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate, lte: endDate },
      },
      include: {
        activity: { select: { id: true, name: true, category: true, color: true } },
      },
    })

    const prevWeekCompletions = await prisma.dailyCompletion.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED',
        date: { gte: prevStartDate, lte: prevEndDate },
      },
      select: { durationMinutes: true },
    })

    const completedItems = currentWeekCompletions.filter((c) => c.status === 'COMPLETED')
    const missedItems = currentWeekCompletions.filter((c) => c.status === 'MISSED')
    const totalMinutes = completedItems.reduce((acc, c) => acc + c.durationMinutes, 0)
    const prevMinutes = prevWeekCompletions.reduce((acc, c) => acc + c.durationMinutes, 0)

    // Best performing activity
    const activityCounts: Record<string, { name: string; count: number; minutes: number }> = {}
    completedItems.forEach((c) => {
      const actId = c.activity.id
      if (!activityCounts[actId]) {
        activityCounts[actId] = { name: c.activity.name, count: 0, minutes: 0 }
      }
      activityCounts[actId].count += 1
      activityCounts[actId].minutes += c.durationMinutes
    })

    let bestActivityName: string | undefined = undefined
    let maxCount = -1
    for (const data of Object.values(activityCounts)) {
      if (data.count > maxCount) {
        maxCount = data.count
        bestActivityName = data.name
      }
    }

    const totalScheduled = completedItems.length + missedItems.length
    const consistencyRate = totalScheduled > 0 ? Math.round((completedItems.length / totalScheduled) * 100) : 0

    const hoursDiffPercent = prevMinutes > 0
      ? Math.round(((totalMinutes - prevMinutes) / prevMinutes) * 100)
      : (totalMinutes > 0 ? 100 : 0)

    // Generate intelligent review insight via modular AI service
    const insight = await aiService.generateWeeklyReviewSummary({
      totalCompleted: completedItems.length,
      totalMissed: missedItems.length,
      totalMinutes,
      bestActivityName,
      streakDays: 7,
    })

    return NextResponse.json({
      startDate,
      endDate,
      weekOffset,
      completedCount: completedItems.length,
      missedCount: missedItems.length,
      totalMinutes,
      totalHours: (totalMinutes / 60).toFixed(1),
      prevTotalHours: (prevMinutes / 60).toFixed(1),
      hoursDiffPercent,
      bestActivityName: bestActivityName || 'None yet',
      consistencyRate,
      insight,
      completedItems,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
