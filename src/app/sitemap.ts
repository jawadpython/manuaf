import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL || 'https://manuaf.com'

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/produits`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/demander-chariot`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  try {
    const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true } })
    const productUrls = products.map((p) => ({
      url: `${base}/produits/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    })
    const postUrls = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...staticPages, ...productUrls, ...postUrls]
  } catch {
    return staticPages
  }
}
