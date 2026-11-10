import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { activityIds } = await req.json()

    if (!Array.isArray(activityIds)) {
      return NextResponse.json({ error: 'activityIds array required' }, { status: 400 })
    }

    await prisma.$transaction(
      activityIds.map((id, index) =>
        prisma.activity.updateMany({
          where: { id, userId: user.id },
          data: { orderIndex: index },
        })
      )
    )

    return NextResponse.json({ success: true, message: 'Activities reordered' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

