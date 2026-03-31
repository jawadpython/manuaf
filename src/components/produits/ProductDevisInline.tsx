'use client'

import { useState, useEffect, useRef } from 'react'
import { ContactForm } from '@/components/contact/ContactForm'
import { resolveDevisTypeForSubmit } from '@/lib/devisTypes'

interface FormFieldConfig {
  id: string
  key: string
  label: string
  type: string
  required: boolean
  placeholder: string | null
  options: { value: string; label: string }[] | null
}

interface ProductDevisInlineProps {
  productName: string
  label?: string
  categorySlug?: string
  parentCategorySlug?: string
  /** Pre-loaded form fields for location (avoids flash of occasion form) */
  initialFormFields?: FormFieldConfig[]
  /** When true, button is disabled (product sold) */
  sold?: boolean
}

/** Location rental categories → same custom fields (API maps nacelles-de-location → chariots-location). */
function rentalDevisFormContext(categorySlug?: string, parentCategorySlug?: string): string | undefined {
  if (categorySlug === 'nacelles-de-location' || parentCategorySlug === 'nacelles-de-location') {
    return 'nacelles-de-location'
  }
  if (categorySlug === 'chariots-de-location' || parentCategorySlug === 'chariots-de-location') {
    return 'chariots-de-location'
  }
  return undefined
}

export function ProductDevisInline({ productName, label = 'Demander un devis', categorySlug, parentCategorySlug, initialFormFields, sold = false }: ProductDevisInlineProps) {
  const formContext = rentalDevisFormContext(categorySlug, parentCategorySlug)
  const devisType = resolveDevisTypeForSubmit(categorySlug, parentCategorySlug, formContext)
  const [showForm, setShowForm] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden'
      previousActiveRef.current = document.activeElement as HTMLElement | null
    } else {
      document.body.style.overflow = ''
      previousActiveRef.current?.focus?.()
    }
    return () => { document.body.style.overflow = '' }
  }, [showForm])

  useEffect(() => {
    if (!showForm) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowForm(false)
        return
      }
      if (e.key !== 'Tab') return
      const el = modalRef.current
      if (!el) return
      const focusable = el.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showForm])

  const initialMessage = `Je souhaite obtenir un devis pour le produit suivant : ${productName}.\n\nMerci de me recontacter avec les détails et conditions.`

  return (
    <>
      <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-end">
        <button
          type="button"
          disabled={sold}
          onClick={() => !sold && setShowForm(true)}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[var(--accent)] text-[#1a1a1a] font-bold text-xs uppercase tracking-wider hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--accent)]"
        >
          {sold ? 'Produit vendu' : label}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {showForm && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowForm(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="devis-modal-title"
        >
          <div
            className={`bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto ${
              initialFormFields?.length ? 'max-w-2xl' : 'max-w-lg'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-[var(--border)] px-5 py-4 flex items-center justify-between">
              <h2 id="devis-modal-title" className="text-lg font-bold text-[var(--grey)]">
                Demande de devis
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-2 text-[var(--foreground-muted)] hover:text-[var(--grey)] hover:bg-[var(--background-muted)] rounded transition-colors"
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 sm:p-6">
              <ContactForm
                initialMessage={initialMessage}
                productName={productName}
                formContext={formContext}
                initialFormFields={initialFormFields}
                variant={initialFormFields?.length ? 'location' : 'default'}
                devisType={devisType}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
