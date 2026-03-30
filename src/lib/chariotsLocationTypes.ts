import { slugify } from './utils'

/**
 * Only these chariot types appear on the public « Chariots de location » catalog
 * (/produits/chariots/location and city pages). Admin lists all DB products.
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

export function filterAndSortChariotsLocationProducts<T extends { slug: string; name: string }>(
  products: T[]
): T[] {
  const order = new Map(CHARIOTS_LOCATION_TYPE_SLUGS.map((s, i) => [s, i]))
  const filtered = products.filter((p) => isChariotsLocationCatalogProduct(p.slug, p.name))
  return filtered.sort((a, b) => {
    const ca = canonicalSlugFor(a.slug, a.name) ?? ''
    const cb = canonicalSlugFor(b.slug, b.name) ?? ''
    return (order.get(ca) ?? 999) - (order.get(cb) ?? 999)
  })
}

export function filterSubcategoriesForChariotsLocationCatalog<
  T extends { id: string; name: string; slug: string },
>(children: T[]): T[] {
  return children.filter((c) => isChariotsLocationCatalogProduct(c.slug, c.name))
}
