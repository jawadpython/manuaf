import { slugify } from './utils'

/**
 * Default ordering for the public « Chariots de location » catalog
 * (/produits/chariots/location, city pages). All products in the location
 * tree are shown; these labels define the first block (order), then any other
 * admin-added types follow (by `order` then name).
 */
export const CHARIOTS_LOCATION_TYPE_LABELS = [
  'Transpalette électrique',
  'Préparateur de commande horizontal',
  'Gerbeur',
  'Chariot élévateur électrique',
  'Chariot à mât rétractable',
  'Chariots tracteur électrique',
] as const

export const CHARIOTS_LOCATION_TYPE_SLUGS = CHARIOTS_LOCATION_TYPE_LABELS.map((l) => slugify(l)) as readonly string[]

const CANONICAL = new Set(CHARIOTS_LOCATION_TYPE_SLUGS)

/** Legacy or alternate slugs → canonical slug from CHARIOTS_LOCATION_TYPE_SLUGS */
const SLUG_ALIASES: Record<string, string> = {
  transpalette: 'transpalette-electrique',
  'preparateur-commande-horizontal': 'preparateur-de-commande-horizontal',
  'chariot-elevateur-electrique-diesel': 'chariot-elevateur-electrique',
  'tracteur-electrique': 'chariots-tracteur-electrique',
  'chariot-tracteur-electrique': 'chariots-tracteur-electrique',
  /** Plural menu / anciennes URL */
  'chariots-tracteurs-electriques': 'chariots-tracteur-electrique',
}

function canonicalSlugFor(slug: string, name: string): string | null {
  const s = slug.toLowerCase().trim()
  if (CANONICAL.has(s)) return s
  const aliased = SLUG_ALIASES[s]
  if (aliased && CANONICAL.has(aliased)) return aliased
  const fromName = slugify(name)
  if (CANONICAL.has(fromName)) return fromName
  const fromSlug = slugify(s)
  if (CANONICAL.has(fromSlug)) return fromSlug
  return null
}

export function isChariotsLocationCatalogProduct(slug: string, name: string): boolean {
  return canonicalSlugFor(slug, name) != null
}

export function filterAndSortChariotsLocationProducts<T extends { slug: string; name: string; order?: number }>(
  products: T[]
): T[] {
  const typeOrder = new Map(CHARIOTS_LOCATION_TYPE_SLUGS.map((s, i) => [s, i]))
  const inCatalog: T[] = []
  const extra: T[] = []
  for (const p of products) {
    if (isChariotsLocationCatalogProduct(p.slug, p.name)) inCatalog.push(p)
    else extra.push(p)
  }
  inCatalog.sort((a, b) => {
    const ca = canonicalSlugFor(a.slug, a.name) ?? ''
    const cb = canonicalSlugFor(b.slug, b.name) ?? ''
    return (typeOrder.get(ca) ?? 999) - (typeOrder.get(cb) ?? 999)
  })
  extra.sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
  )
  return [...inCatalog, ...extra]
}

export function filterSubcategoriesForChariotsLocationCatalog<
  T extends { id: string; name: string; slug: string; order?: number },
>(children: T[]): T[] {
  if (children.length === 0) return []
  const typeOrder = new Map(CHARIOTS_LOCATION_TYPE_SLUGS.map((s, i) => [s, i]))
  const inCatalog: T[] = []
  const extra: T[] = []
  for (const c of children) {
    if (isChariotsLocationCatalogProduct(c.slug, c.name)) inCatalog.push(c)
    else extra.push(c)
  }
  inCatalog.sort((a, b) => {
    const ca = canonicalSlugFor(a.slug, a.name) ?? ''
    const cb = canonicalSlugFor(b.slug, b.name) ?? ''
    return (typeOrder.get(ca) ?? 999) - (typeOrder.get(cb) ?? 999)
  })
  extra.sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
  )
  return [...inCatalog, ...extra]
}
