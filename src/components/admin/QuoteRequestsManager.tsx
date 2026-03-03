'use client'

import { useState, useEffect } from 'react'

function getCustomDataValues(r: QuoteRequest): Record<string, string | null> {
  const legacy: Record<string, string | null> = {}
  if (r.chariotType) legacy.chariotType = r.chariotType
  if (r.heures) legacy.heures = r.heures
  if (r.capacite) legacy.capacite = r.capacite
  return { ...legacy, ...(r.customData || {}) }
}

function QuoteRequestDetail({
  request: r,
  formFields,
  onUpdate,
  statusOptions,
  statusStyles,
}: {
  request: QuoteRequest
  formFields: FormField[]
  onUpdate: (u: { customData?: Record<string, string | null> }) => void
  statusOptions: { value: string; label: string }[]
  statusStyles: Record<string, string>
}) {
  const [editing, setEditing] = useState(false)
  const values = getCustomDataValues(r)
  const initialEdited = Object.fromEntries(
    Object.entries(values).map(([k, v]) => [k, v != null ? String(v) : ''])
  )
  const [editedValues, setEditedValues] = useState<Record<string, string>>(initialEdited)

  const formKeys = formFields.map((f) => f.key)
  const valueKeys = Object.keys(values).filter((k) => values[k] != null)
  const keysToShow =
    formFields.length > 0
      ? [...new Set([...formKeys, ...valueKeys])]
      : valueKeys.length > 0
        ? valueKeys
        : ['chariotType', 'heures', 'capacite']
  const hasCustom = keysToShow.some((k) => values[k])

  function handleSave() {
    const customData: Record<string, string | null> = {}
    for (const k of keysToShow) {
      const v = editedValues[k]?.trim()
      customData[k] = v || null
    }
    onUpdate({ customData })
    setEditing(false)
  }

  function initEdit() {
    setEditedValues((prev) => {
      const next = { ...prev }
      for (const k of keysToShow) {
        next[k] = values[k] ?? ''
      }
      return next
    })
    setEditing(true)
  }

  return (
    <details className="border border-gray-200 p-4 bg-white rounded-lg">
      <summary className="cursor-pointer font-medium text-gray-900">
        {r.name} — {r.product || 'Demande générale'} ({new Date(r.createdAt).toLocaleDateString('fr-FR')})
      </summary>
      <div className="mt-4 space-y-2 text-sm">
        <p><strong>Email:</strong> <a href={`mailto:${r.email}`} className="text-[var(--accent)]">{r.email}</a></p>
        {r.phone && <p><strong>Téléphone:</strong> <a href={`tel:${r.phone}`} className="text-[var(--accent)]">{r.phone}</a></p>}
        {r.company && <p><strong>Société:</strong> {r.company}</p>}
        {r.product && <p><strong>Produit:</strong> {r.product}</p>}

        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <strong>Champs personnalisés</strong>
            {!editing ? (
              <button type="button" onClick={initEdit} className="text-xs text-[var(--accent)] hover:underline">
                Modifier
              </button>
            ) : (
              <div className="flex gap-2">
                <button type="button" onClick={handleSave} className="text-xs px-2 py-1 bg-[var(--accent)] text-white rounded">
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
          {editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {keysToShow.map((k) => {
                const field = formFields.find((f) => f.key === k)
                const label = field?.label ?? k
                return (
                  <div key={k}>
                    <label className="block text-xs text-gray-500">{label}</label>
                    <input
                      type="text"
                      value={editedValues[k] ?? ''}
                      onChange={(e) => setEditedValues((prev) => ({ ...prev, [k]: e.target.value }))}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-600">
              {keysToShow
                .map((k) => {
                  const v = values[k]
                  const label = formFields.find((f) => f.key === k)?.label ?? k
                  return v ? `${label}: ${v}` : null
                })
                .filter(Boolean)
                .join(' • ') || '-'}
            </p>
          )}
        </div>

        <p><strong>Message:</strong></p>
        <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded text-gray-700">{r.message}</p>
      </div>
    </details>
  )
}

interface FormField {
  id: string
  key: string
  label: string
  type: string
}

interface QuoteRequest {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  message: string
  product: string | null
  chariotType: string | null
  heures: string | null
  capacite: string | null
  customData: Record<string, string | null> | null
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

export function QuoteRequestsManager() {
  const [requests, setRequests] = useState<QuoteRequest[]>([])
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  async function fetchRequests() {
    try {
      const res = await fetch('/api/admin/quote-requests')
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
    fetch('/api/admin/form-fields')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setFormFields(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  async function updateRequest(
    id: string,
    updates: { status?: string; customData?: Record<string, string | null> }
  ) {
    try {
      const res = await fetch(`/api/admin/quote-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        const updated = await res.json()
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
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
          className={`px-4 py-2 text-sm font-medium rounded ${
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
            className={`px-4 py-2 text-sm font-medium rounded ${
              filter === o.value ? 'bg-[var(--accent)] text-[var(--foreground)]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {o.label} ({requests.filter((r) => r.status === o.value).length})
          </button>
        ))}
      </div>

      <div className="border border-gray-200 overflow-x-auto rounded-lg">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Date</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Nom</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Email</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Produit</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Statut</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Aucune demande de devis
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
                  <td className="p-3 font-medium text-gray-900">{r.name}</td>
                  <td className="p-3">
                    <a href={`mailto:${r.email}`} className="text-[var(--accent)] hover:underline text-sm">
                      {r.email}
                    </a>
                  </td>
                  <td className="p-3 text-sm text-gray-700 max-w-[180px] truncate" title={r.product || ''}>
                    {r.product || '-'}
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded ${STATUS_STYLES[r.status] || 'bg-gray-100'}`}>
                      {STATUS_OPTIONS.find((o) => o.value === r.status)?.label || r.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={r.status}
                      onChange={(e) => updateRequest(r.id, { status: e.target.value })}
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
          <h3 className="font-semibold text-gray-900">Détails des demandes</h3>
          {filtered.map((r) => (
            <QuoteRequestDetail
              key={r.id}
              request={r}
              formFields={formFields}
              onUpdate={(updates) => updateRequest(r.id, updates)}
              statusOptions={STATUS_OPTIONS}
              statusStyles={STATUS_STYLES}
            />
          ))}
        </div>
      )}
    </div>
  )
}
