import { NextResponse } from 'next/server'
import { getMegaMenuByType } from '@/lib/data'

/** Public API: Chariots mega-menu data */
export async function GET() {
  try {
    const items = await getMegaMenuByType('chariots')
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching mega menu chariots:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
