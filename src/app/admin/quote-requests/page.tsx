import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { QuoteRequestsManager } from '@/components/admin/QuoteRequestsManager'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demandes de devis - Administration',
}

export default async function AdminQuoteRequestsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-xl lg:text-2xl text-[var(--foreground)] tracking-tight">
          Demandes de devis
        </h1>
        <p className="mt-1 text-[var(--foreground-muted)]">
          Demandes envoyées depuis le formulaire de devis (produits, location chariots / nacelles, etc.)
        </p>
      </header>
      <QuoteRequestsManager />
    </>
  )
}
