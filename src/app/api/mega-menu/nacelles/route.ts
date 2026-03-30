import { NextResponse } from 'next/server'
import { getMegaMenuByType } from '@/lib/data'

export async function GET() {
  try {
    const items = await getMegaMenuByType('nacelles')
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching mega menu nacelles:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
