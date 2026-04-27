import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { BackupManager } from '@/components/admin/BackupManager'

export const metadata = {
  title: 'Sauvegarde | Admin',
  description: 'Exporter et importer la base et les fichiers locaux',
}

export default async function AdminBackupPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <>
      <header className="mb-6">
        <h1 className="font-display text-xl lg:text-2xl text-[var(--foreground)] tracking-tight">
          Sauvegarde &amp; restauration
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Export / import complet (Prisma + images sous <code className="text-xs">/uploads/</code>).
        </p>
      </header>
      <BackupManager />
    </>
  )
}
