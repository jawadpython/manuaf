'use client'

import Link from 'next/link'

/**
 * Fixed right-side utility bar — yellow buttons that expand into tape on hover
 */
const buttons = [
  {
    href: '/produits/chariots',
    label: 'Nos produits',
    icon: (
      <svg className="w-7 h-7 shrink-0 text-[#1a1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    href: '/contact',
    label: 'Demande de devis',
    icon: (
      <svg className="w-7 h-7 shrink-0 text-[#1a1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: 'tel:+212670085699',
    label: 'Nous appeler',
    icon: (
      <svg className="w-7 h-7 shrink-0 text-[#1a1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    href: '/contact',
    label: 'Nous trouver',
    icon: (
      <svg className="w-7 h-7 shrink-0 text-[#1a1a1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export function RightUtilityBar() {
  return (
    <aside
      className="fixed right-0 top-[calc(50%+4cm)] -translate-y-1/2 z-[60] hidden md:flex flex-col gap-2 w-11 shadow-lg overflow-visible"
      aria-label="Accès rapide"
    >
      {buttons.map((btn) => (
        <Link
          key={btn.label}
          href={btn.href}
          className="group relative flex items-center justify-end w-11 h-11 px-1 bg-[var(--utility-bar-bg)] text-[var(--foreground)] hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] transition-colors duration-300"
          aria-label={btn.label}
        >
          <span className="relative z-10 flex items-center justify-center group-hover:text-[#1a1a1a] transition-colors duration-300">
            {btn.icon}
          </span>
          <span className="absolute right-11 top-0 h-11 flex items-center justify-end pr-2 pl-4 bg-[var(--accent)] overflow-hidden origin-right transition-[width] duration-300 ease-out w-0 group-hover:w-[170px]">
            <span className="text-sm font-bold text-[#1a1a1a] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75 ease-out">
              {btn.label}
            </span>
          </span>
        </Link>
      ))}
    </aside>
  )
}
