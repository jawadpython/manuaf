import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { buildFullBackupBytes } from '@/lib/siteBackup'

export const maxDuration = 300
export const runtime = 'nodejs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: 401 })
  }
  try {
    const u8 = await buildFullBackupBytes()
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const name = `logistec-sauvegarde-${stamp}.zip`
    return new Response(Buffer.from(u8), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${name}"; filename*=UTF-8''${encodeURIComponent(
          name
        )}`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erreur de sauvegarde'
    console.error('admin backup export:', e)
    return new Response(JSON.stringify({ error: msg }), { status: 500 })
  }
}
