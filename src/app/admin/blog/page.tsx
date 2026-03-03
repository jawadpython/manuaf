import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BlogManager } from '@/components/admin/BlogManager'

export default async function AdminBlogPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-xl lg:text-2xl text-[var(--foreground)] tracking-tight">
          Blog
        </h1>
        <p className="mt-1 text-[var(--foreground-muted)]">
          Gérer les articles
        </p>
      </header>
      <BlogManager initialPosts={posts} />
    </>
  )
}
