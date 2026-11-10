import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { endpoint, keys } = await req.json()

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return NextResponse.json({ error: 'Invalid subscription payload' }, { status: 400 })
    }

    const sub = await prisma.pushSubscription.upsert({
      where: { endpoint },
      create: {
        userId: user.id,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
      update: {
        userId: user.id,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    })

    // Update settings to mark pushNotificationsEnabled = true
    await prisma.userSettings.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        pushNotificationsEnabled: true,
      },
      update: {
        pushNotificationsEnabled: true,
      },
    })

    return NextResponse.json({ success: true, subscription: sub })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

