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
  defaultCategorySlug,
  showSoldOption = false,
}: {
  product?: Product
  onSave: (p: Product) => void
  onCancel: () => void
  /** Preselect category when creating (e.g. chariots-d-occasion, chariots-de-location) */
  defaultCategorySlug?: string
  /** Show "Marquer comme vendu" only for Chariots d'occasion */
  showSoldOption?: boolean
}) {
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [images, setImages] = useState<string[]>(
    product?.image ? product.image.split(/[|\r\n]+/).map((u) => u.trim()).filter(Boolean) : []
  )
  const [features, setFeatures] = useState(product?.features ?? '')
  const [order, setOrder] = useState(product?.order ?? 0)
  const [sold, setSold] = useState(showSoldOption ? (product?.sold ?? false) : false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [chariotsCategoryId, setChariotsCategoryId] = useState<string>('')
  const [chariotsCategories, setChariotsCategories] = useState<Array<{ id: string; name: string; slug: string; parentId?: string | null; parent?: { slug: string } | null; children?: unknown[] }>>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [noCategories, setNoCategories] = useState(false)

  async function createDefaultChariotsCategories() {
    try {
      const toCreate = [
        { name: 'Chariots de location', type: 'chariots' as const, description: 'Chariots disponibles à la location' },
        { name: "Chariots d'occasion", type: 'chariots' as const, description: "Chariots d'occasion reconditionnés" },
      ]
      const created: Array<{ id: string; name: string; slug: string }> = []
      for (const cat of toCreate) {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...cat, published: true }),
        })
        const data = await res.json()
        if (res.ok && data.id) {
          created.push({ id: data.id, name: data.name, slug: data.slug })
        }
      }
      if (created.length > 0) {
        setChariotsCategories((prev) => [...prev, ...created])
        setChariotsCategoryId(created[0].id)
        setNoCategories(false)
      } else {
        setError('Impossible de créer les catégories. Créez « Chariots de location » et « Chariots d\'occasion » dans Catégories.')
      }
    } catch (error) {
      console.error('Error creating default categories:', error)
      setError('Impossible de créer les catégories. Créez-les dans la section Catégories.')
    } finally {
      setCategoriesLoading(false)
    }
  }

  useEffect(() => {
    setCategoriesLoading(true)
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        const chariotsCats = data.filter((cat: { type?: string }) => cat.type === 'chariots')
        if (chariotsCats.length > 0) {
          const main = chariotsCats.filter((c: { parentId?: string | null }) => !c.parentId).sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name))
          // Only subcategories (children) - "Chariots d'occasion" and "Chariots de location" are page types, not categories
          const mainCat = main.find((m: { slug: string }) => m.slug === defaultCategorySlug)
          const subcatsOnly = defaultCategorySlug
            ? chariotsCats.filter((c: { parentId?: string | null }) => c.parentId === mainCat?.id).sort((a: { order?: number }, b: { order?: number }) => (a.order ?? 0) - (b.order ?? 0))
            : []
          let withChildren = subcatsOnly.length > 0
            ? subcatsOnly
            : mainCat ? [mainCat] : []
          // When editing, include main if product is assigned to it (so we can display current value)
          if (product?.categoryId && mainCat && product.categoryId === mainCat.id && !withChildren.find((c: { id: string }) => c.id === mainCat.id)) {
            withChildren = [mainCat, ...withChildren]
          }
          setChariotsCategories(withChildren)
          const defaultCategory = product?.categoryId && withChildren.find((c: { id: string }) => c.id === product.categoryId)
            ? product.categoryId
            : subcatsOnly.length === 0 && mainCat
            ? mainCat.id
            : withChildren[0]?.id ?? ''
          setChariotsCategoryId(defaultCategory)
          setNoCategories(false)
        } else {
          setNoCategories(true)
          createDefaultChariotsCategories()
          return
        }
        setCategoriesLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching categories:', err)
        setNoCategories(true)
        setCategoriesLoading(false)
      })
  }, [product?.categoryId, defaultCategorySlug])

  useEffect(() => {
    if (product) {
      setImages(product.image ? product.image.split(/[|\r\n]+/).map((u) => u.trim()).filter(Boolean) : [])
    }
  }, [product?.id, product?.image])

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
        image: images.length > 0 ? images.join('|') : null,
        features: features || null,
        order,
        sold: showSoldOption ? sold : false,
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
          Création des catégories Chariots de location et Chariots d&apos;occasion...
        </div>
      )}

      {chariotsCategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Choisir une catégorie *</label>
          <select
            value={chariotsCategoryId}
            onChange={(e) => setChariotsCategoryId(e.target.value)}
            required
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          >
            <option value="">Choisir une catégorie</option>
            {chariotsCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.parentId ? cat.name : `${cat.name} (par défaut)`}
              </option>
            ))}
          </select>
          <p className="text-gray-500 text-xs mt-1">
            La catégorie détermine où ce chariot sera affiché.
          </p>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Images (galerie produit)</label>
        <p className="text-xs text-gray-600 mb-2">Vous pouvez ajouter plusieurs images. La première sera affichée en principal.</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="cursor-pointer">
              <span className="inline-block px-4 py-2 bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors rounded-lg shadow-md hover:shadow-lg">
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
            <p className="text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {uploadError}
            </p>
          )}
          {images.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-gray-600 text-xs font-medium">{images.length} image(s) — la première sera affichée en principal</p>
              <div className="flex flex-wrap gap-3 max-h-64 overflow-y-auto p-1">
                {images.map((url, i) => (
                  <div key={i} className="relative group flex-shrink-0">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 border border-gray-300 overflow-hidden rounded-lg shrink-0">
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Caractéristiques techniques (format: Libellé: valeur — une par ligne)
        </label>
        <div className="flex gap-2 mb-1">
          <button
            type="button"
            onClick={() => {
              const template = `Année:
Heures de fonctionnement:
Modèle:
Capacité:
Mât:
Hauteur:
Levée verticale:
Levée libre:
Chariot de fourche:
Entraînement:
Soupapes additionnelles:
Attachments:
Pneus avant:
Pneus arrière:
État:`
              setFeatures((prev) => (prev.trim() ? prev : template))
            }}
            className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300"
          >
            Remplir le modèle vide
          </button>
        </div>
        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          rows={18}
          placeholder="Année: 2016 | Heures: 1 410 h | Modèle: 8FBMT30 | etc."
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent font-mono text-sm"
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

      {showSoldOption && (
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
              ⚠️ Ce chariot sera marqué comme vendu et affichera un badge &quot;Vendu&quot; sur l&apos;image
            </p>
          )}
        </div>
      )}

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
