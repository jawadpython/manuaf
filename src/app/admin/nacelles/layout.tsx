import Link from 'next/link'

export default function AdminNacellesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav
        className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-4 mb-8"
        aria-label="Sections nacelles"
      >
        <Link
          href="/admin/nacelles/occasion"
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-[var(--background-alt)] text-[var(--foreground-muted)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors"
        >
          Nacelles d&apos;occasion
        </Link>
        <Link
          href="/admin/nacelles/location"
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-[var(--background-alt)] text-[var(--foreground-muted)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-colors"
        >
          Nacelles de location
        </Link>
      </nav>
      {children}
    </div>
  )
}
