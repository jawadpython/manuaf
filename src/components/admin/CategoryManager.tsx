'use client'

import { useState, useRef, useEffect } from 'react'
import { CategoryForm } from './CategoryForm'

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
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if ((creating || editing) && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [creating, editing])

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

  const renderCategory = (category: Category, level: number = 0): React.ReactNode[] => {
    const rows: React.ReactNode[] = [
      <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="p-4">
          <div style={{ paddingLeft: `${level * 24}px` }} className="flex items-center gap-2">
            {level > 0 && (
              <span className="text-gray-400">└─</span>
            )}
            <span className="text-gray-900 font-medium">{category.name}</span>
          </div>
        </td>
        <td className="p-4 text-gray-600 text-sm">
          {category.parent?.name || '—'}
        </td>
        <td className="p-4 text-gray-600 text-sm">
          {category.children?.length || 0}
        </td>
        <td className="p-4 text-gray-600 text-sm">
          {category._count?.products || 0}
        </td>
        <td className="p-4">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              category.published
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-gray-100 border border-gray-200 text-gray-600'
            }`}
          >
            {category.published ? 'Publié' : 'Brouillon'}
          </span>
        </td>
        <td className="p-4">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setEditing(category)}
              className="text-[var(--accent)] text-sm hover:text-[var(--accent-hover)] font-medium hover:underline"
            >
              Modifier
            </button>
            <button
              type="button"
              onClick={() => handleDelete(category.id)}
              className="text-red-600 text-sm hover:text-red-700 font-medium hover:underline"
            >
              Supprimer
            </button>
          </div>
        </td>
      </tr>
    ]

    // Add children rows recursively
    if (category.children && category.children.length > 0) {
      category.children.forEach((child) => {
        rows.push(...renderCategory(child as Category, level + 1))
      })
    }

    return rows
  }

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="bg-[var(--accent)] text-white px-6 py-2 font-semibold hover:bg-[var(--accent-hover)] transition-colors rounded-lg shadow-md hover:shadow-lg"
        >
          Nouvelle catégorie
        </button>
      </div>

      {(creating || editing) && (
        <div ref={formRef}>
          <CategoryForm
            key={editing?.id ?? 'new'}
            category={editing ?? undefined}
            categories={categories}
            onSave={handleSaved}
            onCancel={() => {
              setCreating(false)
              setEditing(null)
            }}
          />
        </div>
      )}

      {/* Chariots Categories */}
      <div className="mb-8">
        <h2 className="text-xl text-gray-900 mb-4 font-display">Chariots</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-4 text-gray-700 text-sm font-semibold">Nom</th>
                <th className="p-4 text-gray-700 text-sm font-semibold">Parent</th>
                <th className="p-4 text-gray-700 text-sm font-semibold">Sous-catégories</th>
                <th className="p-4 text-gray-700 text-sm font-semibold">Produits</th>
                <th className="p-4 text-gray-700 text-sm font-semibold">Statut</th>
                <th className="p-4 text-gray-700 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chariotsTree.length > 0 ? (
                chariotsTree.flatMap((category) => renderCategory(category))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-gray-500 text-center">
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
        <h2 className="text-xl text-gray-900 mb-4 font-display">Pièces de rechange</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="p-4 text-gray-700 text-sm font-semibold">Nom</th>
                <th className="p-4 text-gray-700 text-sm font-semibold">Parent</th>
                <th className="p-4 text-gray-700 text-sm font-semibold">Sous-catégories</th>
                <th className="p-4 text-gray-700 text-sm font-semibold">Produits</th>
                <th className="p-4 text-gray-700 text-sm font-semibold">Statut</th>
                <th className="p-4 text-gray-700 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {piecesTree.length > 0 ? (
                piecesTree.flatMap((category) => renderCategory(category))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-gray-500 text-center">
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
