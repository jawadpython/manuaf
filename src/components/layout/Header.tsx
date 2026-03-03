'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  MegaMenuOverlay,
  type MegaMenuItem,
  type FeaturedContent,
  PANEL_LEAVE_CLOSE_DELAY_MS,
  BUTTON_LEAVE_CLOSE_DELAY_MS,
  MIN_OPEN_DURATION_MS,
} from './MegaMenu'
import headerStyles from './Header.module.css'

const DESKTOP_MIN_WIDTH_PX = 1025

type NavLink = { href: string; label: string }

const topLevelLinks: NavLink[] = [
  { href: '/', label: 'Accueil' },
  { href: '/qui-sommes-nous', label: 'Qui sommes-nous' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

/** Descriptions for each chariots submenu (shown on hover) */
const CHARIOTS_LOCATION_DESC =
  "Pour une journée ou pour un an — si vous avez besoin rapidement d'un chariot élévateur, vous pouvez compter sur notre service de location."
const CHARIOTS_OCCASION_DESC =
  "Équipements reconditionnés et garantis pour optimiser votre budget sans compromettre la qualité."

/** Fallback when API returns empty */
const chariotsGroupFallback: MegaMenuItem[] = [
  { href: '/produits/chariots/location', label: 'Location', image: '/images/Chariots de location (2).webp', subLinks: [], description: CHARIOTS_LOCATION_DESC },
  { href: '/produits/chariots/occasion', label: "Chariots d'occasion", image: "/images/Chariots d'occasion.webp", subLinks: [], description: CHARIOTS_OCCASION_DESC },
]
const piecesGroupFallback: MegaMenuItem[] = [
  { href: '/produits/pieces', label: 'Pièces de rechange', subLinks: [] },
]

const servicesGroup: MegaMenuItem[] = [
  { href: '/services?service=maintenance', label: 'Maintenance', image: '/images/services/maintenance.webp', subLinks: [] },
  { href: '/services?service=reconditionnement', label: 'Reconditionnement', image: '/images/services/reconditionnement.webp', subLinks: [] },
  { href: '/services?service=location', label: 'Location', image: '/images/services/location.webp', subLinks: [] },
]

const chariotsFeatured: FeaturedContent = {
  subtitle: 'NOUS SOMMES À VOTRE ENTIÈRE DISPOSITION',
  title: 'Location de chariots élévateurs',
  description:
    'Pour une journée ou pour un an — si vous avez besoin rapidement d\'un chariot élévateur, vous pouvez compter sur notre service de location.',
  href: '/produits/chariots/location',
  cta: 'EN SAVOIR PLUS',
  image: '/images/Chariots de location (2).webp',
}

const piecesFeatured: FeaturedContent = {
  subtitle: 'PIÈCES ET ACCESSOIRES',
  title: 'Pièces de rechange',
  description:
    'Batteries, accessoires et éléments de commande pour vos équipements de manutention.',
  href: '/produits/pieces',
  cta: 'EN SAVOIR PLUS',
  image: '/images/products/chr5-min-276x300.jpg',
}

const servicesFeatured: FeaturedContent = {
  subtitle: 'SOLUTIONS COMPLÈTES',
  title: 'Nos services',
  description:
    'Maintenance, reconditionnement et location pour optimiser votre flotte et réduire vos coûts.',
  href: '/services',
  cta: 'EN SAVOIR PLUS',
  image: '/images/services/maintenance.webp',
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [chariotsOpen, setChariotsOpen] = useState(false)
  const [piecesOpen, setPiecesOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [mobileChariotsExpanded, setMobileChariotsExpanded] = useState(false)
  const [mobilePiecesExpanded, setMobilePiecesExpanded] = useState(false)
  const [mobileServicesExpanded, setMobileServicesExpanded] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  const [chariotsGroup, setChariotsGroup] = useState<MegaMenuItem[]>(chariotsGroupFallback)
  const [piecesGroup, setPiecesGroup] = useState<MegaMenuItem[]>(piecesGroupFallback)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const buttonLeaveDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const chariotsOpenAtRef = useRef<number>(0)
  const piecesOpenAtRef = useRef<number>(0)
  const servicesOpenAtRef = useRef<number>(0)
  useEffect(() => {
    Promise.all([
      fetch('/api/mega-menu/chariots').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/mega-menu/pieces').then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([chariots, pieces]: MegaMenuItem[][]) => {
        if (Array.isArray(chariots) && chariots.length > 0) {
          const enriched = chariots.map((item: MegaMenuItem) => {
            if (item.description) return item
            if (item.href?.includes('/location')) return { ...item, description: CHARIOTS_LOCATION_DESC }
            if (item.href?.includes('/occasion')) return { ...item, description: CHARIOTS_OCCASION_DESC }
            return item
          })
          setChariotsGroup(enriched)
        }
        if (Array.isArray(pieces) && pieces.length > 0) setPiecesGroup(pieces)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH_PX}px)`)
    const handler = () => setIsDesktop(mq.matches)
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const clearCloseTimer = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const clearOpenTimer = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
      openTimeoutRef.current = null
    }
  }

  const scheduleOpen = (openFn: () => void) => {
    clearButtonLeaveDelay()
    clearOpenTimer()
    clearCloseTimer()
    openFn()
  }

  const cancelOpen = () => {
    clearOpenTimer()
  }

  const clearButtonLeaveDelay = () => {
    if (buttonLeaveDelayRef.current) {
      clearTimeout(buttonLeaveDelayRef.current)
      buttonLeaveDelayRef.current = null
    }
  }

  const scheduleClose = (
    close: () => void,
    delayMs: number = PANEL_LEAVE_CLOSE_DELAY_MS,
    openAtRef?: React.MutableRefObject<number>
  ) => {
    clearCloseTimer()
    let delay = delayMs
    if (openAtRef && openAtRef.current > 0) {
      const elapsed = Date.now() - openAtRef.current
      delay = Math.max(delayMs, MIN_OPEN_DURATION_MS - elapsed)
    }
    closeTimeoutRef.current = setTimeout(close, delay)
  }

  const openChariots = () => {
    clearButtonLeaveDelay()
    clearCloseTimer()
    chariotsOpenAtRef.current = Date.now()
    setPiecesOpen(false)
    setServicesOpen(false)
    setChariotsOpen(true)
  }

  const openPieces = () => {
    clearButtonLeaveDelay()
    clearCloseTimer()
    piecesOpenAtRef.current = Date.now()
    setChariotsOpen(false)
    setServicesOpen(false)
    setPiecesOpen(true)
  }

  const openServices = () => {
    clearButtonLeaveDelay()
    clearCloseTimer()
    servicesOpenAtRef.current = Date.now()
    setChariotsOpen(false)
    setPiecesOpen(false)
    setServicesOpen(true)
  }

  const closeAll = () => {
    clearCloseTimer()
    clearOpenTimer()
    setOpen(false)
    setChariotsOpen(false)
    setPiecesOpen(false)
    setServicesOpen(false)
    setMobileChariotsExpanded(false)
    setMobilePiecesExpanded(false)
    setMobileServicesExpanded(false)
  }

  return (
    <header
      className="sticky top-0 left-0 right-0 z-30 header-root"
      role="banner"
    >
      {/* Top bar — 32px, compact CTA */}
      <div className="h-8 bg-[var(--header-top-bg)] hidden md:flex items-center">
        <div className="layout-container flex justify-between items-center h-full">
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="flex items-center gap-1.5 text-white/90 text-xs hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Trouver une agence
            </Link>
            <Link href="/qui-sommes-nous" className="text-white/90 text-xs hover:text-white transition-colors duration-200 cursor-pointer">
              Qui sommes-nous
            </Link>
            <Link href="/blog" className="text-white/90 text-xs hover:text-white transition-colors duration-200 cursor-pointer">
              Blog
            </Link>
          </div>
          <Link
            href="/contact"
            className="bg-[var(--accent)] text-[var(--foreground)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--accent-hover)] transition-colors duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-md"
          >
            Demande de devis
          </Link>
        </div>
      </div>

      {/* Main nav bar — 56px, dense and premium */}
      <div className="h-14 bg-[var(--header-main-bg)] flex items-center">
        <div className="layout-container flex items-center justify-between gap-4">
          <nav
            className="hidden md:flex items-center gap-3 flex-1 min-w-0"
            aria-label="Navigation principale"
            role="menubar"
          >
            <Link
              href="/contact"
              className="flex-shrink-0 w-9 h-9 bg-[var(--accent)] rounded-md flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--accent-hover)] transition-colors duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              aria-label="Recherche"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/"
              className="px-3 py-2 text-[12px] font-semibold text-[var(--nav-link-color)] hover:text-[var(--nav-link-hover)] transition-colors duration-300 ease-out uppercase tracking-wide rounded cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Accueil
            </Link>
            <div
              className="flex items-center gap-0"
              onMouseLeave={isDesktop ? () => {
                cancelOpen()
                clearButtonLeaveDelay()
                const t = setTimeout(() => {
                  buttonLeaveDelayRef.current = null
                  scheduleClose(closeAll, PANEL_LEAVE_CLOSE_DELAY_MS)
                }, 120)
                buttonLeaveDelayRef.current = t
              } : undefined}
            >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={chariotsOpen}
              aria-controls="mega-chariots"
              onMouseEnter={isDesktop ? () => scheduleOpen(openChariots) : undefined}
              onClick={() => {
                setChariotsOpen((v) => !v)
                setPiecesOpen(false)
                setServicesOpen(false)
              }}
              className={`flex items-center gap-1 px-3 py-2 text-[12px] font-semibold uppercase tracking-wide rounded cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-300 ease-out ${
                chariotsOpen ? 'text-[var(--accent)]' : 'text-[var(--nav-link-color)] hover:text-[var(--nav-link-hover)]'
              }`}
            >
              Chariots
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${chariotsOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={piecesOpen}
              aria-controls="mega-pieces"
              onMouseEnter={isDesktop ? () => scheduleOpen(openPieces) : undefined}
              onClick={() => {
                setPiecesOpen((v) => !v)
                setChariotsOpen(false)
                setServicesOpen(false)
              }}
              className={`flex items-center gap-1 px-3 py-2 text-[12px] font-semibold uppercase tracking-wide rounded cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-300 ease-out ${
                piecesOpen ? 'text-[var(--accent)]' : 'text-[var(--nav-link-color)] hover:text-[var(--nav-link-hover)]'
              }`}
            >
              Pièces de rechange
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${piecesOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={servicesOpen}
              aria-controls="mega-services"
              onMouseEnter={isDesktop ? () => scheduleOpen(openServices) : undefined}
              onClick={() => {
                setServicesOpen((v) => !v)
                setChariotsOpen(false)
                setPiecesOpen(false)
              }}
              className={`flex items-center gap-1 px-3 py-2 text-[12px] font-semibold uppercase tracking-wide rounded cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-300 ease-out ${
                servicesOpen ? 'text-[var(--accent)]' : 'text-[var(--nav-link-color)] hover:text-[var(--nav-link-hover)]'
              }`}
            >
              Services
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${servicesOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            </div>
            {topLevelLinks
              .filter((l) => l.href !== '/' && l.href !== '/contact')
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-[12px] font-semibold text-[var(--nav-link-color)] hover:text-[var(--nav-link-hover)] transition-colors duration-300 ease-out uppercase tracking-wide rounded cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {link.label}
                </Link>
              ))}
            <Link
              href="/contact"
              className="px-3 py-2 text-[12px] font-semibold text-[var(--nav-link-color)] hover:text-[var(--nav-link-hover)] transition-colors duration-300 ease-out uppercase tracking-wide rounded cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Contact
            </Link>
          </nav>

          <Link
            href="/"
            className="flex items-center h-8 min-w-[100px] overflow-visible shrink-0 ml-auto md:ml-0 cursor-pointer"
            aria-label="MANUAF - Accueil"
            suppressHydrationWarning
          >
            {!logoError ? (
              <img
                src="/images/NEW-logo-MANUAF-1-.png"
                alt=""
                width={180}
                height={40}
                className="h-full w-auto max-h-8 object-contain object-right max-w-[180px] block brightness-0 invert"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight font-display">
                MANUAF
              </span>
            )}
          </Link>

          <button
            type="button"
            className="md:hidden p-2 text-white rounded cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <MegaMenuOverlay
        key={chariotsOpen ? 'chariots' : piecesOpen ? 'pieces' : 'services'}
        id="mega-menu"
        title={chariotsOpen ? 'Chariots' : piecesOpen ? 'Pièces de rechange' : 'Services'}
        items={chariotsOpen ? chariotsGroup : piecesOpen ? piecesGroup : servicesGroup}
        featured={chariotsOpen ? chariotsFeatured : piecesOpen ? piecesFeatured : servicesFeatured}
        open={chariotsOpen || piecesOpen || servicesOpen}
        onClose={closeAll}
        onMouseEnterPanel={isDesktop ? () => { clearButtonLeaveDelay(); clearCloseTimer() } : undefined}
        onMouseLeavePanel={isDesktop ? () => scheduleClose(closeAll, PANEL_LEAVE_CLOSE_DELAY_MS) : undefined}
        highlights={
          chariotsOpen
            ? [
                { icon: 'clock' as const, label: 'Location flexible courte ou longue durée' },
                { icon: 'shield' as const, label: 'Équipements récents et entretenus' },
                { icon: 'check' as const, label: 'Maintenance incluse' },
                { icon: 'check' as const, label: 'Sans investissement initial important' },
                { icon: 'zap' as const, label: 'Service réactif' },
                { icon: 'clock' as const, label: 'Disponibilité rapide' },
              ]
            : undefined
        }
        highlightsByHref={
          chariotsOpen
            ? {
                '/produits/chariots/location': [
                  { icon: 'clock' as const, label: 'Location flexible courte ou longue durée' },
                  { icon: 'shield' as const, label: 'Équipements récents et entretenus' },
                  { icon: 'check' as const, label: 'Maintenance incluse' },
                  { icon: 'check' as const, label: 'Sans investissement initial important' },
                  { icon: 'zap' as const, label: 'Service réactif' },
                  { icon: 'clock' as const, label: 'Disponibilité rapide' },
                ],
                '/produits/chariots/occasion': [
                  { icon: 'shield' as const, label: 'Matériel fiable et contrôlé' },
                  { icon: 'zap' as const, label: 'Électriques ou thermiques' },
                  { icon: 'check' as const, label: 'Révisés et prêts à l\'emploi' },
                  { icon: 'shield' as const, label: 'Garantie selon modèle' },
                  { icon: 'check' as const, label: 'Prix compétitifs' },
                  { icon: 'clock' as const, label: 'Disponibilité immédiate' },
                ],
              }
            : undefined
        }
      />

      {/* Mobile: slide-in drawer + accordion */}
      <div
        className={`${headerStyles.drawerBackdrop} ${open ? headerStyles.drawerBackdropOpen : ''}`}
        aria-hidden
        onClick={closeAll}
      />
      <aside
        id="mobile-menu"
        className={`${headerStyles.drawer} ${open ? headerStyles.drawerOpen : ''}`}
        aria-label="Menu mobile"
        aria-modal="true"
        role="dialog"
      >
        <div className={headerStyles.drawerContent}>
            <Link
              href="/"
              className="block py-3 text-white font-bold uppercase text-sm border-b border-white/10 transition-colors duration-200 cursor-pointer"
              onClick={closeAll}
            >
              Accueil
            </Link>

          {/* Accordion: Chariots */}
          <div className="border-b border-white/10">
            <button
              type="button"
              className="flex items-center justify-between w-full py-3 text-left text-white/60 text-xs font-semibold uppercase tracking-wider cursor-pointer"
              onClick={() => setMobileChariotsExpanded((v) => !v)}
              aria-expanded={mobileChariotsExpanded}
              aria-controls="mobile-chariots-list"
            >
              Chariots
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${mobileChariotsExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul id="mobile-chariots-list" className={mobileChariotsExpanded ? 'block pb-2' : 'hidden'} role="list">
              {chariotsGroup.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between py-3 px-4 text-white hover:bg-white/10 rounded transition-colors duration-200 cursor-pointer"
                    onClick={closeAll}
                  >
                    {link.label}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Accordion: Pièces de rechange */}
          <div className="border-b border-white/10">
            <button
              type="button"
              className="flex items-center justify-between w-full py-3 text-left text-white/60 text-xs font-semibold uppercase tracking-wider cursor-pointer"
              onClick={() => setMobilePiecesExpanded((v) => !v)}
              aria-expanded={mobilePiecesExpanded}
              aria-controls="mobile-pieces-list"
            >
              Pièces de rechange
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${mobilePiecesExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul id="mobile-pieces-list" className={mobilePiecesExpanded ? 'block pb-2' : 'hidden'} role="list">
              {piecesGroup.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between py-3 px-4 text-white hover:bg-white/10 rounded transition-colors duration-200 cursor-pointer"
                    onClick={closeAll}
                  >
                    {link.label}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Accordion: Services */}
          <div className="border-b border-white/10">
            <button
              type="button"
              className="flex items-center justify-between w-full py-3 text-left text-white/60 text-xs font-semibold uppercase tracking-wider cursor-pointer"
              onClick={() => setMobileServicesExpanded((v) => !v)}
              aria-expanded={mobileServicesExpanded}
              aria-controls="mobile-services-list"
            >
              Services
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${mobileServicesExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul id="mobile-services-list" className={mobileServicesExpanded ? 'block pb-2' : 'hidden'} role="list">
              {servicesGroup.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between py-3 px-4 text-white hover:bg-white/10 rounded transition-colors duration-200 cursor-pointer"
                    onClick={closeAll}
                  >
                    {link.label}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {topLevelLinks
            .filter((l) => l.href !== '/' && l.href !== '/contact')
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-white font-bold uppercase text-sm border-b border-white/10 transition-colors duration-200 cursor-pointer"
                onClick={closeAll}
              >
                {link.label}
              </Link>
            ))}
          <Link
            href="/contact"
            className="flex mt-4 px-4 py-3 bg-[var(--accent)] text-[var(--foreground)] font-bold justify-center rounded cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] transition-colors duration-200"
            onClick={closeAll}
          >
            Demande de devis
          </Link>
        </div>
      </aside>
    </header>
  )
}
