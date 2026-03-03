import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { RentalRequestsManager } from '@/components/admin/RentalRequestsManager'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demandes de location - Administration',
}

export default async function AdminRentalRequestsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-xl lg:text-2xl text-[var(--foreground)] tracking-tight">
          Demandes de location
        </h1>
        <p className="mt-1 text-[var(--foreground-muted)]">
          Gérer les demandes de location de chariots élévateurs
        </p>
      </header>
      <RentalRequestsManager />
    </>
  )
}
