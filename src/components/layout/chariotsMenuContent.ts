import type { ChariotsLeftMenuKey } from './ChariotsMegaMenuLeftColumn'

/** One contextual action in the middle column (Jungheinrich-style). */
export type ChariotsMiddleAction = {
  id: string
  label: string
  /** If set, click navigates here (e.g. anchor on location page). */
  href?: string
}

export type ChariotsLeftMenuData = {
  middle: ChariotsMiddleAction[]
  /** Right column lines per middle id (full label text, e.g. « Louez votre … »). Empty = use occasion panel / no links. */
  rightByMiddle: Record<string, string[]>
}

/**
 * 3-column mega menu data: left key → middle actions + right lines per middle selection.
 */
export const chariotsMenuByLeft: Record<ChariotsLeftMenuKey, ChariotsLeftMenuData> = {
  transpalette: {
    middle: [{ id: 'tp_main', label: 'Transpalette manuel' }],
    rightByMiddle: {
      tp_main: [
        'Louez votre transpalette manuel standard',
        'Louez votre transpalette manuel longue fourche',
        'Louez votre transpalette manuel galvanisé',
      ],
    },
  },
  chariots_occasion: {
    middle: [
      {
        id: 'co_main',
        label: "Trouver votre chariot d'occasion",
        href: '/produits/chariots/occasion',
      },
    ],
    rightByMiddle: {
      co_main: [],
    },
  },
  chariots_location: {
    middle: [
      {
        id: 'loc_find',
        label: 'Trouver votre chariot de location',
        href: '/produits/chariots/location',
      },
    ],
    rightByMiddle: {
      loc_find: [
        'Louez votre transpalette électrique',
        'Louez votre préparateur de commande horizontal',
        'Louez votre gerbeur',
        'Louez votre chariot élévateur électrique',
        'Louez votre chariot à mât rétractable',
        'Louez vos chariots tracteurs électriques',
      ],
    },
  },
  nacelle_occasion: {
    middle: [
      {
        id: 'no_main',
        label: "Trouver votre nacelle d'occasion",
        href: '/produits/nacelles/occasion',
      },
    ],
    rightByMiddle: {
      no_main: [],
    },
  },
  nacelle_location: {
    middle: [
      {
        id: 'nl_find',
        label: 'Trouver votre nacelle de location',
        href: '/produits/nacelles/location',
      },
      {
        id: 'nl_short',
        label: 'Location courte durée',
        href: '/produits/nacelles/location',
      },
    ],
    rightByMiddle: {
      nl_find: [
        'Louez votre nacelle articulée',
        'Louez votre nacelle ciseaux',
        'Louez votre nacelle mât vertical',
      ],
      nl_short: [
        'Louez votre nacelle articulée',
        'Louez votre nacelle ciseaux',
        'Louez votre nacelle mât vertical',
      ],
    },
  },
}

export function getDefaultMiddleId(left: ChariotsLeftMenuKey): string {
  return chariotsMenuByLeft[left].middle[0]?.id ?? ''
}

export function getRightLines(left: ChariotsLeftMenuKey, middleId: string): string[] {
  const data = chariotsMenuByLeft[left]
  const lines = data.rightByMiddle[middleId]
  if (lines?.length) return lines
  const fallbackId = data.middle[0]?.id
  return fallbackId ? data.rightByMiddle[fallbackId] ?? [] : []
}

