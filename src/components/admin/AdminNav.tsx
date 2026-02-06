'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/categories', label: 'Catégories' },
  { href: '/admin/chariots', label: 'Chariots' },
  { href: '/admin/produits', label: 'Pièces de rechange' },
  { href: '/admin/blog', label: 'Blog' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]">
        <Link href="/admin" className="font-display text-xl text-white">
          Admin Panel
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-3 text-sm transition-colors rounded-lg ${
              pathname === link.href
                ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-semibold'
                : 'text-gray-700 hover:text-[var(--accent)] hover:bg-gray-50'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <Link
          href="/"
          className="block px-4 py-3 text-sm text-gray-600 hover:text-[var(--accent)] mb-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Voir le site →
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
