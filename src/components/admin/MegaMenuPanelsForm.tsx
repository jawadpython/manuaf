'use client'

import { useState } from 'react'
import type { MegaMenuPanelKey, MegaMenuPanelPayload } from '@/lib/megaMenuPanelDefaults'
import { MEGA_MENU_PANEL_KEYS } from '@/lib/megaMenuPanelDefaults'
import { MEGA_MENU_IMAGE_MAX_EDGE, uploadAdminImage } from '@/lib/adminImageUpload'

const LABELS: Record<MegaMenuPanelKey, string> = {
  transpalette_manuel: 'Colonne droite — Transpalette manuel',
  chariots_occasion: "Colonne droite — Chariots d'occasion",
  nacelle_occasion: "Colonne droite — Nacelle d'occasion",
}

type Props = {
  initialPanels: Record<MegaMenuPanelKey, MegaMenuPanelPayload>
}

export function MegaMenuPanelsForm({ initialPanels }: Props) {
  const [panels, setPanels] = useState(initialPanels)
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'err'>('idle')
  const [uploadingKey, setUploadingKey] = useState<MegaMenuPanelKey | null>(null)
  const [uploadError, setUploadError] = useState<Partial<Record<MegaMenuPanelKey, string>>>({})

  function updatePanel(key: MegaMenuPanelKey, field: keyof MegaMenuPanelPayload, value: string) {
    setPanels((p) => ({
      ...p,
      [key]: { ...p[key], [field]: value },
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    for (const key of MEGA_MENU_PANEL_KEYS) {
      if (!panels[key].imageSrc?.trim()) {
        alert(`Image requise : ${LABELS[key]}`)
        return
      }
    }
    setStatus('saving')
    try {
      const res = await fetch('/api/admin/mega-menu-panels', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ panels }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus('err')
        alert(data.error || 'Erreur')
        return
      }
      if (data.panels) setPanels(data.panels)
      setStatus('ok')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('err')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <header>
        <h1 className="font-display text-xl lg:text-2xl text-[var(--foreground)] tracking-tight">
          Mega-menu Produits
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground-muted)] max-w-2xl">
          Texte, image et bouton d’action des panneaux de droite du menu Produits (Transpalette manuel, Chariots
          d&apos;occasion, Nacelle d&apos;occasion).
        </p>
      </header>

      {MEGA_MENU_PANEL_KEYS.map((key) => (
        <section
          key={key}
          className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-sm space-y-4"
        >
          <h2 className="text-base font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-3">
            {LABELS[key]}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-1">
                Image *
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer inline-flex">
                  <span className="inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--background-alt)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--background-muted)] transition-colors">
                    {panels[key].imageSrc ? "Changer l'image" : "Télécharger depuis l'ordinateur"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    className="sr-only"
                    disabled={uploadingKey !== null}
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      e.target.value = ''
                      if (!file) return
                      setUploadingKey(key)
                      setUploadError((err) => {
                        const next = { ...err }
                        delete next[key]
                        return next
                      })
                      const result = await uploadAdminImage(file, { preset: 'megaMenu' })
                      setUploadingKey(null)
                      if (result.ok) {
                        updatePanel(key, 'imageSrc', result.url)
                        setUploadError((err) => {
                          const next = { ...err }
                          delete next[key]
                          return next
                        })
                      } else {
                        setUploadError((err) => ({ ...err, [key]: result.error }))
                      }
                    }}
                  />
                </label>
                {uploadingKey === key && (
                  <span className="text-xs text-[var(--foreground-muted)]">Téléchargement…</span>
                )}
                {panels[key].imageSrc && uploadingKey !== key && (
                  <button
                    type="button"
                    className="text-xs font-medium text-red-600 hover:underline"
                    onClick={() => {
                      updatePanel(key, 'imageSrc', '')
                      setUploadError((err) => {
                        const next = { ...err }
                        delete next[key]
                        return next
                      })
                    }}
                  >
                    {"Supprimer l'image"}
                  </button>
                )}
              </div>
              {uploadError[key] && (
                <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {uploadError[key]}
                </p>
              )}
              {panels[key].imageSrc && !uploadError[key] && (
                <div className="mt-3 flex items-start gap-3">
                  <img
                    src={panels[key].imageSrc}
                    alt=""
                    className="max-h-36 rounded-lg border border-[var(--border)] object-contain bg-[var(--background-muted)]"
                  />
                  <p className="text-xs text-[var(--foreground-muted)] break-all max-w-md pt-1">
                    {panels[key].imageSrc}
                  </p>
                </div>
              )}
              <p className="mt-1.5 text-xs text-[var(--foreground-muted)]">
                JPEG, PNG, WebP ou GIF — image optimisée pour le menu (max. {MEGA_MENU_IMAGE_MAX_EDGE}px côté long,
                JPEG ~82&nbsp;% qualité côté serveur) pour un chargement rapide. Max. 10&nbsp;Mo à l&apos;envoi.
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-1">
                Texte alternatif (accessibilité)
              </label>
              <input
                type="text"
                value={panels[key].imageAlt}
                onChange={(e) => updatePanel(key, 'imageAlt', e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-1">
                Titre *
              </label>
              <input
                type="text"
                required
                value={panels[key].title}
                onChange={(e) => updatePanel(key, 'title', e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-1">
                Texte descriptif *
              </label>
              <textarea
                required
                rows={4}
                value={panels[key].body}
                onChange={(e) => updatePanel(key, 'body', e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-1">
                Libellé du bouton *
              </label>
              <input
                type="text"
                required
                value={panels[key].ctaLabel}
                onChange={(e) => updatePanel(key, 'ctaLabel', e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-1">
                Lien du bouton *
              </label>
              <input
                type="text"
                required
                value={panels[key].ctaHref}
                onChange={(e) => updatePanel(key, 'ctaHref', e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                placeholder="/produits/..."
              />
            </div>
          </div>
        </section>
      ))}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === 'saving'}
          className="bg-[var(--accent)] text-white px-6 py-2.5 font-semibold rounded-lg hover:opacity-95 disabled:opacity-50"
        >
          {status === 'saving' ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        {status === 'ok' && <span className="text-sm text-green-600 font-medium">Enregistré.</span>}
        {status === 'err' && <span className="text-sm text-red-600 font-medium">Erreur.</span>}
      </div>
    </form>
  )
}
