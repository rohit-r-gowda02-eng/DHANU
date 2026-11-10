import { NextRequest } from 'next/server'
import { createLogoutResponse } from '@/lib/auth'

export async function POST(req: NextRequest) {
  return createLogoutResponse()
}

