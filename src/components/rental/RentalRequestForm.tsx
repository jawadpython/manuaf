'use client'

import { useState } from 'react'

const MOTORISATION_OPTIONS = [
  { value: 'electrique', label: 'Électrique' },
  { value: 'thermique', label: 'Thermique' },
]

type Props = {
  defaultChariotType?: string
  onSuccess?: () => void
}

export function RentalRequestForm({ defaultChariotType = '', onSuccess }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const formData = new FormData(form)

    const payload = {
      chariot_type: formData.get('chariot_type') as string,
      motorisation: formData.get('motorisation') as string,
      capacite_kg: formData.get('capacite_kg') ? parseInt(formData.get('capacite_kg') as string, 10) : null,
      hauteur_m: formData.get('hauteur_m') ? parseFloat(formData.get('hauteur_m') as string) : null,
      ville: (formData.get('ville') as string) || null,
      duree_location: (formData.get('duree_location') as string) || null,
      notes: (formData.get('notes') as string) || null,
      client_name: formData.get('client_name') as string,
      client_phone: formData.get('client_phone') as string,
    }

    try {
      const res = await fetch('/api/rental-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus('success')
        form.reset()
        onSuccess?.()
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Erreur d\'envoi. Réessayez.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Erreur de connexion. Réessayez.')
    }
  }

  const inputClass =
    'w-full bg-[var(--background-muted)] border border-[var(--border)] text-[var(--foreground)] px-3 py-2 text-sm rounded-[var(--radius-md)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-[var(--transition-base)]'
  const labelClass = 'block text-xs text-[var(--foreground-subtle)] font-medium uppercase tracking-wider mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="hidden" name="chariot_type" value={defaultChariotType} />

      {defaultChariotType && (
        <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--background-muted)] border border-[var(--border-strong)]">
          <p className="text-sm text-[var(--foreground-muted)]">
            <strong className="text-[var(--foreground)]">Type sélectionné :</strong>{' '}
            {defaultChariotType.replace(/-/g, ' ')}
          </p>
        </div>
      )}

      <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
        Coordonnées
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="client_name" className={labelClass}>
            Nom complet *
          </label>
          <input
            id="client_name"
            name="client_name"
            type="text"
            required
            maxLength={200}
            className={inputClass}
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label htmlFor="client_phone" className={labelClass}>
            Téléphone *
          </label>
          <input
            id="client_phone"
            name="client_phone"
            type="tel"
            required
            maxLength={30}
            className={inputClass}
            placeholder="+212 6XX XXX XXX"
          />
        </div>
      </div>

      <div className="pt-3 border-t border-[var(--border)] space-y-3">
        <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
          Caractéristiques
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="motorisation" className={labelClass}>
              Motorisation *
            </label>
        <select id="motorisation" name="motorisation" required className={inputClass + ' appearance-none cursor-pointer'}>
          <option value="">Sélectionnez</option>
          {MOTORISATION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
          </div>
          <div>
            <label htmlFor="capacite_kg" className={labelClass}>
              Capacité (kg)
            </label>
          <input
            id="capacite_kg"
            name="capacite_kg"
            type="number"
            min={0}
            max={10000}
            step={100}
            className={inputClass}
            placeholder="Ex: 2500"
          />
          </div>
          <div>
            <label htmlFor="hauteur_m" className={labelClass}>
              Hauteur (m)
            </label>
          <input
            id="hauteur_m"
            name="hauteur_m"
            type="number"
            min={0}
            max={20}
            step={0.1}
            className={inputClass}
            placeholder="Ex: 3.5"
          />
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[var(--border)] space-y-3">
        <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
          Location
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="ville" className={labelClass}>
              Ville *
            </label>
          <input
            id="ville"
            name="ville"
            type="text"
            required
            maxLength={100}
            className={inputClass}
            placeholder="Ex: Casablanca, Rabat..."
          />
          </div>
          <div>
            <label htmlFor="duree_location" className={labelClass}>
              Durée de location *
            </label>
        <input
          id="duree_location"
          name="duree_location"
          type="text"
          required
          maxLength={100}
          className={inputClass}
          placeholder="Ex: 1 mois, 3 semaines, 6 mois..."
        />
          </div>
        </div>
        <div>
          <label htmlFor="notes" className={labelClass}>
          Notes / Commentaires
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          maxLength={2000}
          className={inputClass + ' resize-none'}
          placeholder="Précisez vos besoins..."
        />
        </div>
      </div>

      {status === 'success' && (
        <div className="p-3 rounded-[var(--radius-md)] bg-emerald-50 border border-emerald-200">
          <p className="text-sm text-emerald-800">
            Demande envoyée. Nous vous recontacterons rapidement.
          </p>
        </div>
      )}
      {status === 'error' && (
        <div className="p-3 rounded-[var(--radius-md)] bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full sm:w-auto px-6 py-2.5 bg-[var(--grey)] text-white font-semibold text-sm uppercase tracking-wider rounded-[var(--radius-md)] hover:bg-[var(--grey-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 transition-[var(--transition-base)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Envoi en cours...' : 'Envoyer la demande'}
      </button>
    </form>
  )
}
