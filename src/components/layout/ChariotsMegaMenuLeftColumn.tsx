'use client'

import Link from 'next/link'
import { getLeftNavHref } from './chariotsMenuContent'
import styles from './ChariotsMegaMenuLeftColumn.module.css'

export type ChariotsLeftMenuKey =
  | 'transpalette'
  | 'chariots_occasion'
  | 'chariots_location'
  | 'nacelle_occasion'
  | 'nacelle_location'

const ITEMS: { key: ChariotsLeftMenuKey; label: string }[] = [
  { key: 'transpalette', label: 'Transpalette manuel' },
  { key: 'chariots_occasion', label: "Chariots élévateurs d'occasion" },
  { key: 'chariots_location', label: 'Chariots élévateurs en location' },
  { key: 'nacelle_occasion', label: "Nacelle d'occasion" },
  { key: 'nacelle_location', label: 'Nacelle en location' },
]

export type ChariotsMegaMenuLeftColumnProps = {
  /** Section title shown above the list */
  title?: string
  /** Controlled selection (must match right column). */
  activeItem: ChariotsLeftMenuKey
  onActiveItemChange: (key: ChariotsLeftMenuKey) => void
  /** Fermer le méga-menu après navigation */
  onNavigate?: () => void
  className?: string
}

/**
 * Colonne gauche du méga-menu Chariots : chaque entrée est un lien vers la page concernée ;
 * le survol / focus met à jour la sélection pour l’aperçu au centre et à droite.
 */
export function ChariotsMegaMenuLeftColumn({
  title = 'Chariots',
  activeItem,
  onActiveItemChange,
  onNavigate,
  className,
}: ChariotsMegaMenuLeftColumnProps) {
  return (
    <div
      className={`${styles.root} ${className ?? ''}`}
      role="region"
      aria-label={title}
    >
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.list} role="list">
        {ITEMS.map((row) => {
          const isActive = activeItem === row.key
          return (
            <li key={row.key} className={styles.item}>
              <Link
                href={getLeftNavHref(row.key)}
                className={`${styles.button} ${isActive ? styles.buttonActive : ''}`}
                onMouseEnter={() => onActiveItemChange(row.key)}
                onFocus={() => onActiveItemChange(row.key)}
                onClick={onNavigate}
                aria-current={isActive ? 'true' : undefined}
              >
                {row.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
