'use client'

import Link from 'next/link'
import {
  louezLineToLocationDevisHref,
  louezLineToNacelleLocationDevisHref,
  louezLineToProductHref,
} from '@/lib/utils'
import styles from './ChariotsMegaMenuRightColumn.module.css'

export type ChariotsMegaMenuRightColumnProps = {
  /** Full line labels (e.g. « Louez votre … »). */
  lines: string[]
  onNavigate?: () => void
  className?: string
  /**
   * `product` = link to `/produits/{slug}` (default).
   * `location_devis` = chariots location: devis avec produit prérempli.
   * `nacelle_location_devis` = nacelles location: idem avec `category=nacelles-de-location`.
   */
  lineHrefMode?: 'product' | 'location_devis' | 'nacelle_location_devis'
}

/**
 * Right column: CTA product links only (no cards / images).
 */
export function ChariotsMegaMenuRightColumn({
  lines,
  onNavigate,
  className,
  lineHrefMode = 'product',
}: ChariotsMegaMenuRightColumnProps) {
  const hrefForLine = (line: string) => {
    if (lineHrefMode === 'location_devis') return louezLineToLocationDevisHref(line)
    if (lineHrefMode === 'nacelle_location_devis') return louezLineToNacelleLocationDevisHref(line)
    return louezLineToProductHref(line)
  }

  return (
    <div
      className={`${styles.root} ${className ?? ''}`}
      role="region"
      aria-label="Produits"
    >
      {lines.length === 0 ? (
        <p className={styles.empty}>Aucun contenu pour cette sélection.</p>
      ) : (
        <ul className={styles.list} role="list">
          {lines.map((line) => {
            const href = hrefForLine(line)
            return (
              <li key={line} className={styles.row}>
                <Link href={href} className={styles.link} onClick={onNavigate}>
                  <span>{line}</span>
                  <span className={styles.arrow} aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
