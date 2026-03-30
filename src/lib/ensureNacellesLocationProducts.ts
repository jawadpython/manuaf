import { prisma } from './prisma'
import { NACELLES_LOCATION_DEFAULT_PRODUCTS } from './nacellesLocationDefaults'
import { NACELLES_LOCATION_TYPE_SLUGS } from './nacellesLocationTypes'

async function getOrCreateNacellesLocationParentId(): Promise<string | null> {
  let cat = await prisma.category.findFirst({
    where: { slug: 'nacelles-de-location', type: 'nacelles', published: true },
  })
  if (!cat) {
    cat = await prisma.category.create({
      data: {
        name: 'Nacelles de location',
        slug: 'nacelles-de-location',
        type: 'nacelles',
        description: 'Nacelles disponibles à la location',
        published: true,
        order: 0,
      },
    })
  }
  return cat.id
}

/**
 * Crée les sous-catégories et fiches manquantes pour les 3 types de location (idempotent).
 * Chaque fiche est rattachée à sa sous-catégorie pour que les filtres « Tous / type » fonctionnent.
 */
export async function ensureMissingNacellesLocationProducts(): Promise<number> {
  const parentId = await getOrCreateNacellesLocationParentId()
  if (!parentId) return 0

  const existing = await prisma.product.findMany({
    where: { slug: { in: [...NACELLES_LOCATION_TYPE_SLUGS] } },
    select: { slug: true },
  })
  const have = new Set(existing.map((e) => e.slug))

  let created = 0
  for (const def of NACELLES_LOCATION_DEFAULT_PRODUCTS) {
    let child = await prisma.category.findFirst({
      where: { parentId, slug: def.slug, type: 'nacelles' },
    })
    if (!child) {
      child = await prisma.category.create({
        data: {
          name: def.name,
          slug: def.slug,
          type: 'nacelles',
          parentId,
          description: def.description,
          published: true,
          order: def.order,
        },
      })
    }

    if (have.has(def.slug)) continue
    await prisma.product.create({
      data: {
        name: def.name,
        slug: def.slug,
        description: def.description,
        categoryId: child.id,
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
