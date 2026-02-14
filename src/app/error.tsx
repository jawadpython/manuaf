'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service in production
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex items-center justify-center pt-[72px] md:pt-[96px]">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-red-600 mb-4">
          Oups !
        </h1>
<<<<<<< HEAD
        <h2 className="text-xl md:text-2xl font-bold text-[var(--grey)] mb-4">
          Une erreur s&apos;est produite
        </h2>
        <p className="text-[var(--grey)] mb-8">
=======
        <h2 className="text-xl md:text-2xl font-bold text-[#333333] mb-4">
          Une erreur s&apos;est produite
        </h2>
        <p className="text-[#666666] mb-8">
>>>>>>> d44e53db8f1f969d9827ebe433fe036dcff6c46f
          Nous nous excusons pour le désagrément. Veuillez réessayer ou contacter notre support si le problème persiste.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-[var(--accent)] text-[var(--accent)] font-medium hover:bg-[var(--accent)] hover:text-white transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
