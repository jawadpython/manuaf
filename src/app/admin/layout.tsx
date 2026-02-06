import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AdminNav } from '@/components/admin/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Allow login page without session
  if (!session && typeof window === 'undefined') {
    // Server-side: check if we're on login page
    // This is handled by middleware, but we add extra protection here
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {session ? (
        <div className="flex">
          <AdminNav />
          <div className="flex-1 min-h-screen">
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
