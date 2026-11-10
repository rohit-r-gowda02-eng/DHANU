import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserLocalDate, getDayOfWeekAbbr } from '@/lib/streaks'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const today = getUserLocalDate(user.timezone)
    const todayAbbr = getDayOfWeekAbbr(today)

    const activities = await prisma.activity.findMany({
      where: { userId: user.id },
      orderBy: { orderIndex: 'asc' },
      include: {
        streakRecords: {
          where: { type: 'ACTIVITY' },
        },
        completions: {
          where: { date: today },
          include: {
            proofImages: true,
          },
        },
      },
    })

    const formatted = activities.map((act) => {
      const activeDaysList = act.activeDays.split(',').map((s) => s.trim().toUpperCase())
      const isScheduledToday = activeDaysList.includes(todayAbbr)
      const streakRecord = act.streakRecords[0] || null
      const todayCompletion = act.completions[0] || null

      let status = 'NOT_STARTED'
      if (!isScheduledToday) {
        status = 'REST_DAY'
      } else if (act.isPaused) {
        status = 'PAUSED'
      } else if (todayCompletion) {
        status = todayCompletion.status
      }

      return {
        id: act.id,
        name: act.name,
        category: act.category,
        description: act.description,
        targetMinutes: act.targetMinutes,
        preferredTime: act.preferredTime,
        activeDays: act.activeDays,
        restDays: act.restDays,
        color: act.color,
        icon: act.icon,
        isPaused: act.isPaused,
        orderIndex: act.orderIndex,
        createdAt: act.createdAt,
        isScheduledToday,
        status,
        todayCompletion,
        currentStreak: streakRecord ? streakRecord.currentStreak : 0,
        longestStreak: streakRecord ? streakRecord.longestStreak : 0,
        totalActiveDays: streakRecord ? streakRecord.totalActiveDays : 0,
      }
    })

    return NextResponse.json({ activities: formatted, today })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const {
      name,
      category,
      description,
      targetMinutes,
      preferredTime,
      activeDays,
      restDays,
      color,
      icon,
    } = await req.json()

    if (!name) {
      return NextResponse.json({ error: 'Activity name is required' }, { status: 400 })
    }

    // Get highest order index
    const count = await prisma.activity.count({ where: { userId: user.id } })

    const activity = await prisma.activity.create({
      data: {
        userId: user.id,
        name: name.trim(),
        category: category || 'General',
        description: description || null,
        targetMinutes: Number(targetMinutes) || 60,
        preferredTime: preferredTime || '09:00',
        activeDays: activeDays || 'MON,TUE,WED,THU,FRI,SAT,SUN',
        restDays: restDays || '',
        color: color || '#D4AF37',
        icon: icon || 'Target',
        orderIndex: count,
      },
    })

    return NextResponse.json({ success: true, activity }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

