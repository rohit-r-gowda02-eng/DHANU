import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserLocalDate, recalculateActivityStreak } from '@/lib/streaks'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const {
      activityId,
      date,
      status = 'COMPLETED',
      durationMinutes,
      accomplishments,
      learnings,
      problemsSolved,
      personalNotes,
      proofImages,
    } = await req.json()

    if (!activityId) {
      return NextResponse.json({ error: 'activityId is required' }, { status: 400 })
    }

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    })

    if (!activity || activity.userId !== user.id) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }

    const completionDate = date || getUserLocalDate(user.timezone)

    // For status = COMPLETED, enforce mandatory fields as per product rules
    if (status === 'COMPLETED') {
      if (!accomplishments || accomplishments.trim().length === 0) {
        return NextResponse.json({ error: 'Accomplishment description is required' }, { status: 400 })
      }
      if (!learnings || learnings.trim().length === 0) {
        return NextResponse.json({ error: 'Learnings description is required' }, { status: 400 })
      }
      if (!problemsSolved || problemsSolved.trim().length === 0) {
        return NextResponse.json({ error: 'Problems solved description is required' }, { status: 400 })
      }
      if (durationMinutes === undefined || Number(durationMinutes) <= 0) {
        return NextResponse.json({ error: 'Actual duration spent is required' }, { status: 400 })
      }
      if (!proofImages || !Array.isArray(proofImages) || proofImages.length === 0) {
        return NextResponse.json({ error: 'Photographic proof upload is mandatory to verify completion' }, { status: 400 })
      }
    }

    // Upsert DailyCompletion
    const completion = await prisma.dailyCompletion.upsert({
      where: {
        userId_activityId_date: {
          userId: user.id,
          activityId,
          date: completionDate,
        },
      },
      create: {
        userId: user.id,
        activityId,
        date: completionDate,
        status,
        durationMinutes: Number(durationMinutes) || 0,
        accomplishments: accomplishments?.trim() || null,
        learnings: learnings?.trim() || null,
        problemsSolved: problemsSolved?.trim() || null,
        personalNotes: personalNotes?.trim() || null,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
      update: {
        status,
        durationMinutes: durationMinutes !== undefined ? Number(durationMinutes) : undefined,
        accomplishments: accomplishments !== undefined ? accomplishments.trim() : undefined,
        learnings: learnings !== undefined ? learnings.trim() : undefined,
        problemsSolved: problemsSolved !== undefined ? problemsSolved.trim() : undefined,
        personalNotes: personalNotes !== undefined ? personalNotes.trim() : undefined,
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
      },
      include: {
        proofImages: true,
      },
    })

    // If proof images provided, attach them
    if (proofImages && Array.isArray(proofImages) && proofImages.length > 0) {
      for (const img of proofImages) {
        if (img.imageUrl) {
          await prisma.proofImage.create({
            data: {
              dailyCompletionId: completion.id,
              imageUrl: img.imageUrl,
              thumbnailUrl: img.thumbnailUrl || img.imageUrl,
              caption: img.caption || null,
              fileSizeBytes: img.fileSizeBytes || null,
              mimeType: img.mimeType || 'image/jpeg',
            },
          })
        }
      }
    }

    // Update user's lastActiveAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    })

    // Recalculate streak for this activity
    const updatedStreak = await recalculateActivityStreak(user.id, activityId, user.timezone)

    // Check total hours milestone
    const totalCompletions = await prisma.dailyCompletion.findMany({
      where: { userId: user.id, status: 'COMPLETED' },
      select: { durationMinutes: true },
    })
    const totalMinutes = totalCompletions.reduce((acc, c) => acc + c.durationMinutes, 0)
    const totalHours = Math.floor(totalMinutes / 60)

    if (totalHours >= 50) {
      const existing50 = await prisma.milestone.findFirst({
        where: { userId: user.id, milestoneType: 'HOURS_50' },
      })
      if (!existing50) {
        await prisma.milestone.create({
          data: {
            userId: user.id,
            title: '50 Hours of Verified Growth',
            description: 'Dedicated 50 full hours of documented consistency.',
            milestoneType: 'HOURS_50',
            icon: 'Clock',
            category: 'LEARNING_HOURS',
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      completion,
      streak: updatedStreak,
      message: 'Verified completion recorded successfully',
    })
  } catch (err: any) {
    console.error('Completion submission error:', err)
    return NextResponse.json({ error: err.message || 'Failed to record completion' }, { status: 500 })
  }
}

