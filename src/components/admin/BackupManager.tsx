'use client'

import { useState, type FormEvent } from 'react'

export function BackupManager() {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onExport() {
    setError(null)
    setMessage(null)
    setBusy(true)
    try {
      const res = await fetch('/api/admin/backup/export', { credentials: 'same-origin' })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError(
          (j as { error?: string }).error || `Téléchargement refusé (${res.status})`
        )
        return
      }
      const blob = await res.blob()
      const cd = res.headers.get('Content-Disposition')
      let filename = 'logistec-sauvegarde.zip'
      const m = cd?.match(/filename="([^"]+)"/) || cd?.match(/filename\*=UTF-8''(.+)/)
      if (m) {
        try {
          filename = m[1]!.includes("''") ? decodeURIComponent(m[1]!) : m[1]!
        } catch {
          filename = m[1]!
        }
      }
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename
      a.click()
      URL.revokeObjectURL(a.href)
      setMessage('Archive téléchargée.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Échec du téléchargement')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <section className="p-5 bg-white border border-[var(--border)] rounded-xl shadow-sm">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">Exporter</h2>
        <p className="mt-1 text-xs text-[var(--foreground-muted)] leading-relaxed">
          Télécharge une archive ZIP : base de données (JSON) + fichiers locaux
          <code className="mx-0.5 text-[11px]">public/uploads</code> (les images
          hébergées ailleurs, ex. Cloudinary, ne sont pas copiées dans l&apos;archive).
        </p>
        <button
          type="button"
          onClick={onExport}
          disabled={busy}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-[var(--accent)] text-white text-sm font-medium px-4 py-2.5 disabled:opacity-50 hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          {busy ? 'Préparation…' : 'Télécharger la sauvegarde (.zip)'}
        </button>
      </section>

      <ImportSection busy={busy} setBusy={setBusy} setMessage={setMessage} setError={setError} />

      {message && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          {message}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  )
}

function ImportSection({
  busy,
  setBusy,
  setMessage,
  setError,
}: {
  busy: boolean
  setBusy: (v: boolean) => void
  setMessage: (s: string | null) => void
  setError: (s: string | null) => void
}) {
  const [replaceFiles, setReplaceFiles] = useState(true)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    const formData = new FormData(e.currentTarget)
    const f = formData.get('file') as File | null
    if (!f || f.size < 1) {
      setError('Choisissez un fichier .zip exporté depuis cette interface.')
      return
    }
    if (!f.name.toLowerCase().endsWith('.zip') && f.type !== 'application/zip') {
      setError('Le fichier doit être une archive .zip (export logistec).')
      return
    }
    setBusy(true)
    try {
      const body = new FormData()
      body.append('file', f)
      if (replaceFiles) body.append('replaceFiles', '1')
      const res = await fetch('/api/admin/backup/import', {
        method: 'POST',
        body,
        credentials: 'same-origin',
      })
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
        message?: string
        products?: number
        categories?: number
        uploadedFiles?: number
        fileWarnings?: string[]
      }
      if (!res.ok || !data.ok) {
        setError(data.error || `Import refusé (${res.status})`)
        return
      }
      const parts = [
        data.message || 'OK',
        data.categories != null && `${data.categories} catégories`,
        data.products != null && `${data.products} produits`,
        data.uploadedFiles != null &&
          (replaceFiles ? `${data.uploadedFiles} fichiers restaurés` : ''),
      ]
        .filter(Boolean)
        .join(' · ')
      let msg = parts
      if (data.fileWarnings?.length) {
        msg += ` · Avertissements: ${data.fileWarnings.slice(0, 5).join('; ')}${
          data.fileWarnings.length > 5 ? '…' : ''
        }`
      }
      setMessage(msg)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau lors de l'import")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="p-5 bg-amber-50/80 border border-amber-200 rounded-xl">
      <h2 className="text-sm font-semibold text-[var(--foreground)]">Importer</h2>
      <p className="mt-1 text-xs text-[var(--foreground-muted)] leading-relaxed">
        Remplace <strong>toutes</strong> les données (catégories, produits, blog, services,
        demandes, mega-menu, champs devis) par le contenu du fichier. Cette action ne peut
        pas être annulée.
      </p>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-[var(--foreground)]">
            Fichier .zip
          </label>
          <input
            name="file"
            type="file"
            accept=".zip,application/zip"
            required
            disabled={busy}
            className="mt-1 block w-full text-sm"
          />
        </div>
        <label className="flex items-start gap-2 cursor-pointer text-xs text-[var(--foreground)]">
          <input
            type="checkbox"
            checked={replaceFiles}
            onChange={(e) => setReplaceFiles(e.target.checked)}
            disabled={busy}
            className="mt-0.5"
          />
          <span>
            Restaurer aussi les images locales sous{' '}
            <code className="text-[11px]">/uploads/</code> (extraites depuis le ZIP vers{' '}
            <code className="text-[11px]">public/uploads</code>).
          </span>
        </label>
        <p className="text-[11px] text-amber-900/80">
          Si la case n&apos;est pas cochée, seule la base est restaurée (les images locales
          restent sur le disque actuel).
        </p>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center rounded-lg border-2 border-red-300 bg-white text-red-800 text-sm font-medium px-4 py-2.5 disabled:opacity-50 hover:bg-red-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
        >
          {busy ? 'Restauration…' : 'Remplacer toute la base (import)'}
        </button>
      </form>
    </section>
  )
}
