import { prisma } from './prisma'
import { RANDOM_IMAGES } from './randomImages'

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

      // Add child categories as sub-links
      for (const child of cat.children || []) {
        subLinks.push({
          href: `/produits/c/${child.slug}`,
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

const fallbackPosts = [
  {
    id: '1',
    title: 'Comment choisir la bonne société pour l\'entretien de vos équipements de manutention ?',
    slug: 'choisir-societe-entretien-manutention',
    excerpt: 'Dans le domaine de la manutention, la fiabilité des équipements est primordiale. Découvrez nos conseils pour choisir le bon partenaire.',
    content: '<p>Le choix d\'une société de maintenance pour vos équipements de manutention est crucial pour garantir la sécurité et la productivité de vos opérations.</p><h2>Les critères essentiels</h2><p>Lors de votre sélection, assurez-vous de vérifier l\'expertise technique, les certifications, la disponibilité du service après-vente et la qualité des pièces de rechange utilisées.</p><h2>L\'importance de la réactivité</h2><p>Un bon partenaire doit pouvoir intervenir rapidement en cas de panne pour minimiser les temps d\'arrêt de vos équipements.</p>',
    image: RANDOM_IMAGES[0],
    published: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Louer des chariots supplémentaires lors d\'un pic de saisonnalité',
    slug: 'louer-chariots-pic-saisonnalite',
    excerpt: 'En tant qu\'acteur majeur du secteur de la logistique, vous devez anticiper les périodes de forte activité. Voici comment gérer vos besoins.',
    content: '<p>Les pics de saisonnalité peuvent mettre à rude épreuve votre flotte de chariots élévateurs. La location de chariots supplémentaires est une solution flexible et économique.</p><h2>Avantages de la location</h2><p>La location vous permet d\'adapter votre capacité de manutention sans investissement lourd, tout en bénéficiant d\'équipements récents et bien entretenus.</p><h2>Comment planifier</h2><p>Anticipez vos besoins en analysant les données des années précédentes et contactez votre fournisseur plusieurs semaines à l\'avance.</p>',
    image: RANDOM_IMAGES[1],
    published: true,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    title: 'Optimiser la gestion de sa logistique lors d\'un pic de saisonnalité',
    slug: 'optimiser-logistique-saisonnalite',
    excerpt: 'Lorsqu\'un pic de saisonnalité survient, la gestion de la logistique devient un défi majeur. Découvrez nos stratégies d\'optimisation.',
    content: '<p>Une gestion efficace de la logistique pendant les périodes de forte activité est essentielle pour maintenir la satisfaction client et la rentabilité.</p><h2>Stratégies d\'optimisation</h2><p>Optimisez vos flux en réorganisant votre entrepôt, en formant du personnel temporaire et en utilisant des équipements adaptés à vos besoins spécifiques.</p><h2>L\'importance de l\'anticipation</h2><p>Préparez-vous en amont en renforçant vos stocks, en planifiant les rotations d\'équipes et en vérifiant l\'état de vos équipements de manutention.</p>',
    image: RANDOM_IMAGES[2],
    published: true,
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '4',
    title: 'Chariots électriques vs thermiques : lequel choisir pour votre entrepôt ?',
    slug: 'chariots-electriques-vs-thermiques',
    excerpt: 'Comparaison des chariots électriques et thermiques pour vous aider à faire le bon choix selon vos contraintes d\'utilisation et votre environnement.',
    content: '<p>Le choix entre un chariot électrique et un chariot thermique dépend de nombreux facteurs : utilisation intérieure ou extérieure, durée de travail quotidienne, budget et normes environnementales.</p><h2>Chariots électriques</h2><p>Idéaux pour les espaces fermés, silencieux, sans émission directe. Parfaits pour les environnements alimentaires ou pharmaceutiques.</p><h2>Chariots thermiques</h2><p>Plus adaptés aux utilisations extérieures intensives et aux charges lourdes. Plus longue autonomie et capacité de charge.</p>',
    image: RANDOM_IMAGES[3],
    published: true,
    createdAt: new Date('2024-01-02'),
  },
  {
    id: '5',
    title: 'Les avantages du reconditionnement de chariots élévateurs',
    slug: 'avantages-reconditionnement-chariots',
    excerpt: 'Découvrez pourquoi le reconditionnement de vos chariots peut vous faire économiser tout en garantissant des performances optimales.',
    content: '<p>Le reconditionnement professionnel prolonge la durée de vie de vos équipements tout en réduisant vos coûts d\'investissement.</p><h2>Économies substantielles</h2><p>Un chariot reconditionné coûte jusqu\'à 50 % moins cher qu\'un neuf, avec des performances équivalentes après une révision complète.</p><h2>Garantie et traçabilité</h2><p>Choisissez un partenaire qui propose une garantie et une traçabilité complète des interventions réalisées.</p>',
    image: RANDOM_IMAGES[4],
    published: true,
    createdAt: new Date('2023-12-28'),
  },
  {
    id: '6',
    title: 'Sécurité en entrepôt : les bonnes pratiques de manutention',
    slug: 'securite-entrepot-bonnes-pratiques',
    excerpt: 'La sécurité en entrepôt passe par des équipements adaptés et des formations régulières. Voici nos recommandations.',
    content: '<p>La manutention en entrepôt présente des risques qu\'il convient de maîtriser par une combinaison d\'équipements conformes et de formations du personnel.</p><h2>Équipements</h2><p>Vérifiez régulièrement l\'état de vos chariots, transpalettes et gerbeurs. Les contrôles périodiques sont obligatoires.</p><h2>Formation</h2><p>Formez vos opérateurs aux gestes de sécurité et assurez-vous que les habilitations sont à jour.</p>',
    image: RANDOM_IMAGES[5],
    published: true,
    createdAt: new Date('2023-12-20'),
  },
]

export async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
    if (posts.length > 0) return posts
  } catch {
    //
  }
  return fallbackPosts
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug, published: true },
    })
    if (post) return post
  } catch {
    //
  }
  return fallbackPosts.find((p) => p.slug === slug) || null
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