/**
 * Client-only helpers for admin image uploads (same endpoint as Category/Product forms).
 * Resizes large rasters before POST to stay within /api/admin/upload limits and load faster.
 */

export const ADMIN_UPLOAD_MAX_BYTES = 10 * 1024 * 1024
export const ADMIN_IMAGE_MAX_EDGE = 1600

/**
 * Downscale wide/tall images and re-encode (JPEG for photos, PNG kept for PNG sources).
 * GIF / SVG are left unchanged. Falls back to original file if decoding fails.
 */
export async function compressImageFileForAdmin(file: File): Promise<File> {
  if (typeof window === 'undefined') return file
  if (!file.type.startsWith('image/')) return file
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file

  let bitmap: ImageBitmap | null = null
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return file
  }

  try {
    const { width: ow, height: oh } = bitmap
    const scale = Math.min(1, ADMIN_IMAGE_MAX_EDGE / Math.max(ow, oh))

    if (scale >= 1 && file.size <= 750 * 1024) {
      return file
    }

    const w = Math.round(ow * scale)
    const h = Math.round(oh * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    const usePng = file.type === 'image/png'
    if (!usePng) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
    }
    ctx.drawImage(bitmap, 0, 0, w, h)

    const blob = await new Promise<Blob | null>((resolve) => {
      if (usePng) {
        canvas.toBlob((b) => resolve(b), 'image/png')
      } else {
        canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.85)
      }
    })

    if (!blob) return file

    const base =
      file.name.replace(/\.[^.\\/]+$/, '').replace(/[^\w.-]+/g, '_') || 'image'
    const ext = usePng ? 'png' : 'jpg'
    const mime = usePng ? 'image/png' : 'image/jpeg'
    return new File([blob], `${base}.${ext}`, { type: mime })
  } finally {
    bitmap.close()
  }
}

export async function uploadAdminImage(file: File): Promise<
  { ok: true; url: string } | { ok: false; error: string }
> {
  if (typeof window === 'undefined') {
    return { ok: false, error: 'Téléchargement impossible dans ce contexte.' }
  }
  if (!file.type.startsWith('image/')) {
    return { ok: false, error: 'Veuillez sélectionner un fichier image.' }
  }

  let toSend: File
  try {
    toSend = await compressImageFileForAdmin(file)
  } catch {
    toSend = file
  }

  if (toSend.size > ADMIN_UPLOAD_MAX_BYTES) {
    return { ok: false, error: 'Fichier trop volumineux (max 10MB)' }
  }

  const formData = new FormData()
  formData.append('file', toSend)

  try {
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    })
    const data = (await res.json()) as { url?: string; error?: string }
    if (res.ok && data.url) {
      return { ok: true, url: data.url }
    }
    return { ok: false, error: data.error || 'Erreur lors du téléchargement' }
  } catch {
    return { ok: false, error: 'Erreur de connexion lors du téléchargement' }
  }
}
