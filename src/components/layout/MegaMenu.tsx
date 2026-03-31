'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChariotsMegaMenuColumns } from './ChariotsMegaMenuColumns'
import styles from './MegaMenu.module.css'

export type NavLink = { href: string; label: string }

export type MegaMenuItem = NavLink & {
  subLinks?: NavLink[]
  image?: string
  description?: string | null
}

export type FeaturedContent = {
  subtitle: string
  title: string
  description: string
  href: string
  cta: string
  image: string
}

const PANEL_LEAVE_CLOSE_DELAY_MS = 550
const BUTTON_LEAVE_CLOSE_DELAY_MS = 2000
const CLOSE_ANIMATION_MS = 320
const MIN_OPEN_DURATION_MS = 450
const OPEN_DELAY_MS = 120

type HighlightItem = {
  icon: 'check' | 'clock' | 'shield' | 'zap'
  label: string
}

export type MegaMenuVariant = 'default' | 'chariotsShell'

type MegaMenuOverlayProps = {
  id: string
  title: string
  items: MegaMenuItem[]
  open: boolean
  onClose: () => void
  onMouseEnterPanel?: () => void
  onMouseLeavePanel?: () => void
  variant?: MegaMenuVariant
  /** Required when variant is default (Pièces / Services). Ignored for chariotsShell. */
  featured?: FeaturedContent
  highlights?: HighlightItem[]
  highlightsByHref?: Record<string, HighlightItem[]>
}

const HIGHLIGHT_ICONS = {
  check: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  clock: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  shield: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  zap: (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
}

/** Produits (chariots / nacelles / transpalettes) : méga-menu 3 colonnes. */
function ChariotsShellPanel({
  id,
  title,
  open,
  onClose,
  onMouseEnterPanel,
  onMouseLeavePanel,
  isVisible,
  isClosing,
  panelOpen,
  backdropVisible,
}: {
  id: string
  title: string
  open: boolean
  onClose: () => void
  onMouseEnterPanel?: () => void
  onMouseLeavePanel?: () => void
  isVisible: boolean
  isClosing: boolean
  panelOpen: boolean
  backdropVisible: boolean
}) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!open) return
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!isVisible) return null

  return (
    <div className={styles.megaMenu}>
      <div
        className={`${styles.megaMenu__backdrop} ${backdropVisible ? styles.megaMenu__backdropVisible : ''}`}
        aria-hidden
        onClick={onClose}
      />
      <div
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={`Menu ${title}`}
        aria-hidden={!panelOpen}
        className={`${styles.megaMenu__panel} ${panelOpen ? styles.megaMenu__panelOpen : ''} ${isClosing ? styles.megaMenu__panelClosing : ''}`}
      >
        <div
          className={styles.megaMenu__hoverZone}
          onMouseEnter={onMouseEnterPanel}
          onMouseLeave={onMouseLeavePanel}
        >
          <div className={styles.megaMenu__bridge} aria-hidden />
          <div className={styles.megaMenu__card}>
            <ChariotsMegaMenuColumns title={title} onNavigate={onClose} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function MegaMenuOverlay({
  id,
  title,
  items,
  featured,
  open,
  onClose,
  onMouseEnterPanel,
  onMouseLeavePanel,
  variant = 'default',
  highlights = [],
  highlightsByHref,
}: MegaMenuOverlayProps) {
  const isShell = variant === 'chariotsShell'
  const panelRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isClosing, setIsClosing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeItem = items[activeIndex]
  const subLinks = activeItem?.subLinks ?? []
  const rawHighlights = (activeItem?.href && highlightsByHref?.[activeItem.href]) ?? highlights
  const effectiveHighlights: HighlightItem[] = Array.isArray(rawHighlights) ? rawHighlights : []
  const featuredImage = activeItem?.image ?? featured?.image ?? ''
  const featuredDescription = activeItem?.description ?? featured?.description ?? ''
  const featuredHref = activeItem?.href ?? featured?.href ?? '#'

  const focusItem = useCallback(
    (index: number) => {
      const i = Math.max(0, Math.min(index, items.length - 1))
      if (i === activeIndex) return
      setActiveIndex(i)
      itemRefs.current[i]?.focus()
    },
    [items.length, activeIndex]
  )

  useEffect(() => {
    if (!open) return
    setIsVisible(true)
    setIsClosing(false)
    if (!isShell) setActiveIndex(0)
  }, [open, title, items, isShell])

  useEffect(() => {
    if (!open && isVisible) {
      setIsClosing(true)
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = setTimeout(() => {
        setIsVisible(false)
        setIsClosing(false)
        closeTimeoutRef.current = null
      }, CLOSE_ANIMATION_MS)
    }
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [open, isVisible])

  useEffect(() => {
    if (isShell) return
    function handleKeyDown(e: KeyboardEvent) {
      if (!open) return
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        focusItem(activeIndex + 1)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        focusItem(activeIndex - 1)
        return
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose, activeIndex, focusItem, isShell])

  if (isShell) {
    const backdropVisible = open && !isClosing
    const panelOpen = open && !isClosing
    return (
      <ChariotsShellPanel
        id={id}
        title={title}
        open={open}
        onClose={onClose}
        onMouseEnterPanel={onMouseEnterPanel}
        onMouseLeavePanel={onMouseLeavePanel}
        isVisible={isVisible}
        isClosing={isClosing}
        panelOpen={panelOpen}
        backdropVisible={backdropVisible}
      />
    )
  }

  if (!featured) {
    return null
  }

  if (!isVisible) return null

  const backdropVisible = open && !isClosing
  const panelOpen = open && !isClosing

  return (
    <div className={styles.megaMenu}>
      <div
        className={`${styles.megaMenu__backdrop} ${backdropVisible ? styles.megaMenu__backdropVisible : ''}`}
        aria-hidden
        onClick={onClose}
      />
      <div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={`Menu ${title}`}
        aria-hidden={!panelOpen}
        className={`${styles.megaMenu__panel} ${panelOpen ? styles.megaMenu__panelOpen : ''} ${isClosing ? styles.megaMenu__panelClosing : ''}`}
      >
        <div
          className={styles.megaMenu__hoverZone}
          onMouseEnter={onMouseEnterPanel}
          onMouseLeave={onMouseLeavePanel}
        >
          <div className={styles.megaMenu__bridge} aria-hidden />
          <div className={styles.megaMenu__card}>
            <div className={styles.megaMenu__grid}>
              <aside className={styles.megaMenu__sidebar}>
                <h3 className={styles.megaMenu__title}>{title}</h3>
                <nav role="menu" aria-label={`Sous-menu ${title}`} className={styles.megaMenu__nav}>
                  {items.map((item, i) => (
                    <Link
                      key={item.href}
                      ref={(el) => {
                        itemRefs.current[i] = el
                      }}
                      href={item.href}
                      role="menuitem"
                      onClick={onClose}
                      onMouseEnter={() => setActiveIndex(i)}
                      onFocus={() => setActiveIndex(i)}
                      className={`${styles.megaMenu__item} ${activeIndex === i ? styles.megaMenu__itemActive : ''}`}
                    >
                      <span>{item.label}</span>
                      <svg
                        className={styles.megaMenu__itemArrow}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </nav>
              </aside>

              <div key={title} className={styles.megaMenu__right}>
                <div className={styles.megaMenu__rightContent}>
                  <h4 className={styles.megaMenu__contentTitle}>
                    {activeItem?.label ?? featured.title}
                  </h4>
                  {subLinks.length > 0 ? (
                    <ul className={styles.megaMenu__subLinks} role="list">
                      {subLinks.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} onClick={onClose} className={styles.megaMenu__subLink}>
                            <span>{link.label}</span>
                            <svg
                              className={styles.megaMenu__subLinkChevron}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : effectiveHighlights.length > 0 ? (
                    <ul className={styles.megaMenu__highlights} role="list">
                      {effectiveHighlights.map((h, i) => (
                        <li key={i} className={styles.megaMenu__highlightItem}>
                          <span className={styles.megaMenu__highlightIcon} aria-hidden>
                            {HIGHLIGHT_ICONS[h.icon]}
                          </span>
                          <span>{h.label}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className={styles.megaMenu__featured}>
                  <div className={styles.megaMenu__featuredImage}>
                    <Image
                      src={featuredImage}
                      alt=""
                      fill
                      className={styles.megaMenu__featuredImg}
                      sizes="(max-width: 768px) 100vw, 400px"
                      unoptimized={featuredImage.startsWith('http')}
                    />
                  </div>
                  <div className={styles.megaMenu__featuredBody}>
                    <p className={styles.megaMenu__featuredSubtitle}>{featured.subtitle}</p>
                    <h5 className={styles.megaMenu__featuredHeading}>{activeItem?.label ?? featured.title}</h5>
                    <p className={styles.megaMenu__featuredDescription}>{featuredDescription || featured.description}</p>
                    <Link href={featuredHref} onClick={onClose} className={styles.megaMenu__cta}>
                      {featured.cta}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.megaMenu__footer} aria-hidden>
              <svg
                className={styles.megaMenu__footerIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { PANEL_LEAVE_CLOSE_DELAY_MS, BUTTON_LEAVE_CLOSE_DELAY_MS, MIN_OPEN_DURATION_MS, OPEN_DELAY_MS }
