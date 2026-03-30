'use client'

import { useState, useEffect } from 'react'

interface FormFieldConfig {
  id: string
  key: string
  label: string
  type: string
  required: boolean
  placeholder: string | null
  options: { value: string; label: string }[] | null
}

export function ContactForm({
  initialMessage = '',
  productName,
  formContext,
  initialFormFields,
  variant = 'default',
}: {
  initialMessage?: string
  productName?: string
  formContext?: string
  initialFormFields?: FormFieldConfig[]
  /** 'location' = wider layout, better spacing for chariots de location */
  variant?: 'default' | 'location'
}) {
  const [message, setMessage] = useState(initialMessage)
  const [formFields, setFormFields] = useState<FormFieldConfig[]>(initialFormFields ?? [])

  useEffect(() => {
    if (initialMessage) setMessage(initialMessage)
  }, [initialMessage])

  useEffect(() => {
    if (!formContext) return
    if (initialFormFields && initialFormFields.length > 0) return
    fetch(`/api/form-fields?context=${encodeURIComponent(formContext)}`)
      .then((res) => res.json())
      .then((data) => setFormFields(Array.isArray(data) ? data : []))
      .catch(() => setFormFields([]))
  }, [formContext, initialFormFields])

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const form = e.currentTarget
    const formData = new FormData(form)

    const customData: Record<string, string | null> = {}
    for (const f of formFields) {
      const val = formData.get(`field_${f.key}`)
      customData[f.key] = val ? String(val).trim() || null : null
    }

    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      phone: formData.get('phone'),
      message: formData.get('message'),
      ...(productName && { product: productName }),
      ...(Object.keys(customData).length > 0 && { customData }),
    }

    try {
      const url = productName ? '/api/quote-requests' : '/api/contact'
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setStatus('success')
        form.reset()
        setMessage('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const isLocation = variant === 'location'
  const inputClass = isLocation
    ? 'w-full bg-[#f8f9fa] border border-[var(--border)] px-5 py-3.5 text-[#333333] text-base placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all rounded-lg'
    : 'w-full bg-[#f5f5f5] border-0 px-4 py-3 text-[#333333] text-sm placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all'
  const labelClass = isLocation
    ? 'block text-sm font-medium text-[#555555] mb-2'
    : 'block text-xs text-[#999999] uppercase tracking-wider mb-2'
  const sectionGap = isLocation ? 'space-y-6' : 'space-y-5'
  const gridGap = isLocation ? 'gap-6' : 'gap-5'
  const isNacelleLocation = formContext === 'nacelles-de-location'
  const characteristicsHeading = isNacelleLocation
    ? 'Caractéristiques de la nacelle'
    : 'Caractéristiques du chariot'
  const selectedProductHint = isNacelleLocation
    ? 'Votre demande sera enregistrée pour ce type de nacelle. Précisez vos contraintes (durée, lieu, hauteur de travail) dans le message.'
    : 'Votre demande sera enregistrée pour ce type de chariot. Précisez vos contraintes (durée, lieu, capacité) dans le message.'

  return (
    <form onSubmit={handleSubmit} className={sectionGap}>
      {productName && (
        <div
          role="status"
          aria-live="polite"
          className={
            isLocation
              ? 'rounded-xl border border-[var(--accent)]/35 bg-[var(--accent)]/[0.07] p-4 sm:p-5 mb-1 shadow-sm'
              : 'rounded-lg border-l-4 border-[var(--accent)] bg-[var(--accent)]/[0.06] px-4 py-3.5 mb-1'
          }
        >
          <p
            className={
              isLocation
                ? 'text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)] mb-2'
                : 'text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)] mb-1'
            }
          >
            Produit sélectionné
          </p>
          <p
            className={
              isLocation ? 'text-xl md:text-2xl font-bold text-[#1a1a1a] leading-snug' : 'text-lg font-bold text-[#333333]'
            }
          >
            {productName}
          </p>
          <p className="text-sm text-[#666666] mt-2 max-w-2xl">{selectedProductHint}</p>
        </div>
      )}

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridGap}`}>
        <div>
          <label htmlFor="name" className={labelClass}>Nom *</label>
          <input id="name" name="name" type="text" required className={inputClass} placeholder="Votre nom" />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email *</label>
          <input id="email" name="email" type="email" required className={inputClass} placeholder="votre@email.com" />
        </div>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridGap}`}>
        <div>
          <label htmlFor="company" className={labelClass}>Société</label>
          <input id="company" name="company" type="text" className={inputClass} placeholder="Votre entreprise" />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Téléphone</label>
          <input id="phone" name="phone" type="tel" className={inputClass} placeholder="+212 6XX XXX XXX" />
        </div>
      </div>

      {formFields.length > 0 && (
        <div className={`${isLocation ? 'bg-[#f8f9fa] p-5 sm:p-6 rounded-xl border border-[var(--border)]' : ''}`}>
          {isLocation && (
            <h4 className="text-base font-semibold text-[#333333] mb-4">{characteristicsHeading}</h4>
          )}
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${formFields.length >= 3 ? 'lg:grid-cols-3' : ''} ${gridGap}`}>
          {formFields.map((f) => (
            <div key={f.id} className={f.type === 'textarea' ? 'sm:col-span-2 lg:col-span-3' : ''}>
              <label htmlFor={`field_${f.key}`} className={labelClass}>
                {f.label} {f.required && '*'}
              </label>
              {f.type === 'select' ? (
                <select
                  id={`field_${f.key}`}
                  name={`field_${f.key}`}
                  required={f.required}
                  className={inputClass}
                >
                  <option value="">Sélectionnez...</option>
                  {(f.options || []).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea
                  id={`field_${f.key}`}
                  name={`field_${f.key}`}
                  required={f.required}
                  rows={3}
                  className={inputClass + ' resize-none'}
                  placeholder={f.placeholder || ''}
                />
              ) : (
                <input
                  id={`field_${f.key}`}
                  name={`field_${f.key}`}
                  type={f.type === 'number' ? 'number' : 'text'}
                  required={f.required}
                  className={inputClass}
                  placeholder={f.placeholder || ''}
                />
              )}
            </div>
          ))}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="message" className={labelClass}>Message *</label>
        <textarea
          id="message"
          name="message"
          required
          rows={isLocation ? 4 : 5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass + ' resize-none'}
          placeholder="Décrivez votre projet ou votre besoin..."
        />
      </div>

      {status === 'success' && (
        <p className="text-green-600 text-sm font-medium">
          Message envoyé. Nous vous recontacterons sous 48h.
        </p>
      )}
      {status === 'error' && (
        <p className="text-red-600 text-sm font-medium">
          Erreur d&apos;envoi. Réessayez ou contactez-nous par téléphone.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className={`bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 ${
          isLocation ? 'px-10 py-3.5 text-base rounded-lg' : 'px-8 py-3'
        }`}
      >
        {status === 'loading' ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  )
}
