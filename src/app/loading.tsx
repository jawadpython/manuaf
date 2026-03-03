export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" aria-live="polite" aria-busy="true">
      <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
