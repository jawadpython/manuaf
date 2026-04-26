/**
 * Client-only helpers for admin image uploads (same endpoint as Category/Product forms).
 * Resizes large rasters before POST to stay within /api/admin/upload limits and load faster.
 */

export const ADMIN_UPLOAD_MAX_BYTES = 10 * 1024 * 1024
/** Default longest side (px) for catalog / product photos */
export const ADMIN_IMAGE_MAX_EDGE = 1600
/** Mega-menu panels & category tiles: small on screen — keep files light for fast menu open */
export const MEGA_MENU_IMAGE_MAX_EDGE = 768

export type AdminImageUploadPreset = 'default' | 'megaMenu'

export type CompressImageOptions = {
  maxEdge?: number
  jpegQuality?: number
  /**
   * When true, always re-encode rasters (still skips gif/svg). Shrinks bloated JPEGs/WebPs that
   * already fit within maxEdge.
   */
  preferSmallerFile?: boolean
}

/**
 * Downscale wide/tall images and re-encode (JPEG for photos, PNG kept for PNG sources).
 * GIF / SVG are left unchanged. Falls back to original file if decoding fails.
 */
export async function compressImageFileForAdmin(
  file: File,
  options?: CompressImageOptions
): Promise<File> {
  if (typeof window === 'undefined') return file
  if (!file.type.startsWith('image/')) return file
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file

  const maxEdge = options?.maxEdge ?? ADMIN_IMAGE_MAX_EDGE
  const jpegQuality = options?.jpegQuality ?? 0.85
  const preferSmallerFile = options?.preferSmallerFile ?? false

  let bitmap: ImageBitmap | null = null
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return file
  }

  try {
    const { width: ow, height: oh } = bitmap
    const scale = Math.min(1, maxEdge / Math.max(ow, oh))

    if (!preferSmallerFile) {
      const smallEnough =
        scale >= 1 && file.size <= 750 * 1024 && file.type !== 'image/png'
      if (smallEnough) {
        return file
      }
    }

    const w = Math.round(ow * scale)
    const h = Math.round(oh * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    const usePng = file.type === 'image/png' && !preferSmallerFile
    if (!usePng) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
    }
    ctx.drawImage(bitmap, 0, 0, w, h)

    const blob = await new Promise<Blob | null>((resolve) => {
      if (usePng) {
        canvas.toBlob((b) => resolve(b), 'image/png')
      } else {
        canvas.toBlob((b) => resolve(b), 'image/jpeg', jpegQuality)
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

function compressOptionsForPreset(preset: AdminImageUploadPreset | undefined): CompressImageOptions {
  if (preset === 'megaMenu') {
    return {
      maxEdge: MEGA_MENU_IMAGE_MAX_EDGE,
      jpegQuality: 0.82,
      preferSmallerFile: true,
    }
  }
  /* Downscale large rasters before POST; server Sharp re-encodes all non-GIF uploads again.
     preferSmallerFile false keeps PNG (transparency) — megaMenu still flattens in browser. */
  return {
    maxEdge: ADMIN_IMAGE_MAX_EDGE,
    jpegQuality: 0.85,
    preferSmallerFile: false,
  }
}

export async function uploadAdminImage(
  file: File,
  uploadOptions?: { preset?: AdminImageUploadPreset }
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (typeof window === 'undefined') {
    return { ok: false, error: 'Téléchargement impossible dans ce contexte.' }
  }
  if (!file.type.startsWith('image/')) {
    return { ok: false, error: 'Veuillez sélectionner un fichier image.' }
  }

  const preset = uploadOptions?.preset ?? 'default'
  const compressOpts = compressOptionsForPreset(preset)

  let toSend: File
  try {
    toSend = await compressImageFileForAdmin(file, compressOpts)
  } catch {
    toSend = file
  }

  if (toSend.size > ADMIN_UPLOAD_MAX_BYTES) {
    return { ok: false, error: 'Fichier trop volumineux (max 10MB)' }
  }

  const formData = new FormData()
  formData.append('file', toSend)
  formData.append('preset', preset)

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
