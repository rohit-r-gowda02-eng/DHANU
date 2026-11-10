import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { activities, initialGoal } = await req.json()

    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return NextResponse.json(
        { error: 'Please define at least one daily activity for your routine' },
        { status: 400 }
      )
    }

    // Create activities transaction
    await prisma.$transaction(async (tx) => {
      // 1. Create each activity
      for (let i = 0; i < activities.length; i++) {
        const act = activities[i]
        await tx.activity.create({
          data: {
            userId: user.id,
            name: act.name.trim(),
            category: act.category || 'Focus',
            description: act.description || null,
            targetMinutes: Number(act.targetMinutes) || 60,
            preferredTime: act.preferredTime || '09:00',
            activeDays: act.activeDays || 'MON,TUE,WED,THU,FRI,SAT,SUN',
            restDays: act.restDays || '',
            color: act.color || '#D4AF37',
            icon: act.icon || 'Target',
            orderIndex: i,
          },
        })
      }

      // 2. Create initial personal goal if provided
      if (initialGoal && initialGoal.title) {
        await tx.goal.create({
          data: {
            userId: user.id,
            title: initialGoal.title.trim(),
            description: initialGoal.description || null,
            category: initialGoal.category || 'Growth',
            targetValue: Number(initialGoal.targetValue) || 100,
            currentValue: 0,
            unit: initialGoal.unit || 'units',
            startDate: new Date().toISOString().split('T')[0],
            targetDate: initialGoal.targetDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
            status: 'IN_PROGRESS',
          },
        })
      }

      // 3. Mark profile onboarding as completed
      await tx.userProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          onboardingCompleted: true,
        },
        update: {
          onboardingCompleted: true,
        },
      })

      // 4. Create initial welcome notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: 'Welcome to DHANU',
          message: 'Your personal routine is configured. Consistency creates progress — prove it through your daily actions.',
          type: 'SYSTEM',
          linkUrl: '/dashboard',
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully. Routine initialized.',
    })
  } catch (err: any) {
    console.error('Onboarding error:', err)
    return NextResponse.json({ error: err.message || 'Failed to complete routine setup' }, { status: 500 })
  }
}

