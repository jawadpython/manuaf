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
      className="bg-[#141414] border border-white/10 p-6 space-y-6 max-w-2xl"
    >
      <h3 className="font-display text-xl text-white">
        {post ? "Modifier l'article" : "Nouvel article"}
      </h3>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm text-white/70 mb-2">Titre *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">Extrait *</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          rows={2}
          className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">Contenu (HTML)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          placeholder="<p>Paragraphe...</p>"
          className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-2 text-white font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">Image</label>
        <div className="flex gap-4 items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="text-white/70 text-sm"
          />
          <input
            type="url"
            value={image}
            onChange={(e) => {
              setImage(e.target.value)
              setUploadError(null)
            }}
            placeholder="Ou URL"
            className="flex-1 bg-[#0a0a0a] border border-white/10 px-4 py-2 text-white"
          />
        </div>
        {uploading && (
          <p className="text-blue-400 text-xs mt-2">Téléchargement en cours...</p>
        )}
        {uploadError && (
          <p className="text-red-400 text-xs mt-2">{uploadError}</p>
        )}
        {image && !uploading && !uploadError && (
          <div className="mt-3">
            <p className="text-white/50 text-xs mb-2 truncate max-w-md">{image}</p>
            <div className="relative w-32 h-32 bg-[#1a1a1a] border border-white/10 overflow-hidden">
              <img
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setUploadError('Impossible de charger l\'image')}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-4 h-4 accent-[var(--accent)]"
        />
        <label htmlFor="published" className="text-white/80 text-sm">
          Publié
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--accent)] text-white px-6 py-2 font-semibold hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-white/20 text-white px-6 py-2 hover:bg-white/5"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
