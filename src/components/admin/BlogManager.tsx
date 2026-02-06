'use client'

import { useState } from 'react'
import { BlogPostForm } from './BlogPostForm'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string | null
  published: boolean
  createdAt: Date
}

export function BlogManager({
  initialPosts,
}: {
  initialPosts: BlogPost[]
}) {
  const [posts, setPosts] = useState(initialPosts)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [creating, setCreating] = useState(false)

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet article ?')) return
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts((p) => p.filter((x) => x.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      alert('Erreur de connexion')
      console.error('Delete error:', error)
    }
  }

  function handleSaved(post: { id: string; title: string; slug: string; excerpt: string; content: string; image: string | null; published: boolean; createdAt?: Date | string }) {
    const fullPost: BlogPost = {
      ...post,
      createdAt: post.createdAt ? new Date(post.createdAt) : new Date(),
    }
    if (editing) {
      setPosts((p) => p.map((x) => (x.id === fullPost.id ? fullPost : x)))
      setEditing(null)
    } else {
      setPosts((p) => [fullPost, ...p])
      setCreating(false)
    }
  }

  function formatDate(d: Date) {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(d))
  }

  return (
    <div className="space-y-8">
      <button
        type="button"
        onClick={() => setCreating(true)}
        className="bg-[var(--accent)] text-gray-900 px-6 py-2 font-semibold hover:bg-[var(--accent-hover)] transition-colors"
      >
        Nouvel article
      </button>

      {(creating || editing) && (
        <BlogPostForm
          post={editing || undefined}
          onSave={handleSaved}
          onCancel={() => {
            setCreating(false)
            setEditing(null)
          }}
        />
      )}

      <div className="border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-4 text-gray-900/60 text-sm font-medium">Titre</th>
              <th className="p-4 text-gray-900/60 text-sm font-medium">Date</th>
              <th className="p-4 text-gray-900/60 text-sm font-medium">Statut</th>
              <th className="p-4 text-gray-900/60 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-4 text-gray-900">{post.title}</td>
                <td className="p-4 text-gray-900/70 text-sm">
                  {formatDate(post.createdAt)}
                </td>
                <td className="p-4">
                  <span
                    className={`text-xs px-2 py-1 ${
                      post.published
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-white/10 text-gray-900/60'
                    }`}
                  >
                    {post.published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(post)}
                      className="text-[var(--accent)] text-sm hover:underline"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
