import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserLocalDate, getDayOfWeekAbbr } from '@/lib/streaks'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const today = getUserLocalDate(user.timezone)
  const monthParam = searchParams.get('month') || today.substring(0, 7) // "YYYY-MM"

  try {
    const [yearStr, monthStr] = monthParam.split('-')
    const year = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10) // 1-12

    // Get days in month
    const daysInMonth = new Date(year, month, 0).getDate()
    const startDate = `${monthParam}-01`
    const endDate = `${monthParam}-${daysInMonth < 10 ? '0' : ''}${daysInMonth}`

    // Fetch user activities
    const activities = await prisma.activity.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        activeDays: true,
        isPaused: true,
        color: true,
      },
    })

    // Fetch all completions in this month
    const completions = await prisma.dailyCompletion.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate, lte: endDate },
      },
      include: {
        activity: { select: { id: true, name: true, color: true } },
        proofImages: true,
      },
    })

    const completionsByDate: Record<string, typeof completions> = {}
    for (const c of completions) {
      if (!completionsByDate[c.date]) {
        completionsByDate[c.date] = []
      }
      completionsByDate[c.date].push(c)
    }

    // Build calendar days array
    const days = []
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = day < 10 ? `0${day}` : `${day}`
      const dateStr = `${monthParam}-${dayStr}`
      const dayAbbr = getDayOfWeekAbbr(dateStr)

      // Calculate scheduled count
      let scheduledCount = 0
      for (const act of activities) {
        if (!act.isPaused) {
          const daysList = act.activeDays.split(',').map((s) => s.trim().toUpperCase())
          if (daysList.includes(dayAbbr)) {
            scheduledCount++
          }
        }
      }

      const dayCompletions = completionsByDate[dateStr] || []
      const completedCount = dayCompletions.filter((c) => c.status === 'COMPLETED').length
      const missedCount = dayCompletions.filter((c) => c.status === 'MISSED').length

      let status = 'NOT_STARTED'
      const isFuture = dateStr > today

      if (isFuture) {
        status = 'FUTURE'
      } else if (scheduledCount === 0) {
        status = 'REST_DAY'
      } else if (completedCount >= scheduledCount && scheduledCount > 0) {
        status = 'FULL_COMPLETED'
      } else if (completedCount > 0) {
        status = 'PARTIAL_COMPLETED'
      } else if (missedCount > 0 || dateStr < today) {
        status = 'MISSED'
      }

      days.push({
        date: dateStr,
        dayNumber: day,
        dayOfWeek: dayAbbr,
        scheduledCount,
        completedCount,
        status,
        completions: dayCompletions,
      })
    }

    return NextResponse.json({
      month: monthParam,
      daysInMonth,
      days,
      today,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
