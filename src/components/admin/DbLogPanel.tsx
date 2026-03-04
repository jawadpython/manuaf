'use client'

import { useState } from 'react'

type LogEntry = { time: string; type: 'info' | 'success' | 'error'; message: string }

export function DbLogPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [lastOk, setLastOk] = useState<boolean | null>(null)

  const checkConnection = async () => {
    setLoading(true)
    setLogs([])
    setLastOk(null)

    try {
      const res = await fetch('/api/admin/db-status')
      const text = await res.text()

      let data: { ok?: boolean; logs?: LogEntry[]; error?: string }
      try {
        data = JSON.parse(text)
      } catch {
        // HTML response (404, Vercel error page, etc.)
        const msg =
          res.status === 404
            ? 'Route /api/admin/db-status introuvable (404). Vérifiez que le déploiement Vercel inclut ce fichier.'
            : `Réponse invalide (HTML au lieu de JSON, HTTP ${res.status}). Route peut-être absente ou erreur serveur. Vérifiez DATABASE_URL et DIRECT_URL dans Vercel → Settings → Environment Variables.`
        setLogs([
          {
            time: new Date().toISOString(),
            type: 'error',
            message: msg,
          },
        ])
        setLastOk(false)
        setLoading(false)
        return
      }

      if (data.logs) setLogs(data.logs)
      setLastOk(data.ok === true)

      if (!res.ok) {
        setLogs((prev) => [
          ...prev,
          {
            time: new Date().toISOString(),
            type: 'error',
            message: data.error || `HTTP ${res.status}`,
          },
        ])
      }
    } catch (err) {
      const error = err as Error
      setLogs([
        {
          time: new Date().toISOString(),
          type: 'error',
          message: error?.message ?? 'Erreur réseau',
        },
      ])
      setLastOk(false)
    } finally {
      setLoading(false)
    }
  }

  const getTypeStyle = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-400'
      case 'error':
        return 'text-red-400 font-medium'
      default:
        return 'text-white/80'
    }
  }

  const getTypePrefix = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return '[OK]'
      case 'error':
        return '[ERREUR]'
      default:
        return '[INFO]'
    }
  }

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--background-alt)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${
              lastOk === null
                ? 'bg-gray-100 text-gray-500'
                : lastOk
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                lastOk === null ? 'bg-gray-400' : lastOk ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            {lastOk === null ? 'Non testé' : lastOk ? 'Connecté' : 'Erreur'}
          </span>
        </div>
        <button
          type="button"
          onClick={checkConnection}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-[var(--accent)] hover:bg-[var(--accent)]/90 disabled:opacity-50 rounded-lg transition-colors"
        >
          {loading ? 'Test en cours...' : 'Vérifier la connexion'}
        </button>
      </div>

      {/* Log tape / terminal */}
      <div className="p-4 bg-[var(--grey)] text-white font-mono text-sm min-h-[200px] max-h-[400px] overflow-y-auto">
        {logs.length === 0 && !loading && (
          <p className="text-white/60">Cliquez sur &quot;Vérifier la connexion&quot; pour tester Supabase.</p>
        )}
        {logs.map((entry, i) => (
          <div
            key={i}
            className={`flex gap-3 py-1.5 border-b border-white/10 last:border-0 ${getTypeStyle(entry.type)}`}
          >
            <span className="text-white/50 shrink-0">{entry.time.split('T')[1]?.slice(0, 12)}</span>
            <span className="shrink-0 font-semibold">{getTypePrefix(entry.type)}</span>
            <span className="break-words">{entry.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
