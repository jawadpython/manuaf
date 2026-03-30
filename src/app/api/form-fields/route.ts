import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Map category slugs to form context (showFor values in DB)
const CONTEXT_ALIASES: Record<string, string> = {
  'chariots-de-location': 'chariots-location',
  'nacelles-de-location': 'chariots-location',
  'chariots-d-occasion': 'chariots-occasion',
}

// Location rentals (chariots + nacelles) share the same custom fields in admin.
const LOCATION_CONTEXT = 'chariots-location'

/**
 * GET /api/form-fields?context=chariots-de-location
 * Public API - returns active form fields for the given context.
 * Chariots d'occasion does not receive custom fields (client info only).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    let context = searchParams.get('context') || 'all'
    context = CONTEXT_ALIASES[context] || context
    const isLocation = context === LOCATION_CONTEXT

    const fields = await prisma.devisFormField.findMany({
      where: {
        active: true,
        OR: [
          { showFor: null },
          { showFor: 'all' },
          { showFor: context },
          ...(isLocation ? [{ showFor: 'chariots-location' as const }] : []),
        ],
      },
      orderBy: { sortOrder: 'asc' },
    })

    // Dedupe by key
    const seen = new Set<string>()
    const deduped = fields.filter((f) => {
      if (seen.has(f.key)) return false
      seen.add(f.key)
      return true
    })

    return NextResponse.json(deduped)
  } catch (error) {
    console.error('Form fields fetch error:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
