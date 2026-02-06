'use client'

import { useState, useEffect } from 'react'

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
  sold: boolean
}

export function ChariotsForm({
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
  const [image, setImage] = useState(product?.image ?? '')
  const [features, setFeatures] = useState(product?.features ?? '')
  const [order, setOrder] = useState(product?.order ?? 0)
  const [sold, setSold] = useState(product?.sold ?? false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [chariotsCategoryId, setChariotsCategoryId] = useState<string>('')
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [noCategories, setNoCategories] = useState(false)

  async function createDefaultChariotsCategory() {
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Chariots',
          type: 'chariots',
          description: 'Catégorie par défaut pour les chariots',
          published: true,
        }),
      })
      const data = await res.json()
      if (res.ok && data.id) {
        setChariotsCategoryId(data.id)
        setNoCategories(false)
        setCategoriesLoading(false)
      } else {
        setError('Impossible de créer la catégorie par défaut. Veuillez créer une catégorie Chariots dans la section Catégories.')
        setCategoriesLoading(false)
      }
    } catch (error) {
      console.error('Error creating default category:', error)
      setError('Impossible de créer la catégorie par défaut. Veuillez créer une catégorie Chariots dans la section Catégories.')
      setCategoriesLoading(false)
    }
  }

  useEffect(() => {
    // Fetch Chariots categories only
    setCategoriesLoading(true)
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        const chariotsCategories = data.filter((cat: any) => cat.type === 'chariots')
        if (chariotsCategories.length > 0) {
          // Use first chariots category or the product's category if it's a chariots category
          const defaultCategory = product?.categoryId && chariotsCategories.find((c: any) => c.id === product.categoryId)
            ? product.categoryId
            : chariotsCategories[0].id
          setChariotsCategoryId(defaultCategory)
          setNoCategories(false)
          setCategoriesLoading(false)
        } else {
          // No Chariots categories exist - create a default one
          setNoCategories(true)
          createDefaultChariotsCategory()
        }
      })
      .catch((err) => {
        console.error('Error fetching categories:', err)
        setNoCategories(true)
        setCategoriesLoading(false)
      })
  }, [product?.categoryId])

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

    if (!chariotsCategoryId) {
      setError('Veuillez attendre le chargement des catégories')
      setLoading(false)
      return
    }

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
        categoryId: chariotsCategoryId,
        image: image || null,
        features: features || null,
        order,
        sold,
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
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 space-y-6 max-w-2xl"
    >
      <h3 className="font-display text-xl text-gray-900">
        {product ? 'Modifier le chariot' : 'Nouveau chariot'}
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded-lg">
          {error}
        </div>
      )}

      {categoriesLoading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 text-sm rounded-lg">
          Chargement des catégories...
        </div>
      )}

      {noCategories && !categoriesLoading && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 text-sm rounded-lg">
          Création d&apos;une catégorie Chariots par défaut...
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image *</label>
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Caractéristiques (une par ligne)
        </label>
        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          rows={4}
          placeholder={'Option A\nOption B\nOption C'}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ordre</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
          className="w-24 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        />
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={sold}
            onChange={(e) => setSold(e.target.checked)}
            className="w-5 h-5 text-[var(--accent)] border-gray-300 rounded focus:ring-[var(--accent)] focus:ring-2"
          />
          <span className="text-sm text-gray-700 font-medium">Marquer comme vendu</span>
        </label>
        {sold && (
          <p className="text-yellow-700 bg-yellow-50 border border-yellow-200 text-xs mt-2 px-3 py-2 rounded-lg">
            ⚠️ Ce chariot sera marqué comme vendu et affichera un badge "Vendu" sur l&apos;image
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || !chariotsCategoryId || categoriesLoading}
          className="bg-[var(--accent)] text-white px-6 py-2 font-semibold hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          {loading ? 'Enregistrement...' : categoriesLoading ? 'Chargement...' : 'Enregistrer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 text-gray-700 px-6 py-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Annuler
        </button>
      </div>
      {!chariotsCategoryId && !categoriesLoading && (
        <p className="text-gray-600 text-xs bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg">
          ⚠️ Aucune catégorie Chariots trouvée. Créez-en une dans{' '}
          <a href="/admin/categories" className="text-[var(--accent)] hover:underline font-medium">
            Catégories
          </a>
          {' '}ou attendez la création automatique.
        </p>
      )}
    </form>
  )
}
