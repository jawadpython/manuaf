import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MEGA_MENU_PANEL_DEFAULTS } from '@/lib/megaMenuPanelDefaults'
import { panelsFromDb } from '@/lib/megaMenuPanels'

/** Données fusionnées (DB + défauts) pour le mega-menu Chariots — public, cacheable. */
export async function GET() {
  try {
    const rows = await prisma.megaMenuPanel.findMany()
    return NextResponse.json(panelsFromDb(rows, MEGA_MENU_PANEL_DEFAULTS))
  } catch {
    return NextResponse.json(MEGA_MENU_PANEL_DEFAULTS)
  }
}
