import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  })

  if (!settings) {
    settings = await prisma.userSettings.create({
      data: {
        userId: user.id,
        inactivityReminderEnabled: true,
        inactivityIntervalHours: 4,
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
        pushNotificationsEnabled: false,
        soundEnabled: true,
      },
    })
  }

  return NextResponse.json({ settings })
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()

    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        inactivityReminderEnabled: data.inactivityReminderEnabled ?? true,
        inactivityIntervalHours: Number(data.inactivityIntervalHours) || 4,
        quietHoursStart: data.quietHoursStart || '22:00',
        quietHoursEnd: data.quietHoursEnd || '07:00',
        pushNotificationsEnabled: data.pushNotificationsEnabled ?? false,
        soundEnabled: data.soundEnabled ?? true,
        theme: data.theme || 'dark',
        reminderTextCustom: data.reminderTextCustom || null,
      },
      update: {
        inactivityReminderEnabled: data.inactivityReminderEnabled !== undefined ? Boolean(data.inactivityReminderEnabled) : undefined,
        inactivityIntervalHours: data.inactivityIntervalHours !== undefined ? Number(data.inactivityIntervalHours) : undefined,
        quietHoursStart: data.quietHoursStart || undefined,
        quietHoursEnd: data.quietHoursEnd || undefined,
        pushNotificationsEnabled: data.pushNotificationsEnabled !== undefined ? Boolean(data.pushNotificationsEnabled) : undefined,
        soundEnabled: data.soundEnabled !== undefined ? Boolean(data.soundEnabled) : undefined,
        theme: data.theme || undefined,
        reminderTextCustom: data.reminderTextCustom !== undefined ? data.reminderTextCustom : undefined,
      },
    })

    return NextResponse.json({ success: true, settings })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

