import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { authOptions } from '@/lib/auth'

async function uploadToCloudinary(file: File): Promise<string | null> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return null
  }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Use FormData with proper field name
    const formData = new FormData()
    formData.append('file', dataURI)
    formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || 'default')
    
    // Add API key if available
    if (process.env.CLOUDINARY_API_KEY) {
      formData.append('api_key', process.env.CLOUDINARY_API_KEY)
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Cloudinary upload failed:', errorText)
      return null
    }

    const data = await response.json()
    return data.secure_url || data.url || null
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return null
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'Fichier trop volumineux (max 10MB)' }, { status: 400 })
  }

  // Restrict to allowed image MIME types
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Type de fichier non autorisé. Utilisez JPEG, PNG, WebP ou GIF.' },
      { status: 400 }
    )
  }

  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  // Priority 1: Cloudinary (if configured)
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    const cloudinaryUrl = await uploadToCloudinary(file)
    if (cloudinaryUrl) {
      return NextResponse.json({ url: cloudinaryUrl })
    }
  }

  // Priority 2: Vercel Blob (if configured)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(filename, file, { access: 'public' })
      return NextResponse.json({ url: blob.url })
    } catch (error) {
      console.error('Vercel Blob upload failed:', error)
    }
  }

  // Priority 3: Local storage (development only)
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    return NextResponse.json({
      url: `/uploads/${filename}`,
    })
  } catch (error) {
    console.error('Local storage upload failed:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement local' },
      { status: 500 }
    )
  }
}
