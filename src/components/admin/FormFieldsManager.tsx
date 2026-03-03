'use client'

import { useState, useEffect } from 'react'

interface FormField {
  id: string
  key: string
  label: string
  type: string
  required: boolean
  sortOrder: number
  showFor: string | null
  placeholder: string | null
  options: { value: string; label: string }[] | null
  active: boolean
}

const FIELD_TYPES = [
  { value: 'text', label: 'Texte' },
  { value: 'number', label: 'Nombre' },
  { value: 'select', label: 'Liste déroulante' },
  { value: 'textarea', label: 'Zone de texte' },
] as const

// Form fields are for Chariots de location only (occasion = client info only)
const SHOW_FOR_OPTIONS = [
  { value: 'chariots-location', label: 'Chariots de location' },
] as const

export function FormFieldsManager() {
  const [fields, setFields] = useState<FormField[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<FormField | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchFields() {
    try {
      const res = await fetch('/api/admin/form-fields')
      if (res.ok) {
        const data = await res.json()
        setFields(data)
      }
    } catch (err) {
      console.error(err)
      setError('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFields()
  }, [])

  async function createField(data: Partial<FormField>) {
    setError(null)
    try {
      const res = await fetch('/api/admin/form-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (res.ok) {
        setFields((prev) => [...prev, result].sort((a, b) => a.sortOrder - b.sortOrder))
        setCreating(false)
      } else {
        setError(result.error || 'Erreur')
      }
    } catch {
      setError('Erreur de connexion')
    }
  }

  async function updateField(id: string, data: Partial<FormField>) {
    setError(null)
    try {
      const res = await fetch(`/api/admin/form-fields/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (res.ok) {
        setFields((prev) =>
          prev.map((f) => (f.id === id ? { ...f, ...result } : f)).sort((a, b) => a.sortOrder - b.sortOrder)
        )
        setEditing(null)
      } else {
        setError(result.error || 'Erreur')
      }
    } catch {
      setError('Erreur de connexion')
    }
  }

  async function deleteField(id: string) {
    if (!confirm('Supprimer ce champ ?')) return
    setError(null)
    try {
      const res = await fetch(`/api/admin/form-fields/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setFields((prev) => prev.filter((f) => f.id !== id))
      } else {
        const data = await res.json()
        setError(data.error || 'Erreur')
      }
    } catch {
      setError('Erreur de connexion')
    }
  }

  async function moveField(id: string, direction: 'up' | 'down') {
    const idx = fields.findIndex((f) => f.id === id)
    if (idx < 0) return
    const newIdx = direction === 'up' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= fields.length) return
    const swapped = fields[newIdx]
    setError(null)
    try {
      await fetch(`/api/admin/form-fields/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: swapped.sortOrder }),
      })
      await fetch(`/api/admin/form-fields/${swapped.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: fields[idx].sortOrder }),
      })
      await fetchFields()
    } catch {
      setError('Erreur lors du déplacement')
    }
  }

  if (loading) return <p className="text-gray-600">Chargement...</p>

  return (
    <div className="space-y-6">
      <div className="p-4 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-lg">
        <p className="text-gray-700 text-sm font-medium">
          Ces champs s&apos;affichent uniquement dans le formulaire devis pour <strong>Chariots de location</strong>. Les Chariots d&apos;occasion n&apos;affichent que les coordonnées (nom, email, etc.).
        </p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-gray-600 text-sm">
          Ajoutez, modifiez ou supprimez les champs du formulaire location.
        </p>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:opacity-90"
        >
          + Ajouter un champ
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      {creating && (
        <FormFieldForm
          onSave={(data) => createField(data)}
          onCancel={() => setCreating(false)}
          showForOptions={SHOW_FOR_OPTIONS}
          fieldTypes={FIELD_TYPES}
        />
      )}

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Ordre</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Clé</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Label</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Type</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Affiché pour</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Actif</th>
              <th className="p-3 text-gray-600 text-xs font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fields.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Aucun champ. Cliquez sur &quot;Ajouter un champ&quot; pour commencer.
                </td>
              </tr>
            ) : (
              fields.map((field) => (
                <tr key={field.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {editing?.id === field.id ? (
                    <td colSpan={7} className="p-4 bg-gray-50">
                      <FormFieldForm
                        field={field}
                        onSave={(data) => updateField(field.id, data)}
                        onCancel={() => setEditing(null)}
                        showForOptions={SHOW_FOR_OPTIONS}
                        fieldTypes={FIELD_TYPES}
                      />
                    </td>
                  ) : (
                    <>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveField(field.id, 'up')}
                            className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-30"
                            disabled={fields.indexOf(field) === 0}
                            title="Monter"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveField(field.id, 'down')}
                            className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-30"
                            disabled={fields.indexOf(field) === fields.length - 1}
                            title="Descendre"
                          >
                            ↓
                          </button>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-sm">{field.key}</td>
                      <td className="p-3 font-medium">{field.label}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {FIELD_TYPES.find((t) => t.value === field.type)?.label ?? field.type}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {SHOW_FOR_OPTIONS.find((o) => o.value === field.showFor)?.label ?? field.showFor ?? 'Chariots de location'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            field.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {field.active ? 'Oui' : 'Non'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditing(field)}
                            className="text-sm text-[var(--accent)] hover:underline"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteField(field.id)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FormFieldForm({
  field,
  onSave,
  onCancel,
  showForOptions,
  fieldTypes,
}: {
  field?: FormField
  onSave: (data: Partial<FormField>) => void
  onCancel: () => void
  showForOptions: readonly { value: string; label: string }[]
  fieldTypes: readonly { value: string; label: string }[]
}) {
  const [key, setKey] = useState(field?.key ?? '')
  const [label, setLabel] = useState(field?.label ?? '')
  const [type, setType] = useState(field?.type ?? 'text')
  const [required, setRequired] = useState(field?.required ?? false)
  const [showFor, setShowFor] = useState(field?.showFor ?? 'chariots-location')
  const [placeholder, setPlaceholder] = useState(field?.placeholder ?? '')
  const [optionsStr, setOptionsStr] = useState(
    field?.options ? field.options.map((o) => `${o.value}:${o.label}`).join('\n') : ''
  )
  const [active, setActive] = useState(field?.active ?? true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const options =
      type === 'select' && optionsStr.trim()
        ? optionsStr
            .split('\n')
            .map((line) => {
              const [value, label] = line.split(':').map((s) => s.trim())
              return value && label ? { value, label } : null
            })
            .filter(Boolean) as { value: string; label: string }[]
        : null

    onSave({
      key: key.trim() || undefined,
      label: label.trim() || undefined,
      type: type as FormField['type'],
      required,
      showFor: showFor || 'chariots-location',
      placeholder: placeholder.trim() || null,
      options,
      active,
    })
  }

  const inputClass =
    'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]'

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Clé (identifiant unique)</label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value.replace(/\s/g, '_').toLowerCase())}
            className={inputClass}
            placeholder="ex: type_chariot"
            required
            disabled={!!field}
          />
          {field && <p className="text-xs text-gray-500 mt-1">La clé ne peut pas être modifiée</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Label (affiché au client)</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={inputClass}
            placeholder="Ex: Type de chariot"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
            {fieldTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Contexte</label>
          <select value={showFor || 'chariots-location'} onChange={(e) => setShowFor(e.target.value)} className={inputClass}>
            {showForOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Placeholder</label>
        <input
          type="text"
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
          className={inputClass}
          placeholder="Texte d'exemple dans le champ"
        />
      </div>
      {type === 'select' && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Options (une par ligne, format: valeur:label)
          </label>
          <textarea
            value={optionsStr}
            onChange={(e) => setOptionsStr(e.target.value)}
            className={inputClass + ' font-mono text-xs'}
            rows={4}
            placeholder="electrique:Électrique&#10;thermique:Thermique"
          />
        </div>
      )}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
            className="w-4 h-4 text-[var(--accent)]"
          />
          <span className="text-sm">Obligatoire</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-4 h-4 text-[var(--accent)]"
          />
          <span className="text-sm">Actif</span>
        </label>
      </div>
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded hover:opacity-90"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
