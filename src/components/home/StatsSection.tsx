export function StatsSection() {
  const stats = [
    { value: '10+', label: "Années d'expérience" },
    { value: '500+', label: 'Clients satisfaits' },
    { value: '24/7', label: 'Support' },
  ]

  return (
    <section className="py-8 md:py-12 bg-[var(--grey)]" aria-labelledby="stats-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 id="stats-heading" className="sr-only">
          Nos chiffres clés
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-center p-6 md:p-8"
            >
              <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--accent)] mb-2">
                {stat.value}
              </p>
              <p className="text-white/90 text-sm sm:text-base font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
