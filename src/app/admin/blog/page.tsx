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
    <div className="p-8">
      <h1 className="font-display text-3xl text-gray-900 mb-2">Blog</h1>
      <p className="text-gray-600 mb-8">Gérer les articles</p>
      <BlogManager initialPosts={posts} />
    </div>
  )
}
