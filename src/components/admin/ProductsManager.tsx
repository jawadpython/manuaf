'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { ProductForm } from './ProductForm'

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
}

export function ProductsManager({
  initialProducts,
}: {
  initialProducts: Product[]
}) {
  const [products, setProducts] = useState(initialProducts)
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [filter, setFilter] = useState('')

  const filteredProducts = useMemo(() => {
    if (!filter.trim()) return products
    const q = filter.trim().toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q) ||
        p.category?.parent?.name?.toLowerCase().includes(q)
    )
  }, [products, filter])

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce produit ?')) return
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts((p) => p.filter((x) => x.id !== id))
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
      setProducts((p) => p.map((x) => (x.id === product.id ? product : x)))
      setEditing(null)
    } else {
      setProducts((p) => [...p, product])
      setCreating(false)
    }
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data)
      })
      .catch((err) => console.error('Error refreshing products:', err))
  }

  return (
    <div className="space-y-6">
      {/* Toolbar: filter + primary action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <label htmlFor="product-filter" className="sr-only">
          Filtrer par nom ou catégorie
        </label>
        <input
          id="product-filter"
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filtrer par nom ou catégorie…"
          className="max-w-xs w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          aria-label="Filtrer par nom ou catégorie"
        />
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center justify-center bg-[var(--accent)] text-[var(--foreground)] px-6 py-2.5 font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] shrink-0"
        >
          Nouveau produit
        </button>
      </div>

      {(creating || editing) && (
        <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-sm">
          <ProductForm
            product={editing || undefined}
            onSave={handleSaved}
            onCancel={() => {
              setCreating(false)
              setEditing(null)
            }}
            categoryType="pieces"
          />
        </div>
      )}

      {/* Table card */}
      <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left" role="table">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background-alt)]">
                <th scope="col" className="p-4 text-[var(--foreground-muted)] text-sm font-semibold">
                  Image
                </th>
                <th scope="col" className="p-4 text-[var(--foreground-muted)] text-sm font-semibold">
                  Nom
                </th>
                <th scope="col" className="p-4 text-[var(--foreground-muted)] text-sm font-semibold">
                  Catégorie
                </th>
                <th scope="col" className="p-4 text-[var(--foreground-muted)] text-sm font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[var(--foreground-muted)]">
                    {filter.trim() ? 'Aucun produit ne correspond au filtre.' : 'Aucun produit.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--card-hover)] transition-colors"
                  >
                    <td className="p-4">
                      <div className="relative w-16 h-16 bg-[var(--background-alt)] border border-[var(--border)] rounded-lg overflow-hidden">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized={product.image.startsWith('http') || product.image.startsWith('/uploads')}
                          />
                        ) : (
                          <span className="text-[var(--foreground-subtle)] text-xs flex items-center justify-center h-full">
                            —
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-[var(--foreground)]">{product.name}</td>
                    <td className="p-4 text-[var(--foreground-muted)] text-sm">
                      {product.category?.parent
                        ? `${product.category.parent.name} › ${product.category.name}`
                        : product.category?.name || '—'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setEditing(product)}
                          className="text-sm font-medium text-[var(--accent)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className="text-sm font-medium text-red-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 rounded"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
