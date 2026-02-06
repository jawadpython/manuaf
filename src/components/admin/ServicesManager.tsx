'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ServiceForm } from './ServiceForm'

interface Service {
  id: string
  name: string
  slug: string
  description: string
  category: string
  image: string | null
  features: string | null
  order: number
  published: boolean
}

export function ServicesManager({
  initialServices,
}: {
  initialServices: Service[]
}) {
  const [services, setServices] = useState(initialServices)
  const [editing, setEditing] = useState<Service | null>(null)
  const [creating, setCreating] = useState(false)

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce service ?')) return
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setServices((s) => s.filter((x) => x.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      alert('Erreur de connexion')
      console.error('Delete error:', error)
    }
  }

  function handleSaved(service: Service) {
    if (editing) {
      setServices((s) => s.map((x) => (x.id === service.id ? service : x)))
      setEditing(null)
    } else {
      setServices((s) => [...s, service])
      setCreating(false)
    }
    // Refresh the list to ensure consistency
    fetch('/api/admin/services')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data)
        }
      })
      .catch((err) => console.error('Error refreshing services:', err))
  }

  const categoryLabels: Record<string, string> = {
    maintenance: 'Maintenance',
    reconditionnement: 'Reconditionnement',
    location: 'Location',
  }

  return (
    <div className="space-y-8">
      <button
        type="button"
        onClick={() => setCreating(true)}
        className="bg-[var(--accent)] text-white px-6 py-2 font-semibold hover:bg-[var(--accent-hover)] transition-colors"
      >
        Nouveau service
      </button>

      {(creating || editing) && (
        <ServiceForm
          service={editing || undefined}
          onSave={handleSaved}
          onCancel={() => {
            setCreating(false)
            setEditing(null)
          }}
        />
      )}

      <div className="border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-4 text-white/60 text-sm font-medium">Image</th>
              <th className="p-4 text-white/60 text-sm font-medium">Nom</th>
              <th className="p-4 text-white/60 text-sm font-medium">Catégorie</th>
              <th className="p-4 text-white/60 text-sm font-medium">Statut</th>
              <th className="p-4 text-white/60 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr
                key={service.id}
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="p-4">
                  <div className="relative w-16 h-12 bg-[#1a1a1a] overflow-hidden">
                    {service.image ? (
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover"
                        unoptimized={service.image.startsWith('http')}
                      />
                    ) : (
                      <span className="text-white/30 text-xs flex items-center justify-center h-full">—</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-white">{service.name}</td>
                <td className="p-4 text-white/70">
                  {categoryLabels[service.category] || service.category}
                </td>
                <td className="p-4">
                  <span
                    className={`text-xs px-2 py-1 ${
                      service.published
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {service.published ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(service)}
                      className="text-[var(--accent)] text-sm hover:underline"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(service.id)}
                      className="text-red-400 text-sm hover:underline"
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
