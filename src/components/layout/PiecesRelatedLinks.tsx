import Link from 'next/link'

type Sibling = { href: string; label: string }

type PiecesRelatedLinksProps = {
  currentSlug: string
}

const SIBLINGS: Sibling[] = [
  { href: '/produits/pieces/batteries', label: 'Batteries et chargeurs' },
  { href: '/produits/pieces/commandes', label: 'Commandes de pièces' },
  { href: '/produits/pieces/accessoires', label: 'Accessoires' },
]

export function PiecesRelatedLinks({ currentSlug }: PiecesRelatedLinksProps) {
  const others = SIBLINGS.filter((s) => !s.href.endsWith(currentSlug))

  return (
    <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
      <h3 className="font-bold text-[#333333] mb-4">Voir aussi</h3>
      <ul className="flex flex-wrap gap-3">
        <li>
          <Link
            href="/produits/pieces"
            className="text-[var(--accent)] font-medium hover:underline"
          >
            Toutes nos pièces de rechange
          </Link>
        </li>
        {others.map((s) => (
          <li key={s.href}>
            <span className="text-[var(--grey)]">•</span>{' '}
            <Link
              href={s.href}
              className="text-[var(--accent)] font-medium hover:underline"
            >
              {s.label}
            </Link>
          </li>
        ))}
        <li>
          <span className="text-[var(--grey)]">•</span>{' '}
          <Link
            href="/produits/chariots/location"
            className="text-[var(--accent)] font-medium hover:underline"
          >
            Location de chariots
          </Link>
        </li>
      </ul>
    </div>
  )
}
