import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'dhanu_secure_jwt_secret_default_key_2026'

export interface TokenPayload {
  userId: string
  email: string
  name: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  // Check Authorization header
  const authHeader = req.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Check Cookie
  const cookie = req.cookies.get('dhanu_token')
  if (cookie && cookie.value) {
    return cookie.value
  }

  return null
}

export async function getCurrentUser(req: NextRequest) {
  const token = getTokenFromRequest(req)
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload || !payload.userId) return null

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        profile: true,
        settings: true,
      },
    })

    if (user) {
      // Update lastActiveAt non-blockingly
      prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
      }).catch(() => {})
    }

    return user
  } catch (err) {
    console.error('Error fetching current user:', err)
    return null
  }
}

export function createAuthResponse(
  body: Record<string, unknown>,
  token: string,
  status = 200
): NextResponse {
  const response = NextResponse.json(body, { status })
  response.cookies.set('dhanu_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return response
}

export function createLogoutResponse(): NextResponse {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' })
  response.cookies.set('dhanu_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}

