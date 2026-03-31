'use client'

import type { FocusEvent } from 'react'
import Link from 'next/link'
import type { ChariotsMiddleAction } from './chariotsMenuContent'
import styles from './ChariotsMegaMenuMiddleColumn.module.css'

export type ChariotsMegaMenuMiddleColumnProps = {
  items: ChariotsMiddleAction[]
  activeMiddle: string
  onActiveMiddleChange: (id: string) => void
  onNavigate?: () => void
  /** Survol d’une ligne du milieu (id) ou fin de survol (null) — ex. afficher la liste Louez pour la location. */
  onMiddleItemHover?: (id: string | null) => void
  /** Blur clavier : le parent peut ignorer si le focus va vers la colonne droite. */
  onMiddleItemBlur?: (e: FocusEvent<HTMLElement>) => void
}

/**
 * Middle column: contextual actions for the selected left category.
 * Hover / focus updates selection and drives the right column.
 * Optional `href` renders a link (closes mega menu on click).
 */
export function ChariotsMegaMenuMiddleColumn({
  items,
  activeMiddle,
  onActiveMiddleChange,
  onNavigate,
  onMiddleItemHover,
  onMiddleItemBlur,
}: ChariotsMegaMenuMiddleColumnProps) {
  if (items.length === 0) return null

  return (
    <div className={styles.root} role="region" aria-label="Actions">
      <ul className={styles.list} role="list">
        {items.map((m) => {
          const isActive = activeMiddle === m.id
          const className = `${styles.button} ${isActive ? styles.buttonActive : ''}`

          if (m.href) {
            return (
              <li key={m.id} className={styles.item}>
                <Link
                  href={m.href}
                  className={`${className} ${styles.buttonLink}`}
                  onMouseEnter={() => {
                    onActiveMiddleChange(m.id)
                    onMiddleItemHover?.(m.id)
                  }}
                  onMouseLeave={() => onMiddleItemHover?.(null)}
                  onFocus={() => {
                    onActiveMiddleChange(m.id)
                    onMiddleItemHover?.(m.id)
                  }}
                  onBlur={(e) => onMiddleItemBlur?.(e)}
                  onClick={onNavigate}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {m.label}
                </Link>
              </li>
            )
          }

          return (
            <li key={m.id} className={styles.item}>
              <button
                type="button"
                className={className}
                onMouseEnter={() => {
                  onActiveMiddleChange(m.id)
                  onMiddleItemHover?.(m.id)
                }}
                onMouseLeave={() => onMiddleItemHover?.(null)}
                onFocus={() => {
                  onActiveMiddleChange(m.id)
                  onMiddleItemHover?.(m.id)
                }}
                onBlur={(e) => onMiddleItemBlur?.(e)}
                aria-current={isActive ? 'true' : undefined}
              >
                {m.label}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
