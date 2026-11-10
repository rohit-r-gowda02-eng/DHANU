import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') || ''
  const activityId = searchParams.get('activityId') || ''
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''

  try {
    const whereClause: any = {
      userId: user.id,
      status: 'COMPLETED',
    }

    if (activityId) {
      whereClause.activityId = activityId
    }

    if (startDate && endDate) {
      whereClause.date = { gte: startDate, lte: endDate }
    } else if (startDate) {
      whereClause.date = { gte: startDate }
    } else if (endDate) {
      whereClause.date = { lte: endDate }
    }

    if (query) {
      whereClause.OR = [
        { accomplishments: { contains: query } },
        { learnings: { contains: query } },
        { problemsSolved: { contains: query } },
        { personalNotes: { contains: query } },
        { activity: { name: { contains: query } } },
      ]
    }

    const entries = await prisma.dailyCompletion.findMany({
      where: whereClause,
      include: {
        activity: {
          select: {
            id: true,
            name: true,
            category: true,
            color: true,
            icon: true,
          },
        },
        proofImages: true,
      },
      orderBy: { date: 'desc' },
    })

    // Also get all distinct activities for the filter dropdown
    const userActivities = await prisma.activity.findMany({
      where: { userId: user.id },
      select: { id: true, name: true, category: true },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      entries,
      totalCount: entries.length,
      activities: userActivities,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, accomplishments, learnings, problemsSolved, personalNotes } = await req.json()

    if (!id) return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 })

    const existing = await prisma.dailyCompletion.findUnique({
      where: { id },
    })

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    const updated = await prisma.dailyCompletion.update({
      where: { id },
      data: {
        accomplishments: accomplishments !== undefined ? accomplishments.trim() : undefined,
        learnings: learnings !== undefined ? learnings.trim() : undefined,
        problemsSolved: problemsSolved !== undefined ? problemsSolved.trim() : undefined,
        personalNotes: personalNotes !== undefined ? personalNotes.trim() : undefined,
      },
      include: {
        activity: true,
        proofImages: true,
      },
    })

    return NextResponse.json({ success: true, entry: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
