import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { SITE_URL } from '@/lib/seo'
import { getAllCitySlugs } from '@/lib/cities'

/** Categories that redirect to dedicated pages - exclude from /produits/c/[slug] */
const CHARIOTS_REDIRECT_SLUGS = ['chariots-de-location', 'chariots-d-occasion']
const NACELLES_REDIRECT_SLUGS = ['nacelles-de-location', 'nacelles-d-occasion']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL

  const staticPages: MetadataRoute.Sitemap = [
    // Home & main
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    // Products
    { url: `${base}/produits/chariots/location`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    // Local SEO city landing pages
    ...getAllCitySlugs().map((slug) => ({
      url: `${base}/location/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    { url: `${base}/produits/chariots/occasion`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/produits/pieces`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/produits/pieces/batteries`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/produits/pieces/commandes`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/produits/pieces/accessoires`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Services
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/services/location`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/services/maintenance`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/services/reconditionnement`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    // Other
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/demander-chariot`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/qui-sommes-nous`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/mentions-legales`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/confidentialite`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  let productUrls: MetadataRoute.Sitemap = []
  let categoryUrls: MetadataRoute.Sitemap = []
  let postUrls: MetadataRoute.Sitemap = []

  try {
    const [products, categories, posts] = await Promise.all([
      prisma.product.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        where: {
          published: true,
          OR: [
            { type: 'chariots', slug: { notIn: CHARIOTS_REDIRECT_SLUGS } },
            { type: 'nacelles', slug: { notIn: NACELLES_REDIRECT_SLUGS } },
          ],
        },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ])

    productUrls = products.map((p) => ({
      url: `${base}/produits/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    categoryUrls = categories.map((c) => ({
      url: `${base}/produits/c/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    }))

    postUrls = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('[sitemap] Failed to fetch dynamic routes:', error)
  }

  return [...staticPages, ...productUrls, ...categoryUrls, ...postUrls]
}
