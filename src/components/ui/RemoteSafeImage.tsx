import Image from 'next/image'

const LOCAL_FALLBACK = '/images/products/chr5-min-276x300.jpg'

/** True for URLs that must not use next/image (remote, protocol-relative, data URIs). */
export function isRemoteImageUrl(src: string): boolean {
  return (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('//') ||
    src.startsWith('data:')
  )
}

type Props = {
  src: string
  alt: string
  className?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
}

/**
 * Uses `<img>` for http(s) URLs so production never 500s on unlisted `images.remotePatterns`.
 * Uses `next/image` for local `/...` paths (optimization + layout).
 */
export function RemoteSafeImage({ src, alt, className, fill, sizes, priority }: Props) {
  const normalized = typeof src === 'string' ? src.trim() : ''
  /** Empty/invalid src makes next/image throw — common with bad DB values or whitespace. */
  if (!normalized) {
    if (!fill) return null
    return (
      <Image
        src={LOCAL_FALLBACK}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    )
  }

  if (isRemoteImageUrl(normalized)) {
    if (fill) {
      return (
        <img
          src={normalized}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover ${className ?? ''}`}
          decoding="async"
        />
      )
    }
    return <img src={normalized} alt={alt} className={className} decoding="async" />
  }
  return (
    <Image
      src={normalized.startsWith('/') ? normalized : `/${normalized}`}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  )
}
