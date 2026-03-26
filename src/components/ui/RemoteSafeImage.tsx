import Image from 'next/image'

/** True for absolute URLs (Blob, Cloudinary, etc.). Next/Image rejects unknown hosts — use native <img> instead. */
export function isRemoteImageUrl(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://')
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
  if (isRemoteImageUrl(src)) {
    if (fill) {
      return (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover ${className ?? ''}`}
          decoding="async"
        />
      )
    }
    return <img src={src} alt={alt} className={className} decoding="async" />
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  )
}
