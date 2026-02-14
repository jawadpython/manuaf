'use client'

import { useState } from 'react'
import Link from 'next/link'

type NavLink = {
  href: string
  label: string
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Accueil' },
  { href: '/produits/pieces', label: 'Pièces de rechange' },
  { href: '/produits/chariots/location', label: 'Chariots de location' },
  { href: '/produits/chariots/occasion', label: "Chariots d'occasion" },
  { href: '/services', label: 'Services' },
  { href: '/qui-sommes-nous', label: 'Qui sommes-nous' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

const socialLinks = [
  { href: 'https://www.facebook.com', label: 'Facebook', icon: 'facebook' },
  { href: 'https://www.instagram.com', label: 'Instagram', icon: 'instagram' },
  { href: 'https://www.linkedin.com', label: 'LinkedIn', icon: 'linkedin' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar - Yellow: social icons + Demande de devis on the right (hidden on mobile) */}
      <div className="bg-[var(--accent)] py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-end items-center gap-5">
          <div className="flex items-center gap-4">
            {socialLinks.map(({ href, label, icon }) => (
              <a
                key={icon}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--grey)] hover:opacity-80 transition-opacity"
                aria-label={label}
              >
                {icon === 'facebook' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                )}
                {icon === 'instagram' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                )}
                {icon === 'linkedin' && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                )}
              </a>
            ))}
          </div>
          <Link
            href="/contact"
            className="text-black text-sm font-medium hover:opacity-80 transition-opacity"
          >
            Demande de devis
          </Link>
        </div>
      </div>
      
      {/* Main navigation - Grey - overflow-visible so scaled logo isn't clipped */}
      <div className="bg-[var(--grey)] shadow-sm overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center -ml-4 sm:-ml-6 h-8 sm:h-9 md:h-10 min-w-[100px] overflow-visible"
          >
            {!logoError ? (
              <img
                src="/images/NEW-logo-MANUAF-1-.png"
                alt="MANUAF"
                width={180}
                height={40}
                className="h-full w-auto object-contain object-left max-w-[180px] block scale-125 origin-left"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
                MANUAF
              </span>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white hover:text-[var(--accent)] transition-colors uppercase tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-white"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="md:hidden border-t border-gray-600 px-4 sm:px-6 py-4 bg-[var(--grey)]">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white hover:text-[var(--accent)] transition-colors uppercase text-sm py-3 border-b border-gray-600 block"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="px-4 py-3 bg-[var(--accent)] text-white text-center text-sm font-medium mt-2"
                onClick={() => setOpen(false)}
              >
                Demande de devis
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
