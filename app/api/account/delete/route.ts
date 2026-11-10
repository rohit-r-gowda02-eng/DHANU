import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, createLogoutResponse } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // Delete user (cascade handles relations)
    await prisma.user.delete({
      where: { id: user.id },
    })

    const logoutResponse = createLogoutResponse()
    return logoutResponse
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

