import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl text-gray-900 mb-2">
        Dashboard
      </h1>
      <p className="text-gray-600 mb-8">
        Bienvenue dans l&apos;administration
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/categories"
          className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-[var(--accent)] hover:shadow-lg transition-all"
        >
          <h2 className="font-display text-xl text-gray-900 mb-2">Catégories</h2>
          <p className="text-gray-600 text-sm">
            Gérer les catégories de produits
          </p>
        </Link>
        <Link
          href="/admin/chariots"
          className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-[var(--accent)] hover:shadow-lg transition-all"
        >
          <h2 className="font-display text-xl text-gray-900 mb-2">Chariots</h2>
          <p className="text-gray-600 text-sm">
            Gérer les chariots élévateurs
          </p>
        </Link>
        <Link
          href="/admin/produits"
          className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-[var(--accent)] hover:shadow-lg transition-all"
        >
          <h2 className="font-display text-xl text-gray-900 mb-2">Pièces de rechange</h2>
          <p className="text-gray-600 text-sm">
            Gérer les pièces de rechange
          </p>
        </Link>
        <Link
          href="/admin/blog"
          className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-[var(--accent)] hover:shadow-lg transition-all"
        >
          <h2 className="font-display text-xl text-gray-900 mb-2">Blog</h2>
          <p className="text-gray-600 text-sm">
            Gérer les articles
          </p>
        </Link>
      </div>
    </div>
  )
}
