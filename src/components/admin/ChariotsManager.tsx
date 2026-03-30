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
  variant = 'chariots',
}: {
  initialChariots: Product[]
  /** Preselect category when creating (e.g. chariots-d-occasion, nacelles-de-location) */
  defaultCategorySlug?: string
  /** Même UI : chariots ou nacelles (API /api/admin/chariots | nacelles) */
  variant?: 'chariots' | 'nacelles'
}) {
  const adminApi = variant === 'nacelles' ? 'nacelles' : 'chariots'
  const productNoun = variant === 'nacelles' ? 'nacelle' : 'chariot'
  const showSoldColumn =
    variant === 'nacelles'
      ? defaultCategorySlug === 'nacelles-d-occasion'
      : defaultCategorySlug === 'chariots-d-occasion'
  const [chariots, setChariots] = useState(initialChariots)
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'order'>('order')
  const [ensuringDefaults, setEnsuringDefaults] = useState(false)

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

  async function handleEnsureLocationDefaults() {
    const isNacellesLoc = variant === 'nacelles' && defaultCategorySlug === 'nacelles-de-location'
    if (
      !confirm(
        isNacellesLoc
          ? 'Créer les sous-catégories et fiches manquantes pour les 3 types de nacelles (sans modifier les fiches existantes) ?'
          : 'Créer les fiches manquantes pour les 6 types de location (sans modifier les fiches existantes) ?'
      )
    )
      return
    setEnsuringDefaults(true)
    try {
      const ensureUrl = isNacellesLoc ? '/api/admin/nacelles/ensure-defaults' : '/api/admin/chariots/ensure-defaults'
      const res = await fetch(ensureUrl, { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        alert(data.error || 'Erreur')
        return
      }
      alert(
        data.created > 0
          ? `${data.created} fiche(s) créée(s).`
          : isNacellesLoc
            ? 'Les 3 fiches sont déjà présentes.'
            : 'Les 6 fiches sont déjà présentes.'
      )
      const url = defaultCategorySlug
        ? `/api/admin/${adminApi}?categorySlug=${encodeURIComponent(defaultCategorySlug)}`
        : `/api/admin/${adminApi}`
      const listRes = await fetch(url)
      const list = await listRes.json()
      if (Array.isArray(list)) setChariots(list)
    } catch (e) {
      console.error(e)
      alert('Erreur de connexion')
    } finally {
      setEnsuringDefaults(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(`Supprimer cette ${productNoun} ?`)) return
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
      ? `/api/admin/${adminApi}?categorySlug=${encodeURIComponent(defaultCategorySlug)}`
      : `/api/admin/${adminApi}`
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChariots(data)
        }
      })
      .catch((err) => console.error('Error refreshing list:', err))
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="bg-[var(--accent)] text-white px-6 py-2 font-semibold hover:bg-[var(--accent-hover)] transition-colors rounded-lg shadow-md hover:shadow-lg"
        >
          {variant === 'nacelles' ? 'Nouvelle nacelle' : 'Nouveau chariot'}
        </button>
        {((variant === 'chariots' && defaultCategorySlug === 'chariots-de-location') ||
          (variant === 'nacelles' && defaultCategorySlug === 'nacelles-de-location')) && (
          <button
            type="button"
            onClick={handleEnsureLocationDefaults}
            disabled={ensuringDefaults}
            className="border border-[var(--accent)] text-[var(--accent)] px-6 py-2 font-semibold hover:bg-[var(--accent)] hover:text-white transition-colors rounded-lg disabled:opacity-50"
          >
            {ensuringDefaults
              ? 'Patience…'
              : variant === 'nacelles'
                ? 'Ajouter les 3 types location (manquants)'
                : 'Ajouter les 6 types location (manquants)'}
          </button>
        )}
      </div>

      {(creating || editing) && (
        <ChariotsForm
          product={editing || undefined}
          onSave={handleSaved}
          defaultCategorySlug={defaultCategorySlug}
          categoryType={variant === 'nacelles' ? 'nacelles' : 'chariots'}
          showSoldOption={showSoldColumn}
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
              {showSoldColumn && (
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
                {showSoldColumn && (
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
            {variant === 'nacelles' ? 'Aucune nacelle pour le moment' : 'Aucun chariot pour le moment'}
          </div>
        )}
      </div>
    </div>
  )
}
