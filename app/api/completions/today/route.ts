import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserLocalDate, getDayOfWeekAbbr } from '@/lib/streaks'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const targetDate = searchParams.get('date') || getUserLocalDate(user.timezone)
  const dayAbbr = getDayOfWeekAbbr(targetDate)

  try {
    const activities = await prisma.activity.findMany({
      where: { userId: user.id },
      orderBy: { orderIndex: 'asc' },
      include: {
        completions: {
          where: { date: targetDate },
          include: { proofImages: true },
        },
        streakRecords: {
          where: { type: 'ACTIVITY' },
        },
      },
    })

    let scheduledCount = 0
    let completedCount = 0
    let totalMinutesSpent = 0

    const items = activities.map((act) => {
      const activeDays = act.activeDays.split(',').map((s) => s.trim().toUpperCase())
      const isScheduled = activeDays.includes(dayAbbr)
      const completion = act.completions[0] || null
      const streak = act.streakRecords[0] || null

      let status = 'NOT_STARTED'
      if (!isScheduled) {
        status = 'REST_DAY'
      } else if (act.isPaused) {
        status = 'PAUSED'
      } else if (completion) {
        status = completion.status
        if (completion.status === 'COMPLETED') {
          completedCount++
          totalMinutesSpent += completion.durationMinutes
        }
      }

      if (isScheduled && !act.isPaused) {
        scheduledCount++
      }

      return {
        activityId: act.id,
        name: act.name,
        category: act.category,
        description: act.description,
        targetMinutes: act.targetMinutes,
        preferredTime: act.preferredTime,
        color: act.color,
        icon: act.icon,
        isPaused: act.isPaused,
        isScheduled,
        status,
        completion,
        currentStreak: streak ? streak.currentStreak : 0,
        longestStreak: streak ? streak.longestStreak : 0,
      }
    })

    const completionRate = scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0

    return NextResponse.json({
      date: targetDate,
      dayAbbr,
      items,
      summary: {
        totalScheduled: scheduledCount,
        completed: completedCount,
        remaining: Math.max(0, scheduledCount - completedCount),
        totalMinutesSpent,
        totalHoursSpent: (totalMinutesSpent / 60).toFixed(1),
        completionRate,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
