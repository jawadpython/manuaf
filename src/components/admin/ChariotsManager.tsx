'use client'

import { useState, useMemo } from 'react'
import { ChariotsForm } from './ChariotsForm'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  categoryId: string
  category?: { id: string; name: string; slug: string; parent?: { id: string; name: string; slug: string } | null }
  image: string | null
  features: string | null
  order: number
  sold: boolean
}

export function ChariotsManager({
  initialChariots,
  defaultCategorySlug,
}: {
  initialChariots: Product[]
  /** Preselect category when creating (e.g. chariots-d-occasion, chariots-de-location) */
  defaultCategorySlug?: string
}) {
  const [chariots, setChariots] = useState(initialChariots)
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'order'>('order')

  const categoriesForFilter = useMemo(() => {
    const seen = new Map<string, string>()
    chariots.forEach((c) => {
      const cat = c.category
      if (cat) {
        const id = typeof cat === 'object' ? cat.id : ''
        const name = typeof cat === 'object' ? cat.name : String(cat)
        if (id && name && !seen.has(id)) seen.set(id, name)
      }
    })
    return Array.from(seen.entries()).sort((a, b) => a[1].localeCompare(b[1]))
  }, [chariots])

  const filteredAndSortedChariots = useMemo(() => {
    let list = chariots
    if (categoryFilter !== 'all') {
      list = list.filter((c) => {
        const cat = c.category
        const id = typeof cat === 'object' ? cat?.id : ''
        return id === categoryFilter
      })
    }
    return [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'category') {
        const na = typeof a.category === 'object' ? a.category?.name ?? '' : String(a.category ?? '')
        const nb = typeof b.category === 'object' ? b.category?.name ?? '' : String(b.category ?? '')
        return na.localeCompare(nb)
      }
      return a.order - b.order || a.name.localeCompare(b.name)
    })
  }, [chariots, categoryFilter, sortBy])

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce chariot ?')) return
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setChariots((c) => c.filter((x) => x.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      alert('Erreur de connexion')
      console.error('Delete error:', error)
    }
  }

  function handleSaved(product: Product) {
    if (editing) {
      setChariots((c) => c.map((x) => (x.id === product.id ? product : x)))
      setEditing(null)
    } else {
      setChariots((c) => [...c, product])
      setCreating(false)
    }
    // Refresh the list to ensure consistency
    const url = defaultCategorySlug
      ? `/api/admin/chariots?categorySlug=${encodeURIComponent(defaultCategorySlug)}`
      : '/api/admin/chariots'
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChariots(data)
        }
      })
      .catch((err) => console.error('Error refreshing chariots:', err))
  }

  return (
    <div className="space-y-8">
      <button
        type="button"
        onClick={() => setCreating(true)}
        className="bg-[var(--accent)] text-white px-6 py-2 font-semibold hover:bg-[var(--accent-hover)] transition-colors rounded-lg shadow-md hover:shadow-lg"
      >
        Nouveau chariot
      </button>

      {(creating || editing) && (
        <ChariotsForm
          product={editing || undefined}
          onSave={handleSaved}
          defaultCategorySlug={defaultCategorySlug}
          showSoldOption={defaultCategorySlug === 'chariots-d-occasion'}
          onCancel={() => {
            setCreating(false)
            setEditing(null)
          }}
        />
      )}

      <div className="flex flex-wrap gap-4 items-center mb-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <span>Catégorie :</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="all">Toutes</option>
            {categoriesForFilter.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <span>Trier par :</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'category' | 'order')}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="order">Ordre</option>
            <option value="name">Nom</option>
            <option value="category">Catégorie</option>
          </select>
        </label>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="p-4 text-gray-700 text-sm font-semibold">Image</th>
              <th className="p-4 text-gray-700 text-sm font-semibold">Nom</th>
              <th className="p-4 text-gray-700 text-sm font-semibold">Catégorie</th>
              {defaultCategorySlug === 'chariots-d-occasion' && (
                <th className="p-4 text-gray-700 text-sm font-semibold">Statut</th>
              )}
              <th className="p-4 text-gray-700 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedChariots.map((chariot) => (
              <tr
                key={chariot.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4">
                  <div className="relative w-20 h-20 bg-gray-100 border border-gray-200 overflow-hidden rounded-lg">
                    {(() => {
                      const urls = chariot.image ? chariot.image.split(/[|\r\n]+/).map((u) => u.trim()).filter(Boolean) : []
                      const thumb = urls[0]
                      return thumb ? (
                        <img
                          src={thumb}
                          alt={chariot.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs flex items-center justify-center h-full">Aucune image</span>
                      )
                    })()}
                  </div>
                </td>
                <td className="p-4 text-gray-900 font-medium">{chariot.name}</td>
                <td className="p-4 text-gray-600 text-sm">
                  {chariot.category?.name ?? '—'}
                </td>
                {defaultCategorySlug === 'chariots-d-occasion' && (
                  <td className="p-4">
                    {chariot.sold ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Vendu
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Disponible
                      </span>
                    )}
                  </td>
                )}
                <td className="p-4">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEditing(chariot)}
                      className="text-[var(--accent)] text-sm hover:text-[var(--accent-hover)] font-medium hover:underline"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(chariot.id)}
                      className="text-red-600 text-sm hover:text-red-700 font-medium hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAndSortedChariots.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Aucun chariot pour le moment
          </div>
        )}
      </div>
    </div>
  )
}
