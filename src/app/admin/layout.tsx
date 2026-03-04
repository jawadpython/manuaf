import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminNav } from '@/components/admin/AdminNav'

export const metadata: Metadata = {
  title: 'Administration',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-[var(--background-alt)]">
      {session ? (
        <div className="flex">
          <AdminNav />
          <div className="flex-1 min-h-screen flex flex-col">
            <div className="flex-1 p-6 lg:p-8 max-w-6xl w-full mx-auto">
              {children}
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
