import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const achievedMilestones = await prisma.milestone.findMany({
      where: { userId: user.id },
      orderBy: { achievedAt: 'desc' },
    })

    const allStandardMilestones = [
      {
        type: 'FIRST_ACTIVITY',
        title: 'First Step to Mastery',
        description: 'Completed your very first activity with photographic proof.',
        icon: 'Sparkles',
        category: 'FOUNDATION',
      },
      {
        type: 'STREAK_7',
        title: '7-Day Unbroken Momentum',
        description: 'Maintained 7 consecutive days of discipline without a single slip.',
        icon: 'Flame',
        category: 'STREAK',
      },
      {
        type: 'STREAK_14',
        title: '14-Day Fortitude',
        description: 'Two continuous weeks of deliberate effort and daily proof.',
        icon: 'Shield',
        category: 'STREAK',
      },
      {
        type: 'STREAK_30',
        title: '30-Day Iron Discipline',
        description: 'Formed an unshakeable identity. Consistency is now your standard.',
        icon: 'Trophy',
        category: 'STREAK',
      },
      {
        type: 'STREAK_60',
        title: '60-Day Consistency Master',
        description: 'Two full months of verified daily progress.',
        icon: 'Award',
        category: 'STREAK',
      },
      {
        type: 'STREAK_100',
        title: 'Centurion 100-Day Legend',
        description: 'Completed 100 days of proof. Belonging to the elite 1% of disciplined individuals.',
        icon: 'Crown',
        category: 'STREAK',
      },
      {
        type: 'HOURS_50',
        title: '50 Hours of Verified Growth',
        description: 'Invested 50 documented hours into high-value skill progression.',
        icon: 'Clock',
        category: 'HOURS',
      },
      {
        type: 'HOURS_100',
        title: '100 Hours of Deep Practice',
        description: '100 hours of focused craftsmanship and real problem solving.',
        icon: 'Zap',
        category: 'HOURS',
      },
    ]

    const achievedTypes = new Set(achievedMilestones.map((m) => m.milestoneType))

    const mapped = allStandardMilestones.map((std) => ({
      ...std,
      isUnlocked: achievedTypes.has(std.type),
      achievedAt: achievedMilestones.find((m) => m.milestoneType === std.type)?.achievedAt || null,
    }))

    return NextResponse.json({
      achieved: achievedMilestones,
      standards: mapped,
      totalUnlocked: achievedMilestones.length,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

