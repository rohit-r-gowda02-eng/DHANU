import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, signToken, createAuthResponse } from '@/lib/auth'
import { recordDailyLogin } from '@/lib/streaks'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, timezone } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)
    const userTimezone = timezone || 'UTC'

    // Create User, Profile, and Settings in a transaction
    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        name: name.trim(),
        timezone: userTimezone,
        profile: {
          create: {
            onboardingCompleted: false,
            dailyCommitmentMinutes: 120,
            weeklyTargetHours: 14.0,
          },
        },
        settings: {
          create: {
            inactivityReminderEnabled: true,
            inactivityIntervalHours: 4,
            quietHoursStart: '22:00',
            quietHoursEnd: '07:00',
            pushNotificationsEnabled: false,
            soundEnabled: true,
          },
        },
      },
      include: {
        profile: true,
        settings: true,
      },
    })

    // Record initial daily login
    await recordDailyLogin(user.id, userTimezone)

    // Sign JWT
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
          onboardingCompleted: false,
        },
        message: 'Account created successfully',
      },
      token,
      201
    )
  } catch (err: any) {
    console.error('Signup error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error during registration' },
      { status: 500 }
    )
  }
}

