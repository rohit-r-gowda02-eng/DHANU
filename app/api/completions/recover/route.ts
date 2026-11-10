import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserLocalDate, recalculateActivityStreak } from '@/lib/streaks'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { activityId, date, missedReason, adjustTargetMinutes, adjustActiveDays } = await req.json()

    if (!activityId || !missedReason) {
      return NextResponse.json({ error: 'Activity ID and reason are required' }, { status: 400 })
    }

    const targetDate = date || getUserLocalDate(user.timezone)

    // Upsert completion record with MISSED status and honest reason
    const record = await prisma.dailyCompletion.upsert({
      where: {
        userId_activityId_date: {
          userId: user.id,
          activityId,
          date: targetDate,
        },
      },
      create: {
        userId: user.id,
        activityId,
        date: targetDate,
        status: 'MISSED',
        missedReason: missedReason.trim(),
      },
      update: {
        status: 'MISSED',
        missedReason: missedReason.trim(),
      },
    })

    // Optionally adjust future schedule if user found target unrealistic
    if (adjustTargetMinutes || adjustActiveDays) {
      await prisma.activity.update({
        where: { id: activityId },
        data: {
          targetMinutes: adjustTargetMinutes ? Number(adjustTargetMinutes) : undefined,
          activeDays: adjustActiveDays || undefined,
        },
      })
    }

    // Recalculate streak
    await recalculateActivityStreak(user.id, activityId, user.timezone)

    return NextResponse.json({
      success: true,
      message: 'Recovery log recorded. Honest acknowledgment is the foundation of long-term progress.',
      record,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

