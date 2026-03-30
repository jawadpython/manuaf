import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MEGA_MENU_PANEL_DEFAULTS, MEGA_MENU_PANEL_KEYS, type MegaMenuPanelPayload } from '@/lib/megaMenuPanelDefaults'
import { panelsFromDb } from '@/lib/megaMenuPanels'

const MAX = { short: 500, body: 8000, href: 2000 }

function sanitizePanel(p: unknown): MegaMenuPanelPayload | null {
  if (!p || typeof p !== 'object') return null
  const o = p as Record<string, unknown>
  const str = (k: string, max: number) => {
    const v = o[k]
    if (typeof v !== 'string') return ''
    return v.trim().slice(0, max)
  }
  const imageSrc = str('imageSrc', MAX.href)
  const imageAlt = str('imageAlt', MAX.short)
  const title = str('title', MAX.short)
  const body = str('body', MAX.body)
  const ctaLabel = str('ctaLabel', MAX.short)
  const ctaHref = str('ctaHref', MAX.href)
  if (!imageSrc || !title || !body || !ctaLabel || !ctaHref) return null
  return { imageSrc, imageAlt: imageAlt || title, title, body, ctaLabel, ctaHref }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  try {
    const rows = await prisma.megaMenuPanel.findMany()
    return NextResponse.json({
      panels: panelsFromDb(rows, MEGA_MENU_PANEL_DEFAULTS),
    })
  } catch (e) {
    console.error('admin mega-menu-panels GET:', e)
    return NextResponse.json({ panels: MEGA_MENU_PANEL_DEFAULTS })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 })
  }

  const panels = (body as { panels?: Record<string, unknown> })?.panels
  if (!panels || typeof panels !== 'object') {
    return NextResponse.json({ error: 'panels requis' }, { status: 400 })
  }

  try {
    for (const key of MEGA_MENU_PANEL_KEYS) {
      const raw = panels[key]
      const cleaned = sanitizePanel(raw)
      if (!cleaned) {
        return NextResponse.json({ error: `Données invalides pour ${key}` }, { status: 400 })
      }
      await prisma.megaMenuPanel.upsert({
        where: { key },
        create: { key, ...cleaned },
        update: cleaned,
      })
    }
    const rows = await prisma.megaMenuPanel.findMany()
    return NextResponse.json({
      ok: true,
      panels: panelsFromDb(rows, MEGA_MENU_PANEL_DEFAULTS),
    })
  } catch (e) {
    console.error('admin mega-menu-panels PUT:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
