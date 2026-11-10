import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserLocalDate, getPreviousDate } from '@/lib/streaks'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const today = getUserLocalDate(user.timezone)

    // 1. Fetch Login Streak
    const loginStreak = await prisma.streakRecord.findFirst({
      where: {
        userId: user.id,
        type: 'LOGIN',
      },
    })

    // 2. Fetch Activity Streaks
    const activityStreaks = await prisma.streakRecord.findMany({
      where: {
        userId: user.id,
        type: 'ACTIVITY',
      },
      include: {
        activity: {
          select: {
            id: true,
            name: true,
            category: true,
            color: true,
            icon: true,
            isPaused: true,
          },
        },
      },
      orderBy: { currentStreak: 'desc' },
    })

    // 3. Fetch Milestones
    const milestones = await prisma.milestone.findMany({
      where: { userId: user.id },
      orderBy: { achievedAt: 'desc' },
    })

    // 4. Generate GitHub-style contribution calendar for past 365 days
    // Count completions per date
    const oneYearAgo = getPreviousDate(today, 365)
    const completions = await prisma.dailyCompletion.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED',
        date: { gte: oneYearAgo, lte: today },
      },
      select: { date: true, durationMinutes: true },
    })

    const countByDate: Record<string, { count: number; minutes: number }> = {}
    for (const c of completions) {
      if (!countByDate[c.date]) {
        countByDate[c.date] = { count: 0, minutes: 0 }
      }
      countByDate[c.date].count += 1
      countByDate[c.date].minutes += c.durationMinutes
    }

    // Build array of 365 days
    const calendarDays: Array<{ date: string; count: number; minutes: number; level: number }> = []
    for (let i = 364; i >= 0; i--) {
      const d = getPreviousDate(today, i)
      const data = countByDate[d] || { count: 0, minutes: 0 }
      let level = 0
      if (data.count === 1) level = 1
      else if (data.count === 2) level = 2
      else if (data.count === 3) level = 3
      else if (data.count >= 4) level = 4

      calendarDays.push({
        date: d,
        count: data.count,
        minutes: data.minutes,
        level,
      })
    }

    return NextResponse.json({
      loginStreak: loginStreak || {
        currentStreak: 1,
        longestStreak: 1,
        totalActiveDays: 1,
      },
      activityStreaks: activityStreaks.filter((s) => s.activity !== null),
      milestones,
      calendarDays,
      totalCompletionsCount: completions.length,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
