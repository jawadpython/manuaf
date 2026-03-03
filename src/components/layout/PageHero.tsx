import Image from 'next/image'
import { RANDOM_IMAGES } from '@/lib/randomImages'

export type PageHeroProps = {
  /** Short label above title (e.g. "Nos services", "Pièces de rechange") */
  label?: string
  /** Main heading */
  title: string
  /** Optional subtitle/description */
  subtitle?: string
  /** Hero background image URL. Falls back to RANDOM_IMAGES if not provided */
  image?: string
  /** Image index when using RANDOM_IMAGES fallback */
  imageIndex?: number
  /** White card layout (left-aligned like services page) */
  whiteCard?: boolean
  /** Custom className for the section */
  className?: string
}

export function PageHero({
  label,
  title,
  subtitle,
  image,
  imageIndex = 0,
  whiteCard = false,
  className = '',
}: PageHeroProps) {
  const bgImage = image ?? RANDOM_IMAGES[imageIndex % RANDOM_IMAGES.length]

  return (
    <section
      className={`relative overflow-hidden -mt-[var(--header-height)] pt-[calc(var(--header-height)+3rem)] md:pt-[calc(var(--header-height)+4rem)] lg:pt-[calc(var(--header-height)+6rem)] pb-12 md:pb-16 lg:pb-24 bg-[var(--grey)] ${className}`}
    >
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
          unoptimized={bgImage.startsWith('http')}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/60" />
      </div>
      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 ${
          whiteCard ? 'flex justify-start' : 'text-center'
        }`}
      >
        {whiteCard ? (
          <div className="bg-white p-6 md:p-8 lg:p-10 text-left max-w-xl shadow-lg">
            {label && (
              <p className="text-[var(--accent)] font-semibold text-sm uppercase tracking-wider mb-2 md:mb-3">
                {label}
              </p>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4 leading-tight">
              {title}
            </h1>
            <div className="w-16 md:w-20 h-1 bg-[var(--accent)] mb-4 md:mb-6" aria-hidden />
            {subtitle && (
              <p className="text-[var(--foreground-muted)] text-base sm:text-lg leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        ) : (
          <>
            {label && (
              <p className="text-[var(--accent)] font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
                {label}
              </p>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              {title}
            </h1>
            <div className="w-16 sm:w-20 h-1 bg-[var(--accent)] mx-auto mb-4 sm:mb-6" aria-hidden />
            {subtitle && (
              <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
                {subtitle}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
