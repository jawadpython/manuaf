import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { parseBackupZip, writeExtractedUploadFiles, replaceDatabaseFromSnapshot } from '@/lib/siteBackup'

export const maxDuration = 300
export const runtime = 'nodejs'

/**
 * FormData: { file: File (application/zip) }
 * Optional: { replaceFiles: '1' } to also restore public/uploads from the archive
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })
  }
  try {
    const form = await request.formData()
    const file = form.get('file')
    if (!file || !(file instanceof File)) {
      return Response.json(
        { ok: false, error: 'Fichier .zip requis (champ file).' },
        { status: 400 }
      )
    }
    if (file.size < 20) {
      return Response.json({ ok: false, error: 'Fichier vide ou trop petit.' }, { status: 400 })
    }
    const maxBytes = 200 * 1024 * 1024
    if (file.size > maxBytes) {
      return Response.json(
        { ok: false, error: `Fichier trop volumineux (max ${maxBytes / 1024 / 1024} Mo).` },
        { status: 400 }
      )
    }
    const replaceFiles = form.get('replaceFiles') === '1' || form.get('replaceFiles') === 'on'
    const buffer = new Uint8Array(await file.arrayBuffer())
    const { database, files } = parseBackupZip(buffer)
    await replaceDatabaseFromSnapshot(database)
    let fileReport: { written: number; errors: string[] } = { written: 0, errors: [] }
    if (replaceFiles) {
      fileReport = await writeExtractedUploadFiles(files)
    }
    return Response.json({
      ok: true,
      message: 'Sauvegarde restaurée.',
      products: database.products.length,
      categories: database.categories.length,
      uploadedFiles: fileReport.written,
      fileWarnings: fileReport.errors,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Import impossible'
    console.error('admin backup import:', e)
    return Response.json({ ok: false, error: msg }, { status: 500 })
  }
}
