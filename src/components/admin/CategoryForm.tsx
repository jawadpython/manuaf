'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
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
  const [type, setType] = useState(category?.type ?? 'chariots')
  const [parentId, setParentId] = useState(category?.parentId ?? '')
  const [order, setOrder] = useState(category?.order ?? 0)
  const [published, setPublished] = useState(category?.published ?? true)
  const [loading, setLoading] = useState(false)

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
      className="bg-[#141414] border border-white/10 p-6 space-y-6 max-w-2xl"
    >
      <h3 className="font-display text-xl text-white">
        {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
      </h3>

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
        <label className="block text-sm text-white/70 mb-2">Type *</label>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value)
            setParentId('') // Reset parent when type changes
          }}
          required
          disabled={!!category} // Can't change type when editing
          className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-2 text-white disabled:opacity-50"
        >
          <option value="chariots">Chariots</option>
          <option value="pieces">Pièces de rechange</option>
        </select>
        <p className="text-white/50 text-xs mt-1">
          {category ? 'Le type ne peut pas être modifié après création' : 'Choisissez le type de catégorie'}
        </p>
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-2 text-white"
        />
      </div>

      <div>
        <label className="block text-sm text-white/70 mb-2">Catégorie parente</label>
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-2 text-white"
        >
          {categoryOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {'  '.repeat(option.level)}
              {option.name}
            </option>
          ))}
        </select>
        <p className="text-white/50 text-xs mt-1">
          Laisser vide pour créer une catégorie principale (max 2 niveaux)
        </p>
      </div>

      <div className="flex gap-6">
        <div>
          <label className="block text-sm text-white/70 mb-2">Ordre</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
            className="w-24 bg-[#0a0a0a] border border-white/10 px-4 py-2 text-white"
          />
        </div>
        <div className="flex items-center gap-2 pt-8">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="published" className="text-sm text-white/70">
            Publié
          </label>
        </div>
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
