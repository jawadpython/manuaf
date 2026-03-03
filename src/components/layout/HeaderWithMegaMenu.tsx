import { getMegaMenuByType } from '@/lib/data'
import { Header } from './Header'
import type { MegaMenuItem } from './MegaMenu'

const CHARIOTS_LOCATION_DESC =
  "Pour une journée ou pour un an — si vous avez besoin rapidement d'un chariot élévateur, vous pouvez compter sur notre service de location."
const CHARIOTS_OCCASION_DESC =
  "Équipements reconditionnés et garantis pour optimiser votre budget sans compromettre la qualité."

/** Enriches chariots items with descriptions when missing */
function enrichChariots(items: MegaMenuItem[]): MegaMenuItem[] {
  return items.map((item) => {
    if (item.description) return item
    if (item.href?.includes('/location')) return { ...item, description: CHARIOTS_LOCATION_DESC }
    if (item.href?.includes('/occasion')) return { ...item, description: CHARIOTS_OCCASION_DESC }
    return item
  })
}

export async function HeaderWithMegaMenu() {
  const [chariots, pieces] = await Promise.all([
    getMegaMenuByType('chariots'),
    getMegaMenuByType('pieces'),
  ])

  const chariotsGroup: MegaMenuItem[] =
    Array.isArray(chariots) && chariots.length > 0 ? enrichChariots(chariots as MegaMenuItem[]) : []
  const piecesGroup: MegaMenuItem[] = Array.isArray(pieces) && pieces.length > 0 ? (pieces as MegaMenuItem[]) : []

  return <Header initialChariotsGroup={chariotsGroup} initialPiecesGroup={piecesGroup} />
}
