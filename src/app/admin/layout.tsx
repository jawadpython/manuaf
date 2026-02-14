import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminNav } from '@/components/admin/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-gray-50">
      {session ? (
        <div className="flex">
          <AdminNav />
          <div className="flex-1 min-h-screen bg-gray-50">
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
