'use client'

import Link from 'next/link'
import styles from './ChariotsMegaMenuOccasionRight.module.css'

export type ChariotsMegaMenuOccasionRightProps = {
  imageSrc: string
  imageAlt: string
  title: string
  body: string
  ctaLabel: string
  ctaHref: string
  onNavigate?: () => void
  /** Libellé pour aria-label de la région (accessibilité). */
  regionAriaLabel?: string
}

/**
 * Right column for « Chariots d'occasion »: image + text + CTA instead of product link list.
 */
export function ChariotsMegaMenuOccasionRight({
  imageSrc,
  imageAlt,
  title,
  body,
  ctaLabel,
  ctaHref,
  onNavigate,
  regionAriaLabel = "Chariots d'occasion",
}: ChariotsMegaMenuOccasionRightProps) {
  return (
    <div className={styles.root} role="region" aria-label={regionAriaLabel}>
      <figure className={styles.figure}>
        {/* eslint-disable-next-line @next/next/no-img-element -- public path may contain spaces; avoids config churn */}
        <img className={styles.image} src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" />
      </figure>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.body}>{body}</p>
      <Link href={ctaHref} className={styles.cta} onClick={onNavigate}>
        {ctaLabel}
        <span className={styles.ctaArrow} aria-hidden>
          →
        </span>
      </Link>
    </div>
  )
}
