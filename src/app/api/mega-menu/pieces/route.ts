import { NextResponse } from 'next/server'
import { getMegaMenuByType } from '@/lib/data'

/** Public API: Pièces de rechange mega-menu data */
export async function GET() {
  try {
    const items = await getMegaMenuByType('pieces')
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching mega menu pieces:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
