import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { aiService } from '@/lib/ai/aiService'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    // Compute progress percentage and AI predictive velocity for each goal
    const enrichedGoals = await Promise.all(
      goals.map(async (g) => {
        const percent = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100))
        const startDate = new Date(g.startDate).getTime()
        const targetDate = new Date(g.targetDate).getTime()
        const now = Date.now()

        const totalDays = Math.max(1, Math.round((targetDate - startDate) / (1000 * 60 * 60 * 24)))
        const daysElapsed = Math.max(1, Math.round((now - startDate) / (1000 * 60 * 60 * 24)))

        const prediction = await aiService.predictGoalCompletion({
          currentValue: g.currentValue,
          targetValue: g.targetValue,
          daysElapsed,
          totalDays,
          recentDailyAverage: g.currentValue / daysElapsed,
        })

        return {
          ...g,
          percent,
          totalDays,
          daysElapsed,
          daysRemaining: Math.max(0, Math.round((targetDate - now) / (1000 * 60 * 60 * 24))),
          prediction,
        }
      })
    )

    return NextResponse.json({ goals: enrichedGoals })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { title, description, category, targetValue, currentValue, unit, startDate, targetDate } =
      await req.json()

    if (!title || !targetValue || !unit) {
      return NextResponse.json({ error: 'Title, target value, and unit are required' }, { status: 400 })
    }

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        category: category || 'General',
        targetValue: Number(targetValue),
        currentValue: Number(currentValue) || 0,
        unit: unit.trim(),
        startDate: startDate || new Date().toISOString().split('T')[0],
        targetDate: targetDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
        status: 'IN_PROGRESS',
      },
    })

    return NextResponse.json({ success: true, goal }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, title, description, category, targetValue, currentValue, unit, targetDate, status } =
      await req.json()

    if (!id) return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 })

    const existing = await prisma.goal.findUnique({ where: { id } })
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    const updated = await prisma.goal.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : undefined,
        description: description !== undefined ? description.trim() : undefined,
        category: category !== undefined ? category : undefined,
        targetValue: targetValue !== undefined ? Number(targetValue) : undefined,
        currentValue: currentValue !== undefined ? Number(currentValue) : undefined,
        unit: unit !== undefined ? unit.trim() : undefined,
        targetDate: targetDate !== undefined ? targetDate : undefined,
        status: status !== undefined ? status : undefined,
      },
    })

    return NextResponse.json({ success: true, goal: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'Goal ID required' }, { status: 400 })

  const existing = await prisma.goal.findUnique({ where: { id } })
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
  }

  await prisma.goal.delete({ where: { id } })

  return NextResponse.json({ success: true, message: 'Goal removed' })
}

