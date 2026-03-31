'use client'

import { useState } from 'react'

type Props = {
  defaultChariotType?: string
  onSuccess?: () => void
  /** Tighter labels/inputs (sidebar on dense catalog pages e.g. transpalette-manuel) */
  compact?: boolean
}

export function RentalRequestForm({ defaultChariotType = '', onSuccess, compact = false }: Props) {
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

  const inputClass = compact
    ? 'w-full bg-[var(--background-muted)] border border-[var(--border)] text-[var(--foreground)] px-2 py-1.5 text-[11px] leading-snug rounded-[var(--radius-md)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-[var(--transition-base)]'
    : 'w-full bg-[var(--background-muted)] border border-[var(--border)] text-[var(--foreground)] px-2.5 py-1.5 text-xs leading-snug rounded-[var(--radius-md)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-[var(--transition-base)]'
  const labelClass = compact
    ? 'block text-[9px] text-[var(--foreground-subtle)] font-medium uppercase tracking-wide mb-0.5'
    : 'block text-[11px] text-[var(--foreground-subtle)] font-medium uppercase tracking-wide mb-0.5'
  const sectionHeadingClass = compact
    ? 'text-[9px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wide'
    : 'text-[11px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wide'

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-2.5' : 'space-y-3'}>
      <input type="hidden" name="chariot_type" value={defaultChariotType} />

      {defaultChariotType && (
        <div
          className={`rounded-[var(--radius-md)] bg-[var(--background-muted)] border border-[var(--border-strong)] ${
            compact ? 'p-2' : 'p-2.5'
          }`}
        >
          <p className={compact ? 'text-[11px] text-[var(--foreground-muted)] leading-snug break-words' : 'text-xs text-[var(--foreground-muted)]'}>
            <strong className="text-[var(--foreground)]">Type sélectionné :</strong>{' '}
            {defaultChariotType.replace(/-/g, ' ')}
          </p>
        </div>
      )}

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

      <div className={`${compact ? 'pt-2' : 'pt-3'} border-t border-[var(--border)] ${compact ? 'space-y-2.5' : 'space-y-3'}`}>
        <h3 className={sectionHeadingClass}>Location</h3>
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
        <div className={`rounded-[var(--radius-md)] bg-emerald-50 border border-emerald-200 ${compact ? 'p-2' : 'p-3'}`}>
          <p className={compact ? 'text-xs text-emerald-800' : 'text-sm text-emerald-800'}>
            Demande envoyée. Nous vous recontacterons rapidement.
          </p>
        </div>
      )}
      {status === 'error' && (
        <div className={`rounded-[var(--radius-md)] bg-red-50 border border-red-200 ${compact ? 'p-2' : 'p-3'}`}>
          <p className={compact ? 'text-xs text-red-700' : 'text-sm text-red-700'}>{errorMsg}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className={
          compact
            ? 'w-full px-3 py-1.5 bg-[var(--grey)] text-white font-semibold text-[11px] uppercase tracking-wide rounded-[var(--radius-md)] hover:bg-[var(--grey-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 transition-[var(--transition-base)] disabled:opacity-60 disabled:cursor-not-allowed'
            : 'w-full sm:w-auto px-5 py-2 bg-[var(--grey)] text-white font-semibold text-xs uppercase tracking-wide rounded-[var(--radius-md)] hover:bg-[var(--grey-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 transition-[var(--transition-base)] disabled:opacity-60 disabled:cursor-not-allowed'
        }
      >
        {status === 'loading' ? 'Envoi en cours...' : 'Envoyer la demande'}
      </button>
    </form>
  )
}
