import { NextResponse } from 'next/server'
import { getMegaMenuProduits } from '@/lib/data'

/**
 * Public API: Produits mega-menu data (categories + products from admin)
 */
export async function GET() {
  try {
    const items = await getMegaMenuProduits()
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching mega menu produits:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
