import type { Metadata } from 'next'

const SITE_NAME = 'MANUAF'

/** Never throw from `new URL()` — invalid NEXT_PUBLIC_SITE_URL breaks root layout metadataBase on Vercel. */
function getSafeSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.manuaf.com').trim()
  try {
    return new URL(raw).origin
  } catch {
    return 'https://www.manuaf.com'
  }
}

const SITE_URL = getSafeSiteUrl()
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/NEW-logo-MANUAF-1-.png`
const TWITTER_HANDLE = '@manuaf'

/** Max length for meta description (SEO best practice) */
const MAX_DESCRIPTION_LENGTH = 155

function truncateDescription(desc: string | undefined | null, max = MAX_DESCRIPTION_LENGTH): string {
  if (desc == null || typeof desc !== 'string') return ''
  if (desc.length <= max) return desc
  return desc.slice(0, max - 3).trim() + '...'
}

export type PageMetadata = {
  title: string
  description: string
  /** Override canonical URL */
  canonical?: string
  /** Override OG image (absolute URL) */
  image?: string
  /** Use robots noindex (admin pages) */
  noindex?: boolean
}

/**
 * Creates Next.js Metadata with Open Graph and Twitter Card.
 * Use for page-level metadata. Root layout provides defaults.
 */
export function createMetadata(input: PageMetadata): Metadata {
  const description = truncateDescription(input.description)
  const title = typeof input.title === 'string' && input.title.trim() ? input.title : 'MANUAF'
  const ogUrl = input.canonical
    ? (input.canonical.startsWith('http') ? input.canonical : `${SITE_URL}${input.canonical}`)
    : SITE_URL
  const image = input.image || DEFAULT_OG_IMAGE

  return {
    title,
    description,
    ...(input.noindex && {
      robots: { index: false, follow: false },
    }),
    alternates: input.canonical && !input.canonical.startsWith('http')
      ? { canonical: `${SITE_URL}${input.canonical}` }
      : undefined,
    openGraph: {
      type: 'website',
      locale: 'fr_MA',
      url: ogUrl,
      siteName: SITE_NAME,
      title,
      description,
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title,
      description,
      images: [image],
    },
  }
}

export { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, truncateDescription }
