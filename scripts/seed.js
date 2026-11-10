const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding DHANU database...')

  const demoEmail = 'alex@dhanu.growth'
  const existing = await prisma.user.findUnique({ where: { email: demoEmail } })

  if (existing) {
    console.log('Demo user alex@dhanu.growth already exists. Skipping seed.')
    return
  }

  const passwordHash = await bcrypt.hash('Dhanu2026!', 10)
  const today = new Date().toISOString().split('T')[0]

  // Helper for past dates
  const pastDate = (daysAgo) => {
    const d = new Date()
    d.setDate(d.getDate() - daysAgo)
    return d.toISOString().split('T')[0]
  }

  const user = await prisma.user.create({
    data: {
      email: demoEmail,
      passwordHash,
      name: 'Alex Rivera',
      timezone: 'UTC',
      profile: {
        create: {
          bio: 'Senior software engineer dedicated to relentless consistency and algorithmic mastery.',
          profession: 'Software Engineer',
          dailyCommitmentMinutes: 240,
          weeklyTargetHours: 28.0,
          onboardingCompleted: true,
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
  })

  console.log(`Created user ${user.name} (${user.email})`)

  // Create core activities
  const actDsa = await prisma.activity.create({
    data: {
      userId: user.id,
      name: 'DSA Practice',
      category: 'Problem Solving',
      description: 'Dynamic programming, graph algorithms, and system design patterns.',
      targetMinutes: 120,
      preferredTime: '07:00',
      activeDays: 'MON,TUE,WED,THU,FRI,SAT',
      restDays: 'SUN',
      color: '#D4AF37',
      icon: 'Binary',
      orderIndex: 0,
    },
  })

  const actDev = await prisma.activity.create({
    data: {
      userId: user.id,
      name: 'Project Development',
      category: 'Engineering',
      description: 'Building production distributed systems and clean microservices.',
      targetMinutes: 90,
      preferredTime: '18:00',
      activeDays: 'MON,TUE,WED,THU,FRI',
      restDays: 'SAT,SUN',
      color: '#059669',
      icon: 'Code',
      orderIndex: 1,
    },
  })

  const actFitness = await prisma.activity.create({
    data: {
      userId: user.id,
      name: 'Strength & Conditioning',
      category: 'Physical Health',
      description: 'High intensity resistance training and zone-2 cardiovascular conditioning.',
      targetMinutes: 45,
      preferredTime: '06:00',
      activeDays: 'MON,TUE,WED,THU,FRI,SAT,SUN',
      restDays: '',
      color: '#10B981',
      icon: 'Dumbbell',
      orderIndex: 2,
    },
  })

  const actReading = await prisma.activity.create({
    data: {
      userId: user.id,
      name: 'Technical Reading',
      category: 'Knowledge',
      description: 'Database internals, operating systems papers, and computer science literature.',
      targetMinutes: 30,
      preferredTime: '21:30',
      activeDays: 'MON,TUE,WED,THU,FRI,SAT,SUN',
      restDays: '',
      color: '#F59E0B',
      icon: 'BookOpen',
      orderIndex: 3,
    },
  })

  // Create historical completions for past 14 days to build a genuine streak
  for (let i = 14; i >= 1; i--) {
    const d = pastDate(i)

    // DSA
    const c1 = await prisma.dailyCompletion.create({
      data: {
        userId: user.id,
        activityId: actDsa.id,
        date: d,
        status: 'COMPLETED',
        durationMinutes: 120,
        accomplishments: `Solved 3 hard Graph BFS/DFS LeetCode problems (Day -${i}).`,
        learnings: 'Mastered topological sort with Kahn algorithm and cycle detection in directed graphs.',
        problemsSolved: 'Resolved off-by-one index traversal in matrix coordinate memoization.',
        completedAt: new Date(Date.now() - i * 86400000),
      },
    })

    // Proof image for c1
    await prisma.proofImage.create({
      data: {
        dailyCompletionId: c1.id,
        imageUrl: '/icons/icon-512.png',
        caption: `LeetCode verified submission runtime 14ms (beat 96%).`,
      },
    })

    // Login record
    await prisma.loginRecord.create({
      data: {
        userId: user.id,
        date: d,
      },
    })
  }

  // Create streaks
  await prisma.streakRecord.create({
    data: {
      userId: user.id,
      type: 'LOGIN',
      activityId: null,
      currentStreak: 14,
      longestStreak: 14,
      totalActiveDays: 14,
      lastRecordedDate: pastDate(1),
    },
  })

  await prisma.streakRecord.create({
    data: {
      userId: user.id,
      type: 'ACTIVITY',
      activityId: actDsa.id,
      currentStreak: 14,
      longestStreak: 14,
      totalActiveDays: 14,
      lastRecordedDate: pastDate(1),
    },
  })

  // Create Milestones
  await prisma.milestone.create({
    data: {
      userId: user.id,
      title: '7-Day Unbroken Momentum',
      description: 'Maintained 7 consecutive days of discipline without a single slip.',
      milestoneType: 'STREAK_7',
      icon: 'Flame',
      category: 'STREAK',
      achievedAt: new Date(Date.now() - 7 * 86400000),
    },
  })

  await prisma.milestone.create({
    data: {
      userId: user.id,
      title: '14-Day Fortitude',
      description: 'Two continuous weeks of deliberate effort and daily proof.',
      milestoneType: 'STREAK_14',
      icon: 'Shield',
      category: 'STREAK',
      achievedAt: new Date(Date.now() - 1 * 86400000),
    },
  })

  // Create Goal
  await prisma.goal.create({
    data: {
      userId: user.id,
      title: 'Solve 300 Hard Algorithmic Problems',
      description: 'Complete rigorous interview prep for senior systems engineering.',
      category: 'Algorithms',
      targetValue: 300,
      currentValue: 124,
      unit: 'problems',
      startDate: pastDate(30),
      targetDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      status: 'IN_PROGRESS',
    },
  })

  // Create initial notification
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: '14-Day Fortitude Unlocked',
      message: 'You have completed 14 continuous days of verified actions. Keep the fire burning.',
      type: 'MILESTONE_UNLOCKED',
      linkUrl: '/streaks',
    },
  })

  console.log('Seed finished successfully! Demo account: alex@dhanu.growth / Dhanu2026!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

