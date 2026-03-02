'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { RANDOM_IMAGES } from '@/lib/randomImages'

const heroSlides = [
  { title: 'Solutions intralogistiques globales', subtitle: 'Comment pouvons-nous rendre votre entrepôt encore plus efficace, durable et économique ?', image: RANDOM_IMAGES[0] },
  { title: 'Location de chariots', subtitle: 'Des solutions flexibles pour vos besoins ponctuels ou à long terme. Électrique ou thermique.', image: RANDOM_IMAGES[1] },
  { title: "Chariots d'occasion", subtitle: 'Équipements révisés et garantis pour optimiser votre budget sans compromettre la qualité.', image: RANDOM_IMAGES[2] },
  { title: 'Maintenance & Support', subtitle: 'Entretien préventif, réparation et pièces détachées. Nos techniciens certifiés à votre service.', image: RANDOM_IMAGES[3] },
  { title: 'Solutions intralogistiques globales', subtitle: 'Vente, location, reconditionnement. Une offre complète pour tous vos besoins en manutention.', image: RANDOM_IMAGES[4] },
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const slide = heroSlides[currentIndex]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length)
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-[75vh] md:min-h-[85vh] flex items-center overflow-hidden -mt-[var(--header-height)] pt-[var(--header-height)]">
      {/* Background images - flip between them */}
      <div className="absolute inset-0 hero-bg-layer">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[30000ms] hero-bg-layer ${
              i === currentIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={s.image}
              alt="Entrepôt logistique"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50 z-[1]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl py-16 md:py-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            {slide.title}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 max-w-2xl">
            {slide.subtitle}
          </p>
          <Button href="/produits/chariots/location" size="xl" variant="grey">
            En savoir plus
          </Button>
        </div>
      </div>
    </section>
  )
}
