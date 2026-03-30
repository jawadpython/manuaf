import { slugify } from './utils'

/**
 * Types affichés sur la page publique « Nacelles de location ».
 * L’admin liste tous les produits ; le catalogue filtre sur ces slugs.
 */
export const NACELLES_LOCATION_TYPE_LABELS = [
  'Nacelle articulée',
  'Nacelle ciseaux',
  'Nacelle mât vertical',
] as const

export const NACELLES_LOCATION_TYPE_SLUGS = NACELLES_LOCATION_TYPE_LABELS.map((l) =>
  slugify(l)
) as readonly string[]

const CANONICAL = new Set(NACELLES_LOCATION_TYPE_SLUGS)

function canonicalSlugFor(slug: string, name: string): string | null {
  const s = slug.toLowerCase().trim()
  if (CANONICAL.has(s)) return s
  const fromName = slugify(name)
  if (CANONICAL.has(fromName)) return fromName
  const fromSlug = slugify(s)
  if (CANONICAL.has(fromSlug)) return fromSlug
  return null
}

export function isNacellesLocationCatalogProduct(slug: string, name: string): boolean {
  return canonicalSlugFor(slug, name) != null
}

export function filterAndSortNacellesLocationProducts<T extends { slug: string; name: string }>(
  products: T[]
): T[] {
  const order = new Map(NACELLES_LOCATION_TYPE_SLUGS.map((s, i) => [s, i]))
  const filtered = products.filter((p) => isNacellesLocationCatalogProduct(p.slug, p.name))
  return filtered.sort((a, b) => {
    const ca = canonicalSlugFor(a.slug, a.name) ?? ''
    const cb = canonicalSlugFor(b.slug, b.name) ?? ''
    return (order.get(ca) ?? 999) - (order.get(cb) ?? 999)
  })
}

export function filterSubcategoriesForNacellesLocationCatalog<
  T extends { id: string; name: string; slug: string },
>(children: T[]): T[] {
  return children.filter((c) => isNacellesLocationCatalogProduct(c.slug, c.name))
}
