import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserLocalDate } from '@/lib/streaks'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const unreadNotifications = await prisma.notification.count({
      where: {
        userId: user.id,
        isRead: false,
      },
    })

    const loginStreak = await prisma.streakRecord.findFirst({
      where: {
        userId: user.id,
        type: 'LOGIN',
      },
    })

    const today = getUserLocalDate(user.timezone)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        timezone: user.timezone,
        avatarUrl: user.avatarUrl,
        lastActiveAt: user.lastActiveAt,
        createdAt: user.createdAt,
      },
      profile: user.profile,
      settings: user.settings,
      unreadNotifications,
      streak: loginStreak
        ? {
            currentStreak: loginStreak.currentStreak,
            longestStreak: loginStreak.longestStreak,
            totalActiveDays: loginStreak.totalActiveDays,
          }
        : { currentStreak: 1, longestStreak: 1, totalActiveDays: 1 },
      today,
    })
  } catch (err: any) {
    console.error('Auth me error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
