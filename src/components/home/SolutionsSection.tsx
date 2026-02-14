import Link from 'next/link'
import Image from 'next/image'

// Electric products - 4 products for one row
const electricProducts = [
  {
    title: 'Chariots élévateurs à mât rétractable',
    image: '/images/products/chr5-min-276x300.jpg',
    href: '/produits/chariots-mat-retractable',
  },
  {
    title: 'Chariots élévateurs frontaux électriques',
    image: '/images/products/JUNGHEINRICH-EFG-318K_1.jpg',
    href: '/produits/chariots-frontaux-electriques',
  },
  {
    title: 'Transpalettes',
    image: '/images/products/chr6-min-276x300.jpg',
    href: '/produits/transpalettes',
  },
  {
    title: 'Gerbeurs électriques',
    image: '/images/products/chr8-min-276x300.jpg',
    href: '/produits/gerbeurs-electriques',
  },
]

// Thermal products - 4 products for one row
const thermalProducts = [
  {
    title: 'Chariots élévateurs Thermique 25D-9',
    image: '/images/products/250D-9-276x300.jpg',
    href: '/produits/chariot-thermique-25d',
  },
  {
    title: 'Chariots élévateurs Thermique 35D-9',
    image: '/images/products/35DE-7-276x300.jpg',
    href: '/produits/chariot-thermique-35d',
  },
  {
    title: 'Chariots élévateurs Thermique 50D-9',
    image: '/images/products/50DN-9VBTier-3A-276x300.jpg',
    href: '/produits/chariot-thermique-50d',
  },
  {
    title: 'Chariots élévateurs Thermique 70D-9',
    image: '/images/products/Chariot-toyota-Diesel-2.jpg',
    href: '/produits/chariot-thermique-70d',
  },
]

function ProductCard({ title, image, href }: { title: string; image: string; href: string }) {
  return (
    <Link
      href={href}
      className="group block bg-white overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
    >
      <div className="relative w-full h-[420px] sm:h-[480px] md:h-[540px] overflow-hidden bg-[#f8f8f8]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-2 sm:p-4 transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/10 transition-all duration-300"></div>
      </div>
      <div className="p-3 sm:p-5 text-center border-t-4 border-[var(--accent)]">
        <h3 className="text-[var(--grey)] text-xs sm:text-sm font-semibold mb-2 sm:mb-3 group-hover:text-[var(--accent)] transition-colors leading-tight min-h-[32px] sm:min-h-[48px] flex items-center justify-center">
          {title}
        </h3>
        <span className="inline-flex items-center gap-1 sm:gap-2 text-[var(--accent)] text-[10px] sm:text-sm font-semibold uppercase tracking-wider group-hover:gap-2 sm:group-hover:gap-3 transition-all">
          En savoir plus
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

export function SolutionsSection() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-[var(--accent)] font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3">
            Notre catalogue
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--grey)] mb-3 sm:mb-4">
            Nos produits
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-[var(--accent)] mx-auto"></div>
        </div>

        {/* Electric Products */}
        <div className="mb-10 md:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <h3 className="text-base sm:text-xl font-bold text-[var(--grey)] uppercase tracking-wide flex items-center gap-2 sm:gap-3">
              <span className="w-8 h-8 sm:w-10 sm:h-10 bg-[var(--accent)] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <span className="text-sm sm:text-base md:text-xl">Engins de manutention électriques</span>
            </h3>
            <Link href="/produits/chariots" className="hidden sm:inline-flex items-center gap-2 text-[var(--accent)] font-semibold hover:gap-3 transition-all text-sm">
              Voir tout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {electricProducts.map((product, index) => (
              <ProductCard key={`electric-${index}`} {...product} />
            ))}
          </div>
        </div>

        {/* Thermal Products */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <h3 className="text-base sm:text-xl font-bold text-[var(--grey)] uppercase tracking-wide flex items-center gap-2 sm:gap-3">
              <span className="w-8 h-8 sm:w-10 sm:h-10 bg-[var(--grey)] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
              </span>
              <span className="text-sm sm:text-base md:text-xl">Engins de manutention thermiques</span>
            </h3>
            <Link href="/produits/chariots" className="hidden sm:inline-flex items-center gap-2 text-[var(--accent)] font-semibold hover:gap-3 transition-all text-sm">
              Voir tout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {thermalProducts.map((product, index) => (
              <ProductCard key={`thermal-${index}`} {...product} />
            ))}
          </div>
        </div>

        {/* Mobile "Voir tout" button */}
        <div className="sm:hidden text-center mt-8">
          <Link 
            href="/produits/chariots" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-medium"
          >
            Voir tous les produits
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
