import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  })

  return NextResponse.json({ user, profile })
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const {
      name,
      bio,
      profession,
      dailyCommitmentMinutes,
      targetWakeupTime,
      targetSleepTime,
      weeklyTargetHours,
      timezone,
    } = await req.json()

    // Update user info
    if (name || timezone) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: name ? name.trim() : user.name,
          timezone: timezone || user.timezone,
        },
      })
    }

    // Update profile
    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        bio: bio || null,
        profession: profession || null,
        dailyCommitmentMinutes: Number(dailyCommitmentMinutes) || 120,
        targetWakeupTime: targetWakeupTime || '06:30',
        targetSleepTime: targetSleepTime || '23:00',
        weeklyTargetHours: Number(weeklyTargetHours) || 14.0,
      },
      update: {
        bio: bio !== undefined ? bio : undefined,
        profession: profession !== undefined ? profession : undefined,
        dailyCommitmentMinutes: dailyCommitmentMinutes ? Number(dailyCommitmentMinutes) : undefined,
        targetWakeupTime: targetWakeupTime || undefined,
        targetSleepTime: targetSleepTime || undefined,
        weeklyTargetHours: weeklyTargetHours ? Number(weeklyTargetHours) : undefined,
      },
    })

    return NextResponse.json({ message: 'Profile updated successfully', profile })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

