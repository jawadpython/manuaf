'use client'

import { useState } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  type: string // 'chariots' | 'pieces'
  parentId: string | null
  parent?: { id: string; name: string; slug: string } | null
  children?: Array<{ id: string; name: string; slug: string }>
  order: number
  published: boolean
}

interface CategoryOption {
  id: string
  name: string
  level: number
}

export function CategoryForm({
  category,
  categories,
  onSave,
  onCancel,
}: {
  category?: Category
  categories: Category[]
  onSave: (c: Category) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(category?.name ?? '')
  const [description, setDescription] = useState(category?.description ?? '')
  const [image, setImage] = useState(category?.image ?? '')
  const [type, setType] = useState(category?.type ?? 'chariots')
  const [parentId, setParentId] = useState(category?.parentId ?? '')
  const [order, setOrder] = useState(category?.order ?? 0)
  const [published, setPublished] = useState(category?.published ?? true)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Build hierarchical category options (exclude self and children from parent options)
  const getCategoryOptions = (): CategoryOption[] => {
    const options: CategoryOption[] = []
    
    // Add "None" option for root categories
    options.push({ id: '', name: 'Aucune (catégorie principale)', level: 0 })

    const addCategories = (cats: Category[], level: number, excludeIds: string[] = []) => {
      cats.forEach((cat) => {
        if (excludeIds.includes(cat.id)) return
        // Only show categories of the same type
        if (cat.type !== type) return
        
        options.push({ id: cat.id, name: cat.name, level })
        
        if (cat.children && cat.children.length > 0) {
          addCategories(cat.children as Category[], level + 1, excludeIds)
        }
      })
    }

    // Get root categories (no parent) of the same type
    const rootCategories = categories.filter((c) => !c.parentId && c.type === type)
    
    // If editing, exclude self and all children from parent options
    const excludeIds = category
      ? [category.id, ...(category.children?.map((c) => c.id) || [])]
      : []

    addCategories(rootCategories, 0, excludeIds)

    return options
  }

  const categoryOptions = getCategoryOptions()

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
    e.target.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const url = category
      ? `/api/admin/categories/${category.id}`
      : '/api/admin/categories'
    const method = category ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description: description || null,
        image: image || null,
        type,
        parentId: parentId || null,
        order,
        published,
      }),
    })

    const saved = await res.json()
    if (res.ok) {
      onSave(saved)
    } else {
      alert(saved.error || 'Erreur lors de l\'enregistrement')
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 space-y-6 max-w-2xl"
    >
      <h3 className="font-display text-base text-gray-900">
        {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
      </h3>

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
        <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value)
            setParentId('') // Reset parent when type changes
          }}
          required
          disabled={!!category} // Can't change type when editing
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
        >
          <option value="chariots">Chariots</option>
          <option value="nacelles">Nacelles</option>
          <option value="pieces">Pièces de rechange</option>
        </select>
        <p className="text-gray-500 text-xs mt-1">
          {category ? 'Le type ne peut pas être modifié après création' : 'Choisissez le type de catégorie'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer">
            <span className="inline-block px-4 py-2 bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors rounded-lg shadow-md hover:shadow-lg">
              {image ? "Changer l'image" : 'Télécharger une image'}
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
          <p className="text-red-600 text-xs bg-red-50 border border-red-200 px-3 py-2 rounded-lg mt-2">
            {uploadError}
          </p>
        )}
        {image && !uploading && !uploadError && (
          <div className="mt-3 space-y-2">
            <p className="text-gray-600 text-xs font-medium">Aperçu:</p>
            <div className="flex items-start gap-3">
              <div className="relative w-32 h-24 bg-gray-100 border border-gray-300 overflow-hidden rounded-lg flex-shrink-0">
                <img
                  src={image}
                  alt="Aperçu"
                  className="w-full h-full object-contain"
                  onError={() => setUploadError("Impossible de charger l'image")}
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
                Supprimer l&apos;image
              </button>
            </div>
          </div>
        )}
        <p className="text-gray-500 text-xs mt-1">
          Image affichée dans le mega-menu pour les catégories principales
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie parente</label>
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
        >
          {categoryOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {'  '.repeat(option.level)}
              {option.name}
            </option>
          ))}
        </select>
        <p className="text-gray-500 text-xs mt-1">
          Laisser vide pour créer une catégorie principale (max 2 niveaux)
        </p>
      </div>

      <div className="flex gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ordre</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
            className="w-24 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 pt-8">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 text-[var(--accent)] border-gray-300 rounded focus:ring-[var(--accent)]"
          />
          <label htmlFor="published" className="text-sm text-gray-700 font-medium">
            Publié
          </label>
        </div>
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
