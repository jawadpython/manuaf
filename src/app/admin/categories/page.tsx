import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CategoryManager } from '@/components/admin/CategoryManager'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catégories - Administration',
}

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  let categories
  try {
    categories = await prisma.category.findMany({
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        children: {
          select: { id: true, name: true, slug: true },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: [{ type: 'asc' }, { parentId: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    })
  } catch (err) {
    console.error('Admin categories DB error:', err)
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50 p-6 max-w-xl">
        <h2 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
          Erreur de connexion à la base de données
        </h2>
        <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">
          Impossible de charger les catégories. Ceci arrive souvent lorsque <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">DATABASE_URL</code> sur Vercel
          utilise le pool Supabase (port 6543) sans <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">?pgbouncer=true</code>.
        </p>
        <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">
          Vercel → Paramètres → Variables d&apos;environnement → <strong>DATABASE_URL</strong> :
          ajoutez <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">?pgbouncer=true</code> à la fin de l&apos;URL, puis redéployez.
        </p>
        <Link
          href="/admin/log"
          className="inline-block px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm font-medium"
        >
          Vérifier le statut DB (Log)
        </Link>
      </div>
    )
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-xl lg:text-2xl text-[var(--foreground)] tracking-tight">
          Catégories
        </h1>
        <p className="mt-1 text-[var(--foreground-muted)]">
          Gérer les catégories et sous-catégories de produits
        </p>
      </header>
      <CategoryManager initialCategories={categories} />
    </>
  )
}
