import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, signToken, createAuthResponse } from '@/lib/auth'
import { recordDailyLogin } from '@/lib/streaks'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        profile: true,
        settings: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Update lastActiveAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    })

    // Record login and update streak
    const streak = await recordDailyLogin(user.id, user.timezone)

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    })

    return createAuthResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          timezone: user.timezone,
          onboardingCompleted: user.profile?.onboardingCompleted ?? false,
        },
        streak: {
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          totalActiveDays: streak.totalActiveDays,
        },
        message: 'Logged in successfully',
      },
      token,
      200
    )
  } catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error during login' },
      { status: 500 }
    )
  }
}

