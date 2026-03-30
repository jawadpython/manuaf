'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

/* Grouped admin navigation: Contenu (categories, chariots, produits, services, blog) and General (dashboard, site, logout) */

const contentLinks = [
  { href: '/admin/categories', label: 'Catégories' },
  { href: '/admin/mega-menu', label: 'Mega-menu Chariots' },
  { href: '/admin/chariots/occasion', label: "Chariots d'occasion" },
  { href: '/admin/chariots/location', label: 'Chariots de location' },
  { href: '/admin/nacelles/occasion', label: "Nacelles d'occasion" },
  { href: '/admin/nacelles/location', label: 'Nacelles de location' },
  { href: '/admin/produits', label: 'Pièces de rechange' },
  { href: '/admin/rental-requests', label: 'Demandes location' },
  { href: '/admin/quote-requests', label: 'Demandes devis' },
  { href: '/admin/form-devis', label: 'Formulaire devis' },
  { href: '/admin/blog', label: 'Blog' },
]

export function AdminNav() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname?.startsWith(href)
  }

  return (
    <aside
      className="w-64 min-h-screen flex flex-col bg-white border-r border-[var(--border)] shrink-0"
      aria-label="Navigation administration"
    >
      {/* Brand block */}
      <div className="p-6 border-b border-[var(--border)] bg-[var(--grey)]">
        <Link
          href="/admin"
          className="font-display text-base text-white tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
        >
          Admin MANUAF
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-6" aria-label="Sections du panel">
        {/* Group: General */}
        <div>
          <p className="px-3 mb-2 text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider">
            Général
          </p>
          <ul className="space-y-0.5" role="list">
            <li>
              <Link
                href="/admin"
                className={`block px-4 py-3 text-sm rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                  pathname === '/admin'
                    ? 'bg-[var(--accent)]/15 text-[var(--accent)] font-semibold'
                    : 'text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] hover:text-[var(--foreground)]'
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/log"
                className={`block px-4 py-3 text-sm rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                  pathname === '/admin/log'
                    ? 'bg-[var(--accent)]/15 text-[var(--accent)] font-semibold'
                    : 'text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] hover:text-[var(--foreground)]'
                }`}
              >
                Log / Statut DB
              </Link>
            </li>
          </ul>
        </div>

        {/* Group: Contenu */}
        <div>
          <p className="px-3 mb-2 text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-wider">
            Contenu
          </p>
          <ul className="space-y-0.5" role="list">
            {contentLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-4 py-3 text-sm rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                    isActive(link.href)
                      ? 'bg-[var(--accent)]/15 text-[var(--accent)] font-semibold'
                      : 'text-[var(--foreground-muted)] hover:bg-[var(--background-alt)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer: site link + logout */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--background-alt)] space-y-1">
        <Link
          href="/"
          className="block px-4 py-3 text-sm text-[var(--foreground-muted)] hover:text-[var(--accent)] hover:bg-white rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Voir le site →
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="block w-full text-left px-4 py-3 text-sm text-[var(--foreground-muted)] hover:text-red-600 hover:bg-white rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
