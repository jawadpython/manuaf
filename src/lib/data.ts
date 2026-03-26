import { prisma } from './prisma'

// Product images from local folder
const localImages = {
  electric1: '/images/products/chr5-min-276x300.jpg',
  electric2: '/images/products/chr6-min-276x300.jpg',
  electric3: '/images/products/chr8-min-276x300.jpg',
  electric4: '/images/products/JUNGHEINRICH-EFG-318K_1.jpg',
  thermal1: '/images/products/250D-9-276x300.jpg',
  thermal2: '/images/products/35DE-7-276x300.jpg',
  thermal3: '/images/products/50DN-9VBTier-3A-276x300.jpg',
  thermal4: '/images/products/Chariot-toyota-Diesel-2.jpg',
}

const fallbackProducts = [
  // Electric Products
  {
    id: '1',
    name: 'Chariots élévateurs à mât rétractable',
    slug: 'chariots-mat-retractable',
    description: 'Dimensions compactes et grande hauteur de levage jusqu\'à 13 mètres. Idéal pour les hangars de stockage et la production.',
    category: 'Électrique',
    image: localImages.electric1,
    features: 'Hauteur jusqu\'à 13m|Dimensions compactes|Très maniable|Stockage',
    order: 0,
  },
  {
    id: '2',
    name: 'Chariots élévateurs frontaux électriques',
    slug: 'chariots-frontaux-electriques',
    description: 'Chariots élévateurs frontaux électriques pour une utilisation intérieure et extérieure.',
    category: 'Électrique',
    image: localImages.electric4,
    features: 'Intérieur/Extérieur|Polyvalent|Électrique|Écologique',
    order: 1,
  },
  {
    id: '3',
    name: 'Transpalettes',
    slug: 'transpalettes',
    description: 'Transpalettes électriques et manuels pour le transport horizontal de palettes. Idéal pour la mise en rayon et les entrepôts étroits.',
    category: 'Électrique',
    image: localImages.electric2,
    features: 'Transport horizontal|Entrepôts étroits|Mise en rayon|Chargement/déchargement',
    order: 2,
  },
  {
    id: '4',
    name: 'Gerbeurs électriques',
    slug: 'gerbeurs-electriques',
    description: 'Gerbeurs électriques performants pour le stockage et la récupération des marchandises. Parfaits pour le picking.',
    category: 'Électrique',
    image: localImages.electric3,
    features: 'Stockage et récupération|Picking|Facile à manipuler|Applications intensives',
    order: 3,
  },
  // Thermal Products
  {
    id: '5',
    name: 'Chariots élévateurs Thermique 25D-9',
    slug: 'chariot-thermique-25d',
    description: 'Chariot élévateur diesel robuste avec capacité de 2.5 tonnes. Idéal pour utilisation en extérieur.',
    category: 'Thermique',
    image: localImages.thermal1,
    features: 'Capacité 2.5T|Utilisation extérieur|Robuste|Diesel',
    order: 4,
  },
  {
    id: '6',
    name: 'Chariots élévateurs Thermique 35D-9',
    slug: 'chariot-thermique-35d',
    description: 'Chariot élévateur diesel avec capacité de 3.5 tonnes. Performance et fiabilité garanties.',
    category: 'Thermique',
    image: localImages.thermal2,
    features: 'Capacité 3.5T|Haute performance|Fiable|Diesel',
    order: 5,
  },
  {
    id: '7',
    name: 'Chariots élévateurs Thermique 50D-9',
    slug: 'chariot-thermique-50d',
    description: 'Chariot élévateur diesel puissant avec capacité de 5 tonnes. Pour charges lourdes.',
    category: 'Thermique',
    image: localImages.thermal3,
    features: 'Capacité 5T|Charges lourdes|Puissant|Diesel',
    order: 6,
  },
  {
    id: '8',
    name: 'Chariots élévateurs Thermique 70D-9',
    slug: 'chariot-thermique-70d',
    description: 'Chariot élévateur diesel haute capacité de 7 tonnes. Pour les applications industrielles intensives.',
    category: 'Thermique',
    image: localImages.thermal4,
    features: 'Capacité 7T|Applications intensives|Industriel|Diesel',
    order: 7,
  },
]

export async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: { id: true, name: true, slug: true, parent: { select: { id: true, name: true, slug: true } } },
        },
      },
      orderBy: { order: 'asc' },
      take: 3,
    })
    if (products.length > 0) {
      return products.map((p) => ({
        ...p,
        image: p.image || fallbackProducts[0]!.image,
        // Keep backward compatibility with string category
        category: p.category?.name || 'Non catégorisé',
      }))
    }
  } catch {
    // Prisma non initialisé ou DB absente
  }
  return fallbackProducts
}

export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        features: true,
        order: true,
        sold: true,
        categoryId: true,
        category: {
          select: { id: true, name: true, slug: true, type: true, parent: { select: { id: true, name: true, slug: true } } },
        },
      },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    })
    if (products.length > 0) {
      return products.map((p) => ({
        ...p,
        // Keep both object and string for backward compatibility
        category: p.category || { id: '', name: 'Non catégorisé', slug: '', type: '' },
      }))
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    // Fallback
  }
  return fallbackProducts.map(p => ({
    ...p,
    category: typeof p.category === 'string' ? { id: '', name: p.category, slug: '', type: '' } : p.category,
  }))
}

export async function getProductsByCategory(categorySlug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: { children: true },
    })
    if (!category) return []

    // Get all category IDs to search (parent + children)
    const categoryIds = [category.id, ...category.children.map((c) => c.id)]

    const products = await prisma.product.findMany({
      where: { categoryId: { in: categoryIds } },
      include: {
        category: {
          select: { id: true, name: true, slug: true, parent: { select: { id: true, name: true, slug: true } } },
        },
      },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    })

    return products.map((p) => ({
      ...p,
      category: p.category?.name || 'Non catégorisé',
    }))
  } catch {
    return []
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: { id: true, name: true, slug: true, parent: { select: { id: true, name: true, slug: true } } },
        },
      },
    })
    if (product) {
      return {
        ...product,
        category: product.category
          ? { ...product.category, name: product.category.name }
          : { id: '', name: 'Non catégorisé', slug: '', parent: null },
      }
    }
  } catch {
    // Fallback
  }
  return fallbackProducts.find((p) => p.slug === slug) || null
}

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { published: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        type: true,
        parentId: true,
        order: true,
        published: true,
        parent: {
          select: { id: true, name: true, slug: true },
        },
        children: {
          where: { published: true },
          select: { id: true, name: true, slug: true, type: true, parentId: true, order: true, published: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [{ parentId: 'asc' }, { order: 'asc' }, { name: 'asc' }],
      take: 100, // Limit to prevent excessive data
    })
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Optimized function to get products by type
export async function getProductsByType(type: 'chariots' | 'pieces') {
  try {
    // First get category IDs of the specified type
    const categoryIds = await prisma.category.findMany({
      where: {
        type,
        published: true,
      },
      select: { id: true },
    })
    
    const ids = categoryIds.map(c => c.id)
    if (ids.length === 0) return []
    
    // Then get products in those categories
    const products = await prisma.product.findMany({
      where: {
        categoryId: { in: ids },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        features: true,
        order: true,
        sold: true,
        categoryId: true,
        category: {
          select: { id: true, name: true, slug: true, type: true, parent: { select: { id: true, name: true, slug: true } } },
        },
      },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    })
    
    return products.map((p) => ({
      ...p,
      category: p.category || { id: '', name: 'Non catégorisé', slug: '', type: '' },
    }))
  } catch (error) {
    console.error('Error fetching products by type:', error)
    return []
  }
}

// Get subcategories for occasion/location pages (for filter) - only children, not the main page type
export async function getSubcategoriesForChariotsPage(categorySlug: string) {
  try {
    const parent = await prisma.category.findUnique({
      where: { slug: categorySlug, type: 'chariots', published: true },
      select: { id: true },
    })
    if (!parent) return []

    const children = await prisma.category.findMany({
      where: { parentId: parent.id, published: true },
      select: { id: true, name: true, slug: true },
      orderBy: { order: 'asc' },
    })
    return children
  } catch {
    return []
  }
}

// Get products for Chariots de location page (category slug: chariots-location)
export async function getProductsForChariotsLocation() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        type: 'chariots',
        published: true,
        OR: [
          { slug: 'chariots-de-location' },
          { parent: { slug: 'chariots-de-location' } },
        ],
      },
      select: { id: true },
    })
    const ids = categories.map((c) => c.id)
    if (ids.length === 0) return []

    const products = await prisma.product.findMany({
      where: { categoryId: { in: ids } },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        features: true,
        order: true,
        sold: true,
        categoryId: true,
        category: {
          select: { id: true, name: true, slug: true, type: true, parent: { select: { id: true, name: true, slug: true } } },
        },
      },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    })
    return products.map((p) => ({
      ...p,
      category: p.category || { id: '', name: 'Non catégorisé', slug: '', type: '' },
    }))
  } catch (error) {
    console.error('Error fetching products for chariots location:', error)
    return []
  }
}

// Get products for Chariots d'occasion page (category slug: chariots-occasion)
export async function getProductsForChariotsOccasion() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        type: 'chariots',
        published: true,
        OR: [
          { slug: 'chariots-d-occasion' },
          { parent: { slug: 'chariots-d-occasion' } },
        ],
      },
      select: { id: true },
    })
    const ids = categories.map((c) => c.id)
    if (ids.length === 0) return []

    const products = await prisma.product.findMany({
      where: { categoryId: { in: ids } },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        features: true,
        order: true,
        sold: true,
        categoryId: true,
        category: {
          select: { id: true, name: true, slug: true, type: true, parent: { select: { id: true, name: true, slug: true } } },
        },
      },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    })
    return products.map((p) => ({
      ...p,
      category: p.category || { id: '', name: 'Non catégorisé', slug: '', type: '' },
    }))
  } catch (error) {
    console.error("Error fetching products for chariots occasion:", error)
    return []
  }
}

/** Default images for principal categories when none set in DB */
const categoryDefaultImages: Record<string, string> = {
  chariots: '/images/Chariots de location (2).webp',
  'chariots-de-location': '/images/Chariots de location (2).webp',
  'chariots-location': '/images/Chariots de location (2).webp',
  'chariots-d-occasion': "/images/Chariots d'occasion.webp",
  'chariots-occasion': "/images/Chariots d'occasion.webp",
  pieces: '/images/products/chr6-min-276x300.jpg',
  'pieces-de-rechange': '/images/products/chr6-min-276x300.jpg',
  batteries: '/images/products/chr8-min-276x300.jpg',
  accessoires: '/images/products/JUNGHEINRICH-EFG-318K_1.jpg',
}

function getCategoryImage(cat: { slug: string; image?: string | null }): string {
  if (cat.image) return cat.image
  return categoryDefaultImages[cat.slug] ?? '/images/products/chr5-min-276x300.jpg'
}

/** Mega-menu item shape for Produits dropdown */
export type MegaMenuItemProduits = {
  href: string
  label: string
  subLinks: { href: string; label: string }[]
  /** Optional featured content (image, description) for this category */
  image?: string | null
  description?: string | null
}

/** Build mega-menu by category type (chariots | pieces) */
export async function getMegaMenuByType(type: 'chariots' | 'pieces'): Promise<MegaMenuItemProduits[]> {
  try {
    const categories = await prisma.category.findMany({
      where: { published: true, type },
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: {
          where: { published: true },
          include: {
            products: {
              where: { sold: false },
              select: { id: true, name: true, slug: true, order: true },
              orderBy: [{ order: 'asc' }, { name: 'asc' }],
            },
          },
          orderBy: { order: 'asc' },
        },
        products: {
          where: { sold: false },
          select: { id: true, name: true, slug: true, order: true },
          orderBy: [{ order: 'asc' }, { name: 'asc' }],
        },
      },
      orderBy: [{ parentId: 'asc' }, { order: 'asc' }, { name: 'asc' }],
      take: 50,
    })

    const items: MegaMenuItemProduits[] = []
    const rootCats = categories.filter((c) => !c.parentId)

    for (const cat of rootCats) {
      const subLinks: { href: string; label: string }[] = []

      // Add child categories as sub-links (pieces: stay on /produits/pieces with filter; chariots: dedicated page)
      for (const child of cat.children || []) {
        subLinks.push({
          href: type === 'pieces' ? `/produits/pieces?category=${child.slug}` : `/produits/c/${child.slug}`,
          label: child.name,
        })
      }

      // Add products in this category and its children as sub-links
      const rootProducts = cat.products || []
      const childProducts = (cat.children || []).flatMap((ch) => ch.products || [])
      const allProducts = [...rootProducts, ...childProducts].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name)
      )

      for (const p of allProducts) {
        subLinks.push({
          href: `/produits/${p.slug}`,
          label: p.name,
        })
      }

      // Dedupe by href (child categories may also have products)
      const seen = new Set<string>()
      const uniqueSubLinks = subLinks.filter((s) => {
        if (seen.has(s.href)) return false
        seen.add(s.href)
        return true
      })

      // Chariots: no subLinks on right (user prefers image + description only)
      const finalSubLinks = type === 'chariots' ? [] : uniqueSubLinks

      items.push({
        href: type === 'chariots' && (cat.slug === 'chariots-de-location' || cat.slug === 'chariots-d-occasion')
          ? (cat.slug === 'chariots-de-location' ? '/produits/chariots/location' : '/produits/chariots/occasion')
          : type === 'pieces'
          ? `/produits/pieces?category=${cat.slug}`
          : `/produits/c/${cat.slug}`,
        label: cat.name,
        subLinks: finalSubLinks,
        image: getCategoryImage(cat as { slug: string; image?: string | null }),
        description: cat.description ?? null,
      })
    }

    return items
  } catch (error) {
    console.error('Error fetching mega menu:', error)
    return []
  }
}

/** Build Produits mega-menu (all types) - kept for backward compatibility */
export async function getMegaMenuProduits(): Promise<MegaMenuItemProduits[]> {
  const [chariots, pieces] = await Promise.all([
    getMegaMenuByType('chariots'),
    getMegaMenuByType('pieces'),
  ])
  return [...chariots, ...pieces]
}

export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug, published: true },
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        children: {
          where: { published: true },
          select: { id: true, name: true, slug: true },
          orderBy: { order: 'asc' },
        },
        products: {
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
          orderBy: [{ order: 'asc' }, { name: 'asc' }],
        },
      },
    })
    return category
  } catch {
    return null
  }
}

export async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
    return posts
  } catch {
    return []
  }
}

export async function getBlogPostBySlug(slug: string) {
  const s = typeof slug === 'string' ? slug.trim() : ''
  if (!s) return null
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug: s, published: true },
    })
    return post
  } catch {
    return null
  }
}

// Services
export async function getAllServices() {
  try {
    const services = await prisma.service.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    })
    if (services.length > 0) return services
  } catch {
    // Fallback
  }
  return []
}

export async function getServicesByCategory(category: string) {
  try {
    const services = await prisma.service.findMany({
      where: { category, published: true },
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    })
    if (services.length > 0) return services
  } catch {
    // Fallback
  }
  return []
}

export async function getServiceBySlug(slug: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug, published: true },
    })
    if (service) return service
  } catch {
    // Fallback
  }
  return null
}

/** Fetch form fields for devis form (location only). Returns [] if table missing or error. */
export async function getFormFieldsForLocation(): Promise<Array<{
  id: string
  key: string
  label: string
  type: string
  required: boolean
  placeholder: string | null
  options: { value: string; label: string }[] | null
}>> {
  try {
    const context = 'chariots-location'
    const fields = await prisma.devisFormField.findMany({
      where: {
        active: true,
        OR: [
          { showFor: null },
          { showFor: 'all' },
          { showFor: context },
        ],
      },
      orderBy: { sortOrder: 'asc' },
    })
    const seen = new Set<string>()
    return fields
      .filter((f) => {
        if (seen.has(f.key)) return false
        seen.add(f.key)
        return true
      })
      .map((f) => ({
        ...f,
        options: Array.isArray(f.options) &&
          f.options.every((o): o is { value: string; label: string } =>
            o != null && typeof o === 'object' && 'value' in o && 'label' in o
          )
          ? f.options
          : null,
      }))
  } catch {
    return []
  }
}