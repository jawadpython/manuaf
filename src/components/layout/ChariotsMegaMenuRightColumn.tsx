'use client'

import Link from 'next/link'
import { louezLineToProductHref } from '@/lib/utils'
import styles from './ChariotsMegaMenuRightColumn.module.css'

export type ChariotsMegaMenuRightColumnProps = {
  /** Full line labels (e.g. « Louez votre … ») → `/produits/{slug}`. */
  lines: string[]
  onNavigate?: () => void
  className?: string
}

/**
 * Right column: liens vers les fiches produits (chariots / nacelles location).
 */
export function ChariotsMegaMenuRightColumn({
  lines,
  onNavigate,
  className,
}: ChariotsMegaMenuRightColumnProps) {
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
          {lines.map((line) => (
              <li key={line} className={styles.row}>
                <Link href={louezLineToProductHref(line)} className={styles.link} onClick={onNavigate}>
                  <span>{line}</span>
                  <span className={styles.arrow} aria-hidden>
                    →
                  </span>
                </Link>
              </li>
          ))}
        </ul>
      )}
    </div>
  )
}
