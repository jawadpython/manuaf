'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'

const heroSlides = [
  {
    title: 'Solutions intralogistiques globales',
    subtitle: 'Comment pouvons-nous rendre votre entrepôt encore plus efficace, durable et économique ?',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80',
  },
  {
    title: 'Solutions intralogistiques globales',
    subtitle: 'Comment pouvons-nous rendre votre entrepôt encore plus efficace, durable et économique ?',
    image: '/images/acc1.png',
  },
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
    <section className="relative min-h-[75vh] md:min-h-[85vh] flex items-center pt-[72px] md:pt-[96px] overflow-hidden">
      {/* Background images - flip between them */}
      <div className="absolute inset-0">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[30000ms] ${
              i === currentIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={s.image}
              alt="Entrepôt logistique"
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
              unoptimized={s.image.startsWith('/')}
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
