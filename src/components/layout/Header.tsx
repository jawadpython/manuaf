'use client'

import { useState } from 'react'
import Link from 'next/link'

type NavLink = {
  href: string
  label: string
  submenu?: Array<{ href: string; label: string }>
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Accueil' },
  { 
    href: '/produits/chariots', 
    label: 'Produits',
    submenu: [
      { href: '/produits/chariots', label: 'Chariots' },
      { href: '/produits/pieces', label: 'Pièces de rechange' },
    ]
  },
  { href: '/services', label: 'Services' },
  { href: '/qui-sommes-nous', label: 'Qui sommes-nous' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

const phoneNumber = '+212 670 085 699'

export function Header() {
  const [open, setOpen] = useState(false)
  const [productsHover, setProductsHover] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar - Yellow (hidden on mobile) */}
      <div className="bg-[var(--accent)] text-white text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a 
              href={`tel:${phoneNumber.replace(/\s/g, '')}`} 
              className="flex items-center gap-2 hover:text-[#333333] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {phoneNumber}
            </a>
          </div>
          <Link 
            href="/contact" 
            className="px-4 py-1.5 bg-[#333333] text-white text-xs font-medium hover:bg-[#444444] transition-colors"
          >
            Demande de devis
          </Link>
        </div>
      </div>
      
      {/* Main navigation - Grey */}
      <div className="bg-[#4a4a4a] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight"
          >
            MANUAF
          </Link>

          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => {
              if (link.submenu) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setProductsHover(true)}
                    onMouseLeave={() => setProductsHover(false)}
                  >
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-white hover:text-[var(--accent)] transition-colors uppercase tracking-wide flex items-center gap-1"
                    >
                      {link.label}
                      <svg
                        className={`w-4 h-4 transition-transform ${productsHover ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                    {productsHover && (
                      <>
                        {/* Invisible bridge to prevent gap */}
                        <div className="absolute top-full left-0 w-full h-2"></div>
                        <div className="absolute top-full left-0 pt-2 w-48 z-50">
                          <div className="bg-white shadow-lg rounded-md overflow-hidden border border-gray-100">
                            {link.submenu.map((subLink) => (
                              <Link
                                key={subLink.href}
                                href={subLink.href}
                                className="block px-4 py-3 text-sm text-[#333333] hover:bg-[var(--accent)] hover:text-white transition-colors"
                              >
                                {subLink.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white hover:text-[var(--accent)] transition-colors uppercase tracking-wide"
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-white"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
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
          <nav className="md:hidden border-t border-gray-600 px-4 sm:px-6 py-4 bg-[#4a4a4a]">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                if (link.submenu) {
                  return (
                    <div key={link.href}>
                      <Link
                        href={link.href}
                        className="text-white hover:text-[var(--accent)] transition-colors uppercase text-sm py-3 border-b border-gray-600 block"
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </Link>
                      <div className="pl-4 pb-2">
                        {link.submenu.map((subLink) => (
                          <Link
                            key={subLink.href}
                            href={subLink.href}
                            className="text-gray-300 hover:text-[var(--accent)] transition-colors text-sm py-2 block"
                            onClick={() => setOpen(false)}
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white hover:text-[var(--accent)] transition-colors uppercase text-sm py-3 border-b border-gray-600"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              })}
              {/* Phone number on mobile */}
              <a 
                href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-white py-3 border-b border-gray-600"
              >
                <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {phoneNumber}
              </a>
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
