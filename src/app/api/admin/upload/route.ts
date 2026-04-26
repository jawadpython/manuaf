import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'
import { authOptions } from '@/lib/auth'
import { ADMIN_IMAGE_MAX_EDGE, MEGA_MENU_IMAGE_MAX_EDGE } from '@/lib/adminImageUpload'

/** Resize + re-encode every raster admin upload (GIF skipped — animation). */
async function optimizeRasterUpload(
  input: Buffer,
  preset: 'default' | 'megaMenu'
): Promise<{ buffer: Buffer; mime: string; ext: string } | null> {
  try {
    if (preset === 'megaMenu') {
      const out = await sharp(input)
        .rotate()
        .resize(MEGA_MENU_IMAGE_MAX_EDGE, MEGA_MENU_IMAGE_MAX_EDGE, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .jpeg({ mozjpeg: true, quality: 82 })
        .toBuffer()
      return { buffer: Buffer.from(out), mime: 'image/jpeg', ext: 'jpg' }
    }

    const meta = await sharp(input).metadata()
    const pipeline = sharp(input)
      .rotate()
      .resize(ADMIN_IMAGE_MAX_EDGE, ADMIN_IMAGE_MAX_EDGE, {
        fit: 'inside',
        withoutEnlargement: true,
      })

    if (meta.hasAlpha) {
      const out = await pipeline.png({ compressionLevel: 9, effort: 9 }).toBuffer()
      return { buffer: Buffer.from(out), mime: 'image/png', ext: 'png' }
    }

    const out = await pipeline.jpeg({ mozjpeg: true, quality: 85 }).toBuffer()
    return { buffer: Buffer.from(out), mime: 'image/jpeg', ext: 'jpg' }
  } catch (err) {
    console.error('Admin upload image optimize failed:', err)
    return null
  }
}

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

  const presetRaw = formData.get('preset')
  const preset: 'default' | 'megaMenu' =
    typeof presetRaw === 'string' && presetRaw === 'megaMenu' ? 'megaMenu' : 'default'

  const originalBuffer = Buffer.from(await file.arrayBuffer())
  let uploadBuffer = originalBuffer
  let uploadMime = file.type
  let ext = file.name.split('.').pop() || 'jpg'

  if (file.type !== 'image/gif') {
    const optimized = await optimizeRasterUpload(originalBuffer, preset)
    if (optimized) {
      uploadBuffer = Buffer.from(optimized.buffer)
      uploadMime = optimized.mime
      ext = optimized.ext
    }
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const fileForStorage = new File([uploadBuffer], filename, { type: uploadMime })

  // Priority 1: Cloudinary (if configured)
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    const cloudinaryUrl = await uploadToCloudinary(fileForStorage)
    if (cloudinaryUrl) {
      return NextResponse.json({ url: cloudinaryUrl })
    }
  }

  // Priority 2: Vercel Blob (if configured)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(filename, fileForStorage, { access: 'public' })
      return NextResponse.json({ url: blob.url })
    } catch (error) {
      console.error('Vercel Blob upload failed:', error)
    }
  }

  // Priority 3: Local storage (development only – does NOT work on Vercel)
  const isVercel = !!process.env.VERCEL
  if (isVercel) {
    return NextResponse.json(
      {
        error:
          "Impossible d'enregistrer l'image : aucun stockage cloud configuré. " +
          "Ajoutez BLOB_READ_WRITE_TOKEN (Vercel → Storage → Blob) ou CLOUDINARY_CLOUD_NAME dans les variables d'environnement Vercel.",
      },
      { status: 503 }
    )
  }

  try {
    const buffer = uploadBuffer
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
      {
        error:
          "Erreur lors de l'enregistrement local. En production, configurez Vercel Blob ou Cloudinary.",
      },
      { status: 500 }
    )
  }
}
