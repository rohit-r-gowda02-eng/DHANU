import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { checkAndSendInactivityReminder, isInQuietHours } from '@/lib/notifications'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const simulate = searchParams.get('simulate') === 'true'

  try {
    if (simulate) {
      // Simulate that 4.5 hours have elapsed since last activity
      const fourAndHalfHoursAgo = new Date(Date.now() - 4.5 * 60 * 60 * 1000)
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: fourAndHalfHoursAgo },
      })

      // Send reminder
      const result = await checkAndSendInactivityReminder(user.id)
      return NextResponse.json({
        success: true,
        simulation: true,
        result,
        message: 'Simulated 4-hour inactivity check executed.',
      })
    }

    const result = await checkAndSendInactivityReminder(user.id)
    return NextResponse.json({ success: true, result })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  return GET(req)
}

