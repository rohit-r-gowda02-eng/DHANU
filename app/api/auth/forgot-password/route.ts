import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dhanu_secure_jwt_secret_default_key_2026'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } })

    if (!user) {
      // Do not leak user existence for security, return positive message
      return NextResponse.json({
        message: 'If an account with this email exists, a password reset link has been dispatched.',
      })
    }

    // Generate temporary 1-hour reset token
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email, type: 'pwd_reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    // In production, send via email provider. In self-contained environment, return token for testing
    return NextResponse.json({
      message: 'Password reset link generated successfully.',
      resetToken, // Provided directly for immediate development testing
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

