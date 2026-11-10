import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { recalculateActivityStreak } from '@/lib/streaks'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const activity = await prisma.activity.findUnique({
    where: { id: params.id },
    include: {
      streakRecords: {
        where: { type: 'ACTIVITY' },
      },
      completions: {
        orderBy: { date: 'desc' },
        take: 30,
        include: {
          proofImages: true,
        },
      },
    },
  })

  if (!activity || activity.userId !== user.id) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
  }

  // Calculate total minutes and total completions
  const allCompletions = await prisma.dailyCompletion.findMany({
    where: {
      activityId: activity.id,
      status: 'COMPLETED',
    },
    select: { durationMinutes: true },
  })

  const totalMinutes = allCompletions.reduce((acc, c) => acc + c.durationMinutes, 0)
  const totalCompletedCount = allCompletions.length

  return NextResponse.json({
    activity,
    stats: {
      totalHours: (totalMinutes / 60).toFixed(1),
      totalMinutes,
      totalCompletedCount,
      currentStreak: activity.streakRecords[0]?.currentStreak || 0,
      longestStreak: activity.streakRecords[0]?.longestStreak || 0,
    },
  })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await prisma.activity.findUnique({
    where: { id: params.id },
  })

  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
  }

  try {
    const data = await req.json()

    const updated = await prisma.activity.update({
      where: { id: params.id },
      data: {
        name: data.name !== undefined ? data.name.trim() : undefined,
        category: data.category !== undefined ? data.category : undefined,
        description: data.description !== undefined ? data.description : undefined,
        targetMinutes: data.targetMinutes !== undefined ? Number(data.targetMinutes) : undefined,
        preferredTime: data.preferredTime !== undefined ? data.preferredTime : undefined,
        activeDays: data.activeDays !== undefined ? data.activeDays : undefined,
        restDays: data.restDays !== undefined ? data.restDays : undefined,
        color: data.color !== undefined ? data.color : undefined,
        icon: data.icon !== undefined ? data.icon : undefined,
        isPaused: data.isPaused !== undefined ? Boolean(data.isPaused) : undefined,
      },
    })

    // Recalculate streak if schedule or pause state changed
    if (data.activeDays !== undefined || data.isPaused !== undefined) {
      await recalculateActivityStreak(user.id, updated.id, user.timezone)
    }

    return NextResponse.json({ success: true, activity: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await prisma.activity.findUnique({
    where: { id: params.id },
  })

  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
  }

  await prisma.activity.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ success: true, message: 'Activity deleted' })
}

