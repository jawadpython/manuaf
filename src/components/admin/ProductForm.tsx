'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
  type: string // 'chariots' | 'pieces'
  parentId: string | null
  parent?: { id: string; name: string } | null
  children?: Array<{ id: string; name: string }>
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  categoryId: string
  category?: { id: string; name: string; slug: string }
  image: string | null
  features: string | null
  order: number
}

export function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product?: Product
  onSave: (p: Product) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? '')
  const [image, setImage] = useState(product?.image ?? '')
  const [features, setFeatures] = useState(product?.features ?? '')
  const [order, setOrder] = useState(product?.order ?? 0)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // Fetch categories from admin API (includes all categories for admin)
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error fetching categories:', err))
  }, [])

  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Veuillez sélectionner un fichier image')
      return
    }

    // Validate file size (10MB max)
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

    const url = product
      ? `/api/admin/products/${product.id}`
      : '/api/admin/products'
    const method = product ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        categoryId,
        image: image || null,
        features: features || null,
        order,
      }),
    })

    const saved = await res.json()
    if (res.ok) {
      onSave(saved)
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
        {product ? 'Modifier le produit' : 'Nouveau produit'}
      </h3>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm text-white/70 mb-2">Nom *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">Catégorie *</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-2 text-white"
        >
          <option value="">Sélectionner une catégorie</option>
          {/* Group by type */}
          <optgroup label="Chariots">
            {categories
              .filter((cat) => cat.type === 'chariots')
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.parent ? `${cat.parent.name} > ${cat.name}` : cat.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="Pièces de rechange">
            {categories
              .filter((cat) => cat.type === 'pieces')
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.parent ? `${cat.parent.name} > ${cat.name}` : cat.name}
                </option>
              ))}
          </optgroup>
        </select>
        {categories.length === 0 && (
          <p className="text-white/50 text-xs mt-1">
            Aucune catégorie disponible. Créez d&apos;abord des catégories.
          </p>
        )}
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

      <div>
        <label className="block text-sm text-white/70 mb-2">
          Caractéristiques (une par ligne)
        </label>
        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          rows={4}
          placeholder={'Option A\nOption B\nOption C'}
          className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">Ordre</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
          className="w-24 bg-[#0a0a0a] border border-white/10 px-4 py-2 text-white"
        />
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
