import Link from 'next/link'

interface ProductRequestCTAProps {
  productName: string
  label?: string
}

export function ProductRequestCTA({ productName, label = 'Demander un devis' }: ProductRequestCTAProps) {
  const href = `/demander-chariot?product=${encodeURIComponent(productName)}`

  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[var(--accent)] text-[#1a1a1a] font-bold text-xs uppercase tracking-wider hover:bg-[var(--accent-hover)] transition-colors"
    >
      {label}
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </Link>
  )
}
