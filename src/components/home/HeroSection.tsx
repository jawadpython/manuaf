import { Button } from '@/components/ui/Button'
import Image from 'next/image'

const heroSlides = [
  {
    title: 'Solutions intralogistiques globales',
    subtitle: 'Comment pouvons-nous rendre votre entrepôt encore plus efficace, durable et économique ?',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80',
  },
]

export function HeroSection() {
  const slide = heroSlides[0]
  
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center pt-[72px] md:pt-[96px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={slide.image}
          alt="Entrepôt logistique"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Orange accent bar at bottom */}
      <div className="absolute left-0 bottom-0 w-full h-2 bg-[var(--accent)] z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl py-16 md:py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {slide.title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
            {slide.subtitle}
          </p>
          <Button href="/produits/chariots" size="lg">
            En savoir plus
          </Button>
        </div>
      </div>
    </section>
  )
}
