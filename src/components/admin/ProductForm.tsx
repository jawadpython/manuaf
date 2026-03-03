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
  categoryType,
}: {
  product?: Product
  onSave: (p: Product) => void
  onCancel: () => void
  categoryType?: 'chariots' | 'pieces'
}) {
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? '')
  // Multiple images: stored as pipe-separated in DB, displayed as array
  const [images, setImages] = useState<string[]>(
    product?.image ? product.image.split(/[|\r\n]+/).map((u) => u.trim()).filter(Boolean) : []
  )
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
        setImages((prev) => [...prev, data.url])
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
        image: images.length > 0 ? images.join('|') : null,
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
      className="bg-white border border-gray-200 p-6 space-y-6 max-w-2xl"
    >
      <h3 className="font-display text-xl text-gray-900">
        {product ? 'Modifier le produit' : 'Nouveau produit'}
      </h3>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-900/70 mb-2">Nom *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-white border border-gray-200 px-4 py-2 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-900/70 mb-2">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full bg-white border border-gray-200 px-4 py-2 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-900/70 mb-2">Catégorie *</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full bg-white border border-gray-200 px-4 py-2 text-gray-900"
        >
          <option value="">Sélectionner une catégorie</option>
          {categoryType ? (
            // Show only categories of the specified type
            categories
              .filter((cat) => cat.type === categoryType)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.parent ? `${cat.parent.name} > ${cat.name}` : cat.name}
                </option>
              ))
          ) : (
            // Show all categories grouped by type (default behavior)
            <>
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
            </>
          )}
        </select>
        {categories.length === 0 && (
          <p className="text-gray-900/50 text-xs mt-1">
            Aucune catégorie disponible. Créez d&apos;abord des catégories.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-900/70 mb-2">Images (galerie produit)</label>
        <p className="text-xs text-gray-900/50 mb-2">Vous pouvez ajouter plusieurs images. La première sera affichée en principal.</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="cursor-pointer">
              <span className="inline-block px-4 py-2 bg-[var(--accent)] text-gray-900 text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors">
                {uploading ? 'Téléchargement...' : 'Ajouter une image'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          {uploadError && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 px-3 py-2 rounded">
              {uploadError}
            </p>
          )}
          {images.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-gray-900/70 text-xs">{images.length} image(s) ajoutée(s):</p>
              <div className="flex flex-wrap gap-3">
                {images.map((url, i) => (
                  <div key={i} className="relative group">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-[#1a1a1a] border border-gray-200 overflow-hidden rounded">
                      <img
                        src={url}
                        alt={`Image ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={() => setUploadError('Impossible de charger l\'image')}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Supprimer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-900/70 mb-2">
          Caractéristiques (format: Libellé: valeur — une par ligne)
        </label>
        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          rows={8}
          placeholder={`Marque:
Modèle:
Capacité:
Dimensions:
État: 3/4`}
          className="w-full bg-white border border-gray-200 px-4 py-2 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-900/70 mb-2">Ordre</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
          className="w-24 bg-white border border-gray-200 px-4 py-2 text-gray-900"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--accent)] text-gray-900 px-6 py-2 font-semibold hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 text-gray-900 px-6 py-2 hover:bg-gray-50"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
