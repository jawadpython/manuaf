import Link from 'next/link'

type PiecesBreadcrumbProps = {
  currentLabel: string
}

export function PiecesBreadcrumb({ currentLabel }: PiecesBreadcrumbProps) {
  return (
    <nav
      className="max-w-7xl mx-auto px-4 sm:px-6 py-4"
      aria-label="Fil d'Ariane"
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--grey)]">
        <li>
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">
            Accueil
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link href="/produits/pieces" className="hover:text-[var(--accent)] transition-colors">
            Pièces de rechange
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li className="text-[var(--foreground)] font-medium">{currentLabel}</li>
      </ol>
    </nav>
  )
}
