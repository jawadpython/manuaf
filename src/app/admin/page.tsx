import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl text-white mb-2">
        Dashboard
      </h1>
      <p className="text-white/60 mb-8">
        Bienvenue dans l&apos;administration
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/categories"
          className="block p-6 bg-[#141414] border border-white/5 hover:border-white/10 transition-colors"
        >
          <h2 className="font-display text-xl text-white mb-2">Catégories</h2>
          <p className="text-white/60 text-sm">
            Gérer les catégories de produits
          </p>
        </Link>
        <Link
          href="/admin/produits"
          className="block p-6 bg-[#141414] border border-white/5 hover:border-white/10 transition-colors"
        >
          <h2 className="font-display text-xl text-white mb-2">Produits</h2>
          <p className="text-white/60 text-sm">
            Gérer le catalogue produits
          </p>
        </Link>
        <Link
          href="/admin/services"
          className="block p-6 bg-[#141414] border border-white/5 hover:border-white/10 transition-colors"
        >
          <h2 className="font-display text-xl text-white mb-2">Services</h2>
          <p className="text-white/60 text-sm">
            Gérer les services
          </p>
        </Link>
        <Link
          href="/admin/blog"
          className="block p-6 bg-[#141414] border border-white/5 hover:border-white/10 transition-colors"
        >
          <h2 className="font-display text-xl text-white mb-2">Blog</h2>
          <p className="text-white/60 text-sm">
            Gérer les articles
          </p>
        </Link>
      </div>
    </div>
  )
}
