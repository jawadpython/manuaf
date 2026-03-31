import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MegaMenuPanelsForm } from '@/components/admin/MegaMenuPanelsForm'
import { MEGA_MENU_PANEL_DEFAULTS } from '@/lib/megaMenuPanelDefaults'
import { panelsFromDb } from '@/lib/megaMenuPanels'

export const metadata = {
  title: 'Mega-menu Produits - Administration',
  description: 'Panneaux image + texte du menu Produits (transpalette, occasion)',
  robots: { index: false, follow: false },
}

export default async function AdminMegaMenuPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  let initial = MEGA_MENU_PANEL_DEFAULTS
  try {
    const rows = await prisma.megaMenuPanel.findMany()
    initial = panelsFromDb(rows, MEGA_MENU_PANEL_DEFAULTS)
  } catch {
    // Table peut être absente avant migration — le formulaire utilise les défauts.
  }

  return <MegaMenuPanelsForm initialPanels={initial} />
}
