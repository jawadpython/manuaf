import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen flex items-center justify-center pt-[72px] md:pt-[96px]">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-[var(--accent)] mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-4">
          Page non trouvée
        </h2>
        <p className="text-[var(--grey)] mb-8 text-lg">
          Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/produits/chariots"
            className="px-6 py-3 border-2 border-[var(--accent)] text-[var(--accent)] font-medium hover:bg-[var(--accent)] hover:text-white transition-colors"
          >
            Voir nos produits
          </Link>
        </div>
      </div>
    </div>
  )
}
