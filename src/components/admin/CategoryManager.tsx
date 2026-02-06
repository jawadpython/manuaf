'use client'

import { useState } from 'react'
import { CategoryForm } from './CategoryForm'

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
  _count?: { products: number }
}

export function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[]
}) {
  const [categories, setCategories] = useState(initialCategories)
  const [editing, setEditing] = useState<Category | null>(null)
  const [creating, setCreating] = useState(false)

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette catégorie ?')) return
    
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    const data = await res.json()
    
    if (res.ok) {
      setCategories((c) => c.filter((x) => x.id !== id))
    } else {
      alert(data.error || 'Erreur lors de la suppression')
    }
  }

  function handleSaved(category: Category) {
    if (editing) {
      setCategories((c) => c.map((x) => (x.id === category.id ? category : x)))
      setEditing(null)
    } else {
      setCategories((c) => [...c, category])
      setCreating(false)
    }
    // Refresh to get updated hierarchy
    fetchCategories()
  }

  async function fetchCategories() {
    const res = await fetch('/api/admin/categories')
    if (res.ok) {
      const data = await res.json()
      setCategories(data)
    }
  }

  // Build hierarchical tree for display
  const buildTree = (cats: Category[]): Category[] => {
    const map = new Map<string, Category>()
    const roots: Category[] = []

    // Create map
    cats.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] })
    })

    // Build tree
    cats.forEach((cat) => {
      const node = map.get(cat.id)!
      if (cat.parentId && map.has(cat.parentId)) {
        const parent = map.get(cat.parentId)!
        if (!parent.children) parent.children = []
        parent.children.push(node)
      } else {
        roots.push(node)
      }
    })

    return roots.sort((a, b) => a.order - b.order)
  }

  // Separate categories by type
  const chariotsCategories = categories.filter(c => c.type === 'chariots')
  const piecesCategories = categories.filter(c => c.type === 'pieces')
  
  const chariotsTree = buildTree(chariotsCategories)
  const piecesTree = buildTree(piecesCategories)

  const renderCategory = (category: Category, level: number = 0): React.ReactNode => {
    return (
      <div key={category.id}>
        <tr className="border-b border-white/5 hover:bg-white/5">
          <td className="p-4">
            <div style={{ paddingLeft: `${level * 24}px` }} className="flex items-center gap-2">
              {level > 0 && (
                <span className="text-white/30">└─</span>
              )}
              <span className="text-white">{category.name}</span>
            </div>
          </td>
          <td className="p-4 text-white/70 text-sm">
            {category.parent?.name || '—'}
          </td>
          <td className="p-4 text-white/70 text-sm">
            {category.children?.length || 0}
          </td>
          <td className="p-4 text-white/70 text-sm">
            {category._count?.products || 0}
          </td>
          <td className="p-4">
            <span
              className={`text-xs px-2 py-1 ${
                category.published
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              {category.published ? 'Publié' : 'Brouillon'}
            </span>
          </td>
          <td className="p-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(category)}
                className="text-[var(--accent)] text-sm hover:underline"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={() => handleDelete(category.id)}
                className="text-red-400 text-sm hover:underline"
              >
                Supprimer
              </button>
            </div>
          </td>
        </tr>
        {category.children && category.children.map((child) => 
          renderCategory(child as Category, level + 1)
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="bg-[var(--accent)] text-white px-6 py-2 font-semibold hover:bg-[var(--accent-hover)] transition-colors"
        >
          Nouvelle catégorie
        </button>
      </div>

      {(creating || editing) && (
        <CategoryForm
          category={editing || undefined}
          categories={categories}
          onSave={handleSaved}
          onCancel={() => {
            setCreating(false)
            setEditing(null)
          }}
        />
      )}

      {/* Chariots Categories */}
      <div className="mb-8">
        <h2 className="text-xl text-white mb-4 font-display">Chariots</h2>
        <div className="border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-white/60 text-sm font-medium">Nom</th>
                <th className="p-4 text-white/60 text-sm font-medium">Parent</th>
                <th className="p-4 text-white/60 text-sm font-medium">Sous-catégories</th>
                <th className="p-4 text-white/60 text-sm font-medium">Produits</th>
                <th className="p-4 text-white/60 text-sm font-medium">Statut</th>
                <th className="p-4 text-white/60 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chariotsTree.length > 0 ? (
                chariotsTree.map((category) => renderCategory(category))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-white/50 text-center">
                    Aucune catégorie Chariots
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pièces de rechange Categories */}
      <div>
        <h2 className="text-xl text-white mb-4 font-display">Pièces de rechange</h2>
        <div className="border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-white/60 text-sm font-medium">Nom</th>
                <th className="p-4 text-white/60 text-sm font-medium">Parent</th>
                <th className="p-4 text-white/60 text-sm font-medium">Sous-catégories</th>
                <th className="p-4 text-white/60 text-sm font-medium">Produits</th>
                <th className="p-4 text-white/60 text-sm font-medium">Statut</th>
                <th className="p-4 text-white/60 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {piecesTree.length > 0 ? (
                piecesTree.map((category) => renderCategory(category))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-white/50 text-center">
                    Aucune catégorie Pièces de rechange
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
