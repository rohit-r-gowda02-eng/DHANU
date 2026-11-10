import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserLocalDate, getPreviousDate } from '@/lib/streaks'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const range = searchParams.get('range') || '30d' // 7d, 30d, 90d, 6m, 1y

  let days = 30
  if (range === '7d') days = 7
  else if (range === '90d') days = 90
  else if (range === '6m') days = 180
  else if (range === '1y') days = 365

  try {
    const today = getUserLocalDate(user.timezone)
    const startDate = getPreviousDate(today, days - 1)
    const prevPeriodStartDate = getPreviousDate(startDate, days)

    // Current period completions
    const currentCompletions = await prisma.dailyCompletion.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED',
        date: { gte: startDate, lte: today },
      },
      include: {
        activity: { select: { id: true, name: true, category: true, color: true } },
      },
      orderBy: { date: 'asc' },
    })

    // Previous period completions for comparison
    const previousCompletions = await prisma.dailyCompletion.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED',
        date: { gte: prevPeriodStartDate, lt: startDate },
      },
      select: { durationMinutes: true },
    })

    // Calculate totals
    const currentMinutes = currentCompletions.reduce((acc, c) => acc + c.durationMinutes, 0)
    const previousMinutes = previousCompletions.reduce((acc, c) => acc + c.durationMinutes, 0)
    const currentCompletedCount = currentCompletions.length
    const previousCompletedCount = previousCompletions.length

    // Percentage change
    const hoursChangePercent = previousMinutes > 0
      ? Math.round(((currentMinutes - previousMinutes) / previousMinutes) * 100)
      : (currentMinutes > 0 ? 100 : 0)

    const completionCountChangePercent = previousCompletedCount > 0
      ? Math.round(((currentCompletedCount - previousCompletedCount) / previousCompletedCount) * 100)
      : (currentCompletedCount > 0 ? 100 : 0)

    // 1. Daily trend / consistency graph
    const dailyMap: Record<string, { date: string; minutes: number; count: number }> = {}
    for (let i = days - 1; i >= 0; i--) {
      const d = getPreviousDate(today, i)
      dailyMap[d] = { date: d.substring(5), minutes: 0, count: 0 } // MM-DD
    }

    for (const c of currentCompletions) {
      if (dailyMap[c.date]) {
        dailyMap[c.date].minutes += c.durationMinutes
        dailyMap[c.date].count += 1
      }
    }
    const dailyTrend = Object.values(dailyMap)

    // 2. Time per activity
    const activityMap: Record<
      string,
      { name: string; category: string; color: string; totalMinutes: number; count: number }
    > = {}

    for (const c of currentCompletions) {
      const actId = c.activity.id
      if (!activityMap[actId]) {
        activityMap[actId] = {
          name: c.activity.name,
          category: c.activity.category,
          color: c.activity.color || '#D4AF37',
          totalMinutes: 0,
          count: 0,
        }
      }
      activityMap[actId].totalMinutes += c.durationMinutes
      activityMap[actId].count += 1
    }

    const activityBreakdown = Object.values(activityMap).map((a) => ({
      ...a,
      hours: Number((a.totalMinutes / 60).toFixed(1)),
    }))

    // 3. Weekly completion aggregates
    const weeklyMap: Record<string, { week: string; count: number; hours: number }> = {}
    currentCompletions.forEach((c) => {
      // Group by week
      const d = new Date(c.date)
      const weekNum = `W${Math.ceil((d.getDate() + 6 - d.getDay()) / 7)}`
      const key = `${c.date.substring(0, 7)} ${weekNum}`
      if (!weeklyMap[key]) {
        weeklyMap[key] = { week: key, count: 0, hours: 0 }
      }
      weeklyMap[key].count += 1
      weeklyMap[key].hours = Number((weeklyMap[key].hours + c.durationMinutes / 60).toFixed(1))
    })
    const weeklyTrend = Object.values(weeklyMap)

    return NextResponse.json({
      range,
      comparison: {
        current: {
          totalMinutes: currentMinutes,
          totalHours: (currentMinutes / 60).toFixed(1),
          totalCompleted: currentCompletedCount,
        },
        previous: {
          totalMinutes: previousMinutes,
          totalHours: (previousMinutes / 60).toFixed(1),
          totalCompleted: previousCompletedCount,
        },
        hoursChangePercent,
        completionCountChangePercent,
      },
      dailyTrend,
      weeklyTrend,
      activityBreakdown,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
