import {
  MEGA_MENU_PANEL_DEFAULTS,
  type MegaMenuPanelKey,
  type MegaMenuPanelPayload,
} from './megaMenuPanelDefaults'

export type MegaMenuPanelRow = {
  key: string
  imageSrc: string
  imageAlt: string
  title: string
  body: string
  ctaLabel: string
  ctaHref: string
}

export function mergeMegaMenuPanel(
  row: Pick<MegaMenuPanelRow, 'imageSrc' | 'imageAlt' | 'title' | 'body' | 'ctaLabel' | 'ctaHref'> | null,
  defaults: MegaMenuPanelPayload
): MegaMenuPanelPayload {
  if (!row) return defaults
  return {
    imageSrc: row.imageSrc?.trim() || defaults.imageSrc,
    imageAlt: row.imageAlt?.trim() || defaults.imageAlt,
    title: row.title?.trim() || defaults.title,
    body: row.body?.trim() || defaults.body,
    ctaLabel: row.ctaLabel?.trim() || defaults.ctaLabel,
    ctaHref: row.ctaHref?.trim() || defaults.ctaHref,
  }
}

export function panelsFromDb(
  rows: MegaMenuPanelRow[],
  defaults: typeof MEGA_MENU_PANEL_DEFAULTS
): Record<MegaMenuPanelKey, MegaMenuPanelPayload> {
  const byKey = new Map(rows.map((r) => [r.key as MegaMenuPanelKey, r]))
  return {
    chariots_occasion: mergeMegaMenuPanel(byKey.get('chariots_occasion') ?? null, defaults.chariots_occasion),
    nacelle_occasion: mergeMegaMenuPanel(byKey.get('nacelle_occasion') ?? null, defaults.nacelle_occasion),
  }
}
