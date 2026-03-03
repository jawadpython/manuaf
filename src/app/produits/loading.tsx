export default function ProduitsLoading() {
  return (
    <div className="py-16 flex items-center justify-center" aria-live="polite" aria-busy="true">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--foreground-muted)] text-sm">Chargement des produits...</p>
      </div>
    </div>
  )
}
