import { slugify } from './utils'

/**
 * Ordre par défaut sur la page « Nacelles de location ». Tous les produits
 * du périmètre location sont affichés ; ces types passent d’abord, puis le reste
 * (ajouts admin) par `order` puis nom.
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

export function filterAndSortNacellesLocationProducts<T extends { slug: string; name: string; order?: number }>(
  products: T[]
): T[] {
  const typeOrder = new Map(NACELLES_LOCATION_TYPE_SLUGS.map((s, i) => [s, i]))
  const inCatalog: T[] = []
  const extra: T[] = []
  for (const p of products) {
    if (isNacellesLocationCatalogProduct(p.slug, p.name)) inCatalog.push(p)
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

export function filterSubcategoriesForNacellesLocationCatalog<
  T extends { id: string; name: string; slug: string; order?: number },
>(children: T[]): T[] {
  if (children.length === 0) return []
  const typeOrder = new Map(NACELLES_LOCATION_TYPE_SLUGS.map((s, i) => [s, i]))
  const inCatalog: T[] = []
  const extra: T[] = []
  for (const c of children) {
    if (isNacellesLocationCatalogProduct(c.slug, c.name)) inCatalog.push(c)
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
