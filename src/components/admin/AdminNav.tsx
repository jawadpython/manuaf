'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/categories', label: 'Catégories' },
  { href: '/admin/produits', label: 'Produits' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/blog', label: 'Blog' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#0f0f0f] border-r border-white/5 min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/5">
        <Link href="/admin" className="font-display text-xl text-white">
          Admin
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-3 text-sm transition-colors ${
              pathname === link.href
                ? 'bg-white/5 text-[var(--accent)]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link
          href="/"
          className="block px-4 py-3 text-sm text-white/60 hover:text-white mb-2"
        >
          Voir le site →
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="block w-full text-left px-4 py-3 text-sm text-white/60 hover:text-white"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
