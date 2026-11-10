import { prisma } from './prisma'

export async function exportUserDataJSON(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      timezone: true,
      createdAt: true,
      profile: true,
      settings: true,
      activities: {
        include: {
          completions: {
            include: {
              proofImages: true,
            },
          },
          streakRecords: true,
        },
      },
      goals: true,
      milestones: true,
      loginRecords: true,
      weeklyReports: true,
      monthlyReports: true,
    },
  })

  return user
}

export async function exportUserJournalCSV(userId: string): Promise<string> {
  const completions = await prisma.dailyCompletion.findMany({
    where: {
      userId,
      status: 'COMPLETED',
    },
    include: {
      activity: {
        select: { name: true, category: true },
      },
      proofImages: true,
    },
    orderBy: { date: 'desc' },
  })

  const headers = [
    'Date',
    'Activity Name',
    'Category',
    'Duration (Minutes)',
    'Accomplishments',
    'Learnings',
    'Problems Solved',
    'Personal Notes',
    'Proof Image URLs',
  ]

  const escapeCSV = (str: string | null | undefined) => {
    if (!str) return '""'
    return `"${str.replace(/"/g, '""').replace(/\n/g, ' ')}"`
  }

  const rows = completions.map((c) => [
    escapeCSV(c.date),
    escapeCSV(c.activity.name),
    escapeCSV(c.activity.category),
    c.durationMinutes,
    escapeCSV(c.accomplishments),
    escapeCSV(c.learnings),
    escapeCSV(c.problemsSolved),
    escapeCSV(c.personalNotes),
    escapeCSV(c.proofImages.map((p) => p.imageUrl).join('; ')),
  ])

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
}

