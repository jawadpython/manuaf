import { prisma } from './prisma'
import { CHARIOTS_LOCATION_DEFAULT_PRODUCTS } from './chariotsLocationDefaults'
import { CHARIOTS_LOCATION_TYPE_SLUGS } from './chariotsLocationTypes'

async function getOrCreateChariotsLocationCategoryId(): Promise<string | null> {
  let cat = await prisma.category.findFirst({
    where: { slug: 'chariots-de-location', type: 'chariots', published: true },
  })
  if (!cat) {
    cat = await prisma.category.create({
      data: {
        name: 'Chariots de location',
        slug: 'chariots-de-location',
        type: 'chariots',
        description: 'Chariots disponibles à la location',
        published: true,
        order: 0,
      },
    })
  }
  return cat.id
}

/**
 * Crée les fiches manquantes pour les 6 types de location (idempotent).
 * Les fiches existantes ne sont pas écrasées — l’admin peut les modifier.
 */
export async function ensureMissingChariotsLocationProducts(): Promise<number> {
  const categoryId = await getOrCreateChariotsLocationCategoryId()
  if (!categoryId) return 0

  const existing = await prisma.product.findMany({
    where: { slug: { in: [...CHARIOTS_LOCATION_TYPE_SLUGS] } },
    select: { slug: true },
  })
  const have = new Set(existing.map((e) => e.slug))

  let created = 0
  for (const def of CHARIOTS_LOCATION_DEFAULT_PRODUCTS) {
    if (have.has(def.slug)) continue
    await prisma.product.create({
      data: {
        name: def.name,
        slug: def.slug,
        description: def.description,
        categoryId,
        image: def.image,
        order: def.order,
        features: null,
        sold: false,
      },
    })
    have.add(def.slug)
    created++
  }
  return created
}
