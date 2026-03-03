import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { DbLogPanel } from '@/components/admin/DbLogPanel'

export const metadata = {
  title: 'Log Base de données | Admin',
  description: 'Vérifier la connexion Supabase et afficher les erreurs',
}

export default async function AdminLogPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <>
      <header className="mb-6">
        <h1 className="font-display text-xl lg:text-2xl text-[var(--foreground)] tracking-tight">
          Statut Base de données
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Vérifier la connexion Supabase et consulter les erreurs
        </p>
      </header>

      <DbLogPanel />
    </>
  )
}
