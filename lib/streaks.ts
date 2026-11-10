import { prisma } from './prisma'

export function getUserLocalDate(timezone = 'UTC', date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    return formatter.format(date) // Returns YYYY-MM-DD
  } catch {
    return date.toISOString().split('T')[0]
  }
}

export function getDayOfWeekAbbr(dateStr: string): string {
  // dateStr is YYYY-MM-DD
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(Date.UTC(year, month - 1, day))
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  return days[d.getUTCDay()]
}

export function getPreviousDate(dateStr: string, daysAgo = 1): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(Date.UTC(year, month - 1, day))
  d.setUTCDate(d.getUTCDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

export function getDaysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1).getTime()
  const d2 = new Date(date2).getTime()
  return Math.round(Math.abs((d2 - d1) / (1000 * 60 * 60 * 24)))
}

/**
 * Record a user's daily login and compute login streak
 */
export async function recordDailyLogin(userId: string, timezone = 'UTC') {
  const today = getUserLocalDate(timezone)

  // 1. Check or insert LoginRecord for today
  const existingLogin = await prisma.loginRecord.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  })

  if (!existingLogin) {
    await prisma.loginRecord.create({
      data: {
        userId,
        date: today,
      },
    })
  }

  // 2. Fetch or initialize StreakRecord for login
  const streak = await prisma.streakRecord.findFirst({
    where: {
      userId,
      type: 'LOGIN',
    },
  })

  const yesterday = getPreviousDate(today, 1)

  if (!streak) {
    // First time login
    const newStreak = await prisma.streakRecord.create({
      data: {
        userId,
        type: 'LOGIN',
        activityId: null,
        currentStreak: 1,
        longestStreak: 1,
        totalActiveDays: 1,
        lastRecordedDate: today,
      },
    })
    await checkMilestones(userId, 'LOGIN_STREAK', 1)
    return newStreak
  }

  // If already recorded today, return current streak
  if (streak.lastRecordedDate === today) {
    return streak
  }

  let currentStreak = streak.currentStreak
  let totalActiveDays = streak.totalActiveDays + 1

  if (streak.lastRecordedDate === yesterday) {
    // Consecutive day!
    currentStreak += 1
  } else {
    // Streak broken
    currentStreak = 1
  }

  const longestStreak = Math.max(streak.longestStreak, currentStreak)

  const updatedStreak = await prisma.streakRecord.update({
    where: { id: streak.id },
    data: {
      currentStreak,
      longestStreak,
      totalActiveDays,
      lastRecordedDate: today,
    },
  })

  // Check milestones for 7, 14, 30, 60, 100 days
  await checkMilestones(userId, 'LOGIN_STREAK', currentStreak)

  return updatedStreak
}

/**
 * Recalculate streak for a specific activity
 */
export async function recalculateActivityStreak(userId: string, activityId: string, timezone = 'UTC') {
  const today = getUserLocalDate(timezone)

  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
  })

  if (!activity || activity.userId !== userId) return null

  // Fetch all completed records for this activity
  const completions = await prisma.dailyCompletion.findMany({
    where: {
      userId,
      activityId,
      status: 'COMPLETED',
    },
    orderBy: { date: 'asc' },
  })

  const completedDates = new Set(completions.map((c) => c.date))
  const activeDaysList = activity.activeDays.split(',').map((s) => s.trim().toUpperCase())

  // Walk backwards from today (or yesterday if today not completed yet)
  let currentStreak = 0
  let checkDate = today

  // If today is completed, start streak with 1
  if (completedDates.has(today)) {
    currentStreak += 1
    checkDate = getPreviousDate(today, 1)
  } else {
    // If today is not completed yet, check if today is a scheduled day
    const todayAbbr = getDayOfWeekAbbr(today)
    const isTodayScheduled = activeDaysList.includes(todayAbbr) && !activity.isPaused

    // Today is in progress / not over yet, so check streak from yesterday backwards
    checkDate = getPreviousDate(today, 1)
  }

  // Check past dates up to 365 days back
  for (let i = 0; i < 365; i++) {
    const dayAbbr = getDayOfWeekAbbr(checkDate)
    const isScheduled = activeDaysList.includes(dayAbbr) && !activity.isPaused

    if (isScheduled) {
      if (completedDates.has(checkDate)) {
        currentStreak += 1
      } else {
        // Scheduled day was missed! Streak stops here.
        break
      }
    }
    // If not scheduled (rest day / unscheduled), do not break streak; continue stepping back!
    checkDate = getPreviousDate(checkDate, 1)
  }

  // Fetch existing streak record
  const existingRecord = await prisma.streakRecord.findFirst({
    where: {
      userId,
      type: 'ACTIVITY',
      activityId,
    },
  })

  const totalCompleted = completions.length
  const longestStreak = existingRecord
    ? Math.max(existingRecord.longestStreak, currentStreak)
    : currentStreak

  let result
  if (existingRecord) {
    result = await prisma.streakRecord.update({
      where: { id: existingRecord.id },
      data: {
        currentStreak,
        longestStreak,
        totalActiveDays: totalCompleted,
        lastRecordedDate: completedDates.has(today) ? today : existingRecord.lastRecordedDate,
      },
    })
  } else {
    result = await prisma.streakRecord.create({
      data: {
        userId,
        type: 'ACTIVITY',
        activityId,
        currentStreak,
        longestStreak,
        totalActiveDays: totalCompleted,
        lastRecordedDate: completedDates.has(today) ? today : null,
      },
    })
  }

  // Check milestones for 7, 14, 30, 60, 100 days
  await checkMilestones(userId, 'ACTIVITY_STREAK', currentStreak, activity.name)

  return result
}

/**
 * Milestone check engine
 */
export async function checkMilestones(
  userId: string,
  category: 'LOGIN_STREAK' | 'ACTIVITY_STREAK' | 'COMPLETION_COUNT' | 'LEARNING_HOURS',
  value: number,
  activityName?: string
) {
  const milestoneTargets = [
    { type: 'STREAK_7', threshold: 7, title: '7-Day Unbroken Momentum', desc: 'Maintained a solid 7-day consistency streak' },
    { type: 'STREAK_14', threshold: 14, title: '14-Day Fortitude', desc: 'Two full weeks of relentless dedication' },
    { type: 'STREAK_30', threshold: 30, title: '30-Day Iron Discipline', desc: 'Transformed an action into an unshakeable habit' },
    { type: 'STREAK_60', threshold: 60, title: '60-Day Master of Consistency', desc: 'Two months of unwavering follow-through' },
    { type: 'STREAK_100', threshold: 100, title: 'Centurion 100-Day Milestone', desc: 'Achieved the legendary 100-day milestone' },
  ]

  for (const m of milestoneTargets) {
    if (value >= m.threshold) {
      const milestoneKey = activityName ? `${m.type}_${activityName}` : m.type

      const existing = await prisma.milestone.findFirst({
        where: {
          userId,
          milestoneType: milestoneKey,
        },
      })

      if (!existing) {
        const title = activityName ? `${activityName}: ${m.title}` : m.title
        const description = activityName
          ? `Achieved ${m.threshold}-day streak on ${activityName}. ${m.desc}.`
          : `${m.desc} (${m.threshold} consecutive days).`

        await prisma.milestone.create({
          data: {
            userId,
            title,
            description,
            milestoneType: milestoneKey,
            icon: 'Flame',
            category,
          },
        })

        // Also add an in-app notification
        await prisma.notification.create({
          data: {
            userId,
            title: `Milestone Unlocked: ${title}`,
            message: description,
            type: 'MILESTONE_UNLOCKED',
            linkUrl: '/streaks',
          },
        })
      }
    }
  }
}
