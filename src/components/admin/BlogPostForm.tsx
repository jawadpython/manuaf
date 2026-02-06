'use client'

import { useState } from 'react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string | null
  published: boolean
}

export function BlogPostForm({
  post,
  onSave,
  onCancel,
}: {
  post?: BlogPost
  onSave: (p: Partial<BlogPost> & Pick<BlogPost, 'id' | 'title' | 'slug' | 'excerpt' | 'content' | 'image' | 'published'>) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(post?.title ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [image, setImage] = useState(post?.image ?? '')
  const [published, setPublished] = useState(post?.published ?? true)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('Veuillez sélectionner un fichier image')
      return
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setUploadError('Fichier trop volumineux (max 10MB)')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      
      if (res.ok && data.url) {
        setImage(data.url)
        setUploadError(null)
      } else {
        setUploadError(data.error || 'Erreur lors du téléchargement')
      }
    } catch (error) {
      setUploadError('Erreur de connexion lors du téléchargement')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const url = post ? `/api/admin/blog/${post.id}` : '/api/admin/blog'
    const method = post ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        excerpt,
        content,
        image: image || null,
        published,
      }),
    })

    const saved = await res.json()
    if (res.ok) {
      onSave({ ...saved, createdAt: saved.createdAt ? new Date(saved.createdAt) : new Date() })
      setError(null)
    } else {
      setError(saved.error || 'Erreur lors de l\'enregistrement')
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 space-y-6 max-w-2xl"
    >
      <h3 className="font-display text-xl text-gray-900">
        {post ? "Modifier l'article" : "Nouvel article"}
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Extrait *</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          rows={2}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Contenu (HTML)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          placeholder="<p>Paragraphe...</p>"
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <span className="inline-block px-4 py-2 bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors rounded-lg shadow-md hover:shadow-lg">
                {image ? 'Changer l\'image' : 'Sélectionner une image'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {uploading && (
              <span className="text-blue-600 text-xs font-medium">Téléchargement en cours...</span>
            )}
          </div>
          {uploadError && (
            <p className="text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {uploadError}
            </p>
          )}
          {image && !uploading && !uploadError && (
            <div className="mt-3 space-y-2">
              <p className="text-gray-600 text-xs font-medium">Aperçu de l'image:</p>
              <div className="relative w-full max-w-xs h-48 bg-gray-100 border border-gray-300 overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={() => setUploadError('Impossible de charger l\'image')}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setImage('')
                  setUploadError(null)
                }}
                className="text-red-600 text-xs hover:text-red-700 hover:underline font-medium"
              >
                Supprimer l'image
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-5 h-5 text-[var(--accent)] border-gray-300 rounded focus:ring-[var(--accent)] focus:ring-2"
        />
        <label htmlFor="published" className="text-sm text-gray-700 font-medium">
          Publié
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--accent)] text-white px-6 py-2 font-semibold hover:bg-[var(--accent-hover)] disabled:opacity-50 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 text-gray-700 px-6 py-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
