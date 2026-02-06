'use client'

import { useState } from 'react'
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
    // Refresh the list to ensure consistency
    fetch('/api/admin/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data)
        }
      })
      .catch((err) => console.error('Error refreshing products:', err))
  }

  return (
    <div className="space-y-8">
      <button
        type="button"
        onClick={() => setCreating(true)}
        className="bg-[var(--accent)] text-gray-900 px-6 py-2 font-semibold hover:bg-[var(--accent-hover)] transition-colors"
      >
        Nouveau produit
      </button>

      {(creating || editing) && (
        <ProductForm
          product={editing || undefined}
          onSave={handleSaved}
          onCancel={() => {
            setCreating(false)
            setEditing(null)
          }}
          categoryType="pieces"
        />
      )}

      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-4 text-gray-900/60 text-sm font-medium">Image</th>
              <th className="p-4 text-gray-900/60 text-sm font-medium">Nom</th>
              <th className="p-4 text-gray-900/60 text-sm font-medium">Catégorie</th>
              <th className="p-4 text-gray-900/60 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-4">
                  <div className="relative w-20 h-20 bg-[#1a1a1a] border border-gray-200 rounded-lg overflow-hidden shadow-sm rounded">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized={product.image.startsWith('http') || product.image.startsWith('/uploads')}
                      />
                    ) : (
                      <span className="text-gray-900/30 text-xs flex items-center justify-center h-full">Aucune image</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-gray-900">{product.name}</td>
                <td className="p-4 text-gray-900/70">
                  {product.category?.parent 
                    ? `${product.category.parent.name} > ${product.category.name}`
                    : product.category?.name || '—'}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(product)}
                      className="text-[var(--accent)] text-sm hover:underline"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
