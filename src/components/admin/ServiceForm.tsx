'use client'

import { useState } from 'react'

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

export function ServiceForm({
  service,
  onSave,
  onCancel,
}: {
  service?: Service
  onSave: (s: Service) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(service?.name ?? '')
  const [description, setDescription] = useState(service?.description ?? '')
  const [category, setCategory] = useState(service?.category ?? 'maintenance')
  const [image, setImage] = useState(service?.image ?? '')
  const [features, setFeatures] = useState(service?.features ?? '')
  const [order, setOrder] = useState(service?.order ?? 0)
  const [published, setPublished] = useState(service?.published ?? true)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('Veuillez sélectionner un fichier image')
      return
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setUploadError('Fichier trop volumineux (max 10MB)')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      
      if (res.ok && data.url) {
        setImage(data.url)
        setUploadError(null)
      } else {
        setUploadError(data.error || 'Erreur lors du téléchargement')
      }
    } catch (error) {
      setUploadError('Erreur de connexion lors du téléchargement')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const url = service
      ? `/api/admin/services/${service.id}`
      : '/api/admin/services'
    const method = service ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        category,
        image: image || null,
        features: features || null,
        order,
        published,
      }),
    })

    const saved = await res.json()
    if (res.ok) {
      onSave(saved)
      setError(null)
    } else {
      setError(saved.error || 'Erreur lors de l\'enregistrement')
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 p-6 space-y-6 max-w-2xl"
    >
      <h3 className="font-display text-xl text-gray-900">
        {service ? 'Modifier le service' : 'Nouveau service'}
      </h3>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-900/70 mb-2">Nom *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-white border border-gray-200 px-4 py-2 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-900/70 mb-2">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full bg-white border border-gray-200 px-4 py-2 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-900/70 mb-2">Catégorie *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full bg-white border border-gray-200 px-4 py-2 text-gray-900"
        >
          <option value="maintenance">Maintenance</option>
          <option value="reconditionnement">Reconditionnement</option>
          <option value="location">Location</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-900/70 mb-2">Image</label>
        <div className="flex gap-4 items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="text-gray-900/70 text-sm"
          />
          <input
            type="url"
            value={image}
            onChange={(e) => {
              setImage(e.target.value)
              setUploadError(null)
            }}
            placeholder="Ou URL"
            className="flex-1 bg-white border border-gray-200 px-4 py-2 text-gray-900"
          />
        </div>
        {uploading && (
          <p className="text-blue-400 text-xs mt-2">Téléchargement en cours...</p>
        )}
        {uploadError && (
          <p className="text-red-400 text-xs mt-2">{uploadError}</p>
        )}
        {image && !uploading && !uploadError && (
          <div className="mt-3">
            <p className="text-gray-900/50 text-xs mb-2 truncate max-w-md">{image}</p>
            <div className="relative w-32 h-32 bg-[#1a1a1a] border border-gray-200 overflow-hidden">
              <img
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setUploadError('Impossible de charger l\'image')}
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-900/70 mb-2">
          Caractéristiques (une par ligne ou séparées par |)
        </label>
        <textarea
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          rows={4}
          placeholder={'Option A|Option B|Option C'}
          className="w-full bg-white border border-gray-200 px-4 py-2 text-gray-900"
        />
      </div>

      <div className="flex gap-6">
        <div>
          <label className="block text-sm text-gray-900/70 mb-2">Ordre</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
            className="w-24 bg-white border border-gray-200 px-4 py-2 text-gray-900"
          />
        </div>
        <div className="flex items-center gap-2 pt-8">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="published" className="text-sm text-gray-900/70">
            Publié
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--accent)] text-gray-900 px-6 py-2 font-semibold hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 text-gray-900 px-6 py-2 hover:bg-gray-50"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
