import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('photo') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']
    if (!validTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|webp|gif|heic)$/i)) {
      return NextResponse.json({ error: 'Invalid file type. Only photographic proof images (JPEG, PNG, WebP) are permitted.' }, { status: 400 })
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image exceeds maximum allowed size of 10MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique safe filename
    const ext = path.extname(file.name) || '.jpg'
    const randomHex = crypto.randomBytes(16).toString('hex')
    const fileName = `proof_${user.id}_${Date.now()}_${randomHex}${ext}`

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'proofs')
    await fs.mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, fileName)
    await fs.writeFile(filePath, buffer)

    const publicUrl = `/uploads/proofs/${fileName}`

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      fileName,
      fileSizeBytes: file.size,
      mimeType: file.type || 'image/jpeg',
    })
  } catch (err: any) {
    console.error('Proof upload error:', err)
    return NextResponse.json({ error: err.message || 'Failed to upload proof image' }, { status: 500 })
  }
}

