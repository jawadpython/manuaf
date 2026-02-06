'use client'

import { useState } from 'react'
import Image from 'next/image'
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
}: {
  initialChariots: Product[]
}) {
  const [chariots, setChariots] = useState(initialChariots)
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)

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
    fetch('/api/admin/chariots')
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
          onCancel={() => {
            setCreating(false)
            setEditing(null)
          }}
        />
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="p-4 text-gray-700 text-sm font-semibold">Image</th>
              <th className="p-4 text-gray-700 text-sm font-semibold">Nom</th>
              <th className="p-4 text-gray-700 text-sm font-semibold">Statut</th>
              <th className="p-4 text-gray-700 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {chariots.map((chariot) => (
              <tr
                key={chariot.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4">
                  <div className="relative w-20 h-20 bg-gray-100 border border-gray-200 overflow-hidden rounded-lg">
                    {chariot.image ? (
                      <Image
                        src={chariot.image}
                        alt={chariot.name}
                        fill
                        className="object-cover"
                        unoptimized={chariot.image.startsWith('http') || chariot.image.startsWith('/uploads')}
                      />
                    ) : (
                      <span className="text-gray-400 text-xs flex items-center justify-center h-full">Aucune image</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-gray-900 font-medium">{chariot.name}</td>
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
        {chariots.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Aucun chariot pour le moment
          </div>
        )}
      </div>
    </div>
  )
}
