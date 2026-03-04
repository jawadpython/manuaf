'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { RANDOM_IMAGES } from '@/lib/randomImages'

const SLIDE_DURATION = 60000

const heroSlides = [
  { title: 'Solutions intralogistiques globales', subtitle: 'Comment pouvons-nous rendre votre entrepôt encore plus efficace, durable et économique ?', image: RANDOM_IMAGES[0] },
  { title: 'Location de chariots', subtitle: 'Des solutions flexibles pour vos besoins ponctuels ou à long terme. Électrique ou thermique.', image: RANDOM_IMAGES[1] },
  { title: "Chariots d'occasion", subtitle: 'Équipements révisés et garantis pour optimiser votre budget sans compromettre la qualité.', image: RANDOM_IMAGES[2] },
  { title: 'Maintenance & Support', subtitle: 'Entretien préventif, réparation et pièces détachées. Nos techniciens certifiés à votre service.', image: RANDOM_IMAGES[3] },
  { title: 'Une offre complète', subtitle: 'Vente, location, reconditionnement. Une offre complète pour tous vos besoins en manutention.', image: RANDOM_IMAGES[4] },
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slidePositions, setSlidePositions] = useState<Record<number, string>>({})
  const [fromIndex, setFromIndex] = useState<number | null>(null)
  const [isPreparing, setIsPreparing] = useState(false)

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return
    const from = currentIndex
    const isNext = index > from

    // Both next and prev: current exits left, new enters from right (next) — OR current exits right, new enters from left (prev)
    // Same visual direction: always slide left-to-right (like turning pages forward)
    const [fromExit, fromStart] = isNext
      ? ['translateX(-100%)', 'translateX(0)']
      : ['translateX(100%)', 'translateX(0)']
    const [toEnter, toStart] = isNext
      ? ['translateX(0)', 'translateX(100%)']
      : ['translateX(0)', 'translateX(-100%)']

    setSlidePositions({
      [from]: fromStart,
      [index]: toStart,
    })
    setFromIndex(from)
    setIsPreparing(true)
    setIsTransitioning(true)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsPreparing(false)
        setSlidePositions({
          [from]: fromExit,
          [index]: toEnter,
        })
        setCurrentIndex(index)
      })
    })

    setTimeout(() => {
      setIsTransitioning(false)
      setFromIndex(null)
      setSlidePositions({})
    }, 700)
  }, [isTransitioning, currentIndex])

  const goNext = useCallback(() => {
    goToSlide((currentIndex + 1) % heroSlides.length)
  }, [currentIndex, goToSlide])

  const goPrev = useCallback(() => {
    goToSlide((currentIndex - 1 + heroSlides.length) % heroSlides.length)
  }, [currentIndex, goToSlide])

  useEffect(() => {
    const timer = setInterval(goNext, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [currentIndex, goNext])

  const getSlideTransform = (i: number) => {
    if (slidePositions[i] !== undefined) return slidePositions[i]
    if (i === currentIndex) return 'translateX(0)'
    return i < currentIndex ? 'translateX(-100%)' : 'translateX(100%)'
  }

  return (
    <section className="relative h-[65vh] md:h-[78vh] min-h-[450px] flex items-center overflow-hidden -mt-[var(--header-height)] pt-[var(--header-height)]">
      {/* Slides — each has its own image + overlay + white card, all move together */}
      <div className="absolute inset-0">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 flex items-end ${isPreparing ? '' : 'transition-transform duration-700 ease-out'}`}
            style={{
              transform: getSlideTransform(i),
              zIndex: i === currentIndex || fromIndex === i ? 1 : 0,
            }}
          >
            <Image
              src={s.image}
              alt="Entrepôt logistique"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority={i === 0}
              loading={i === 0 ? 'eager' : 'lazy'}
              unoptimized={s.image.startsWith('http')}
            />
            <div className="absolute inset-0 bg-black/35" />
            {/* White card — fixed with its image, moves with slide */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full flex justify-start mb-[3cm]">
              <div className="bg-white p-4 sm:p-5 md:p-6 text-left w-[480px] sm:w-[560px] md:w-[640px] min-h-[140px] border-b-2 border-r-2 border-[#6b21a8] shadow-lg overflow-hidden">
                <p className="text-xs sm:text-sm font-bold text-[#1a1a1a] uppercase tracking-wider mb-3">
                  MANUAF — Solutions intralogistiques
                </p>
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-[#1a1a1a] leading-tight mb-4 pb-3 border-b-2 border-[#6b21a8] w-fit">
                  {s.title}
                </h1>
                <p className="text-sm sm:text-base text-[#1a1a1a] mb-6 leading-relaxed line-clamp-3">
                  {s.subtitle}
                </p>
                <Button
                  href="/produits/chariots/location"
                  size="md"
                  variant="grey"
                  className="en-savoir-plus uppercase tracking-widest text-[0.8125rem] px-6 py-2.5 bg-[#343a40] hover:bg-[#2d3238] text-white rounded-none"
                >
                  En savoir plus
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goPrev}
        disabled={isTransitioning}
        className="absolute left-0 top-[calc(50%-2rem)] -translate-y-1/2 z-20 w-10 h-24 md:w-12 md:h-32 flex items-center justify-center bg-[var(--grey)] hover:bg-[var(--grey-dark)] transition-all duration-300 disabled:opacity-50"
        aria-label="Slide précédent"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goNext}
        disabled={isTransitioning}
        className="absolute right-0 top-[calc(50%-2rem)] -translate-y-1/2 z-20 w-10 h-24 md:w-12 md:h-32 flex items-center justify-center bg-[var(--grey)] hover:bg-[var(--grey-dark)] transition-all duration-300 disabled:opacity-50"
        aria-label="Slide suivant"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            disabled={isTransitioning}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'bg-[var(--accent)] w-8' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Aller au slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
