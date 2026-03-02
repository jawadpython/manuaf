'use client'

import { useState, useEffect } from 'react'

interface RentalRequest {
  id: string
  chariot_type: string
  motorisation: string
  capacite_kg: number | null
  hauteur_m: number | null
  ville: string | null
  duree_location: string | null
  type_roues: string | null
  type_mat: string | null
  notes: string | null
  client_name: string
  client_phone: string
  status: string
  createdAt: string
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nouveau' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'quoted', label: 'Devis envoyé' },
  { value: 'closed', label: 'Clôturé' },
]

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-700',
  in_progress: 'bg-amber-500/20 text-amber-700',
  quoted: 'bg-green-500/20 text-green-700',
  closed: 'bg-gray-500/20 text-gray-600',
}

export function RentalRequestsManager() {
  const [requests, setRequests] = useState<RentalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  async function fetchRequests() {
    try {
      const res = await fetch('/api/admin/rental-requests')
      if (res.ok) {
        const data = await res.json()
        setRequests(data)
      }
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/rental-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        )
      } else {
        const data = await res.json()
        alert(data.error || 'Erreur')
      }
    } catch {
      alert('Erreur de connexion')
    }
  }

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter)

  if (loading) {
    return <p className="text-[var(--foreground-muted)]">Chargement...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium ${
            filter === 'all' ? 'bg-[var(--accent)] text-[var(--foreground)]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tous ({requests.length})
        </button>
        {STATUS_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setFilter(o.value)}
            className={`px-4 py-2 text-sm font-medium ${
              filter === o.value ? 'bg-[var(--accent)] text-[var(--foreground)]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {o.label} ({requests.filter((r) => r.status === o.value).length})
          </button>
        ))}
      </div>

      <div className="border border-gray-200 overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Date</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Client</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Téléphone</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Type</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Motorisation</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Statut</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Aucune demande
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 text-sm text-gray-700">
                    {new Date(r.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="p-3 font-medium text-gray-900">{r.client_name}</td>
                  <td className="p-3">
                    <a href={`tel:${r.client_phone}`} className="text-[var(--accent)] hover:underline">
                      {r.client_phone}
                    </a>
                  </td>
                  <td className="p-3 text-sm text-gray-700">{r.chariot_type}</td>
                  <td className="p-3 text-sm text-gray-700 capitalize">{r.motorisation}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 ${STATUS_STYLES[r.status] || 'bg-gray-100'}`}>
                      {STATUS_OPTIONS.find((o) => o.value === r.status)?.label || r.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Détails</h3>
          {filtered.map((r) => (
            <details key={r.id} className="border border-gray-200 p-4 bg-white">
              <summary className="cursor-pointer font-medium text-gray-900">
                {r.client_name} — {r.chariot_type} ({new Date(r.createdAt).toLocaleDateString('fr-FR')})
              </summary>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <p><strong>Capacité:</strong> {r.capacite_kg ?? '-'} kg</p>
                <p><strong>Hauteur:</strong> {r.hauteur_m ?? '-'} m</p>
                <p><strong>Ville:</strong> {r.ville ?? '-'}</p>
                <p><strong>Durée:</strong> {r.duree_location ?? '-'}</p>
                <p><strong>Type roues:</strong> {r.type_roues ?? '-'}</p>
                <p><strong>Type mât:</strong> {r.type_mat ?? '-'}</p>
                {r.notes && (
                  <p className="sm:col-span-2"><strong>Notes:</strong> {r.notes}</p>
                )}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
