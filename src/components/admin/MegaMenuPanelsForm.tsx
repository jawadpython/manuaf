'use client'

import { useState } from 'react'
import type { MegaMenuPanelKey, MegaMenuPanelPayload } from '@/lib/megaMenuPanelDefaults'
import { MEGA_MENU_PANEL_KEYS } from '@/lib/megaMenuPanelDefaults'

const LABELS: Record<MegaMenuPanelKey, string> = {
  chariots_occasion: "Colonne droite — Chariots d'occasion",
  nacelle_occasion: "Colonne droite — Nacelle d'occasion",
}

type Props = {
  initialPanels: Record<MegaMenuPanelKey, MegaMenuPanelPayload>
}

export function MegaMenuPanelsForm({ initialPanels }: Props) {
  const [panels, setPanels] = useState(initialPanels)
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'err'>('idle')

  function updatePanel(key: MegaMenuPanelKey, field: keyof MegaMenuPanelPayload, value: string) {
    setPanels((p) => ({
      ...p,
      [key]: { ...p[key], [field]: value },
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
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
          Mega-menu Chariots
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground-muted)] max-w-2xl">
          Texte, image et lien du panneau de droite lorsque l&apos;utilisateur choisit « Chariots d&apos;occasion » ou «
          Nacelle d&apos;occasion » dans le menu Produits → Chariots.
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
                URL de l&apos;image *
              </label>
              <input
                type="text"
                required
                value={panels[key].imageSrc}
                onChange={(e) => updatePanel(key, 'imageSrc', e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
                placeholder="/images/..."
              />
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
