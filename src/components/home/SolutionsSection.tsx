import Link from 'next/link'
import Image from 'next/image'
import { RANDOM_IMAGES } from '@/lib/randomImages'

const solutions = [
  { title: 'Les chariots neufs', image: RANDOM_IMAGES[0], href: '/produits/chariots' },
  { title: 'Les robots mobiles', image: RANDOM_IMAGES[1], href: '/produits/chariots' },
  { title: 'Les solutions digitales', image: RANDOM_IMAGES[2], href: '/services' },
  { title: 'Les solutions automatisées', image: RANDOM_IMAGES[3], href: '/services' },
  { title: 'Les services', image: RANDOM_IMAGES[4], href: '/services' },
  { title: 'Les solutions énergétiques', image: RANDOM_IMAGES[5], href: '/produits/pieces/batteries' },
]

function SolutionCard({ title, image, href }: { title: string; image: string; href: string }) {
  return (
    <Link
      href={href}
      className="group block relative overflow-hidden aspect-[4/3] min-h-[200px] sm:min-h-[240px]"
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <h3 className="text-white font-bold text-base sm:text-lg">
          {title}
        </h3>
      </div>
    </Link>
  )
}

export function SolutionsSection() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-[#F3F5F7] relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--grey)] mb-4">
            Découvrez nos solutions intralogistiques
          </h2>
          <p className="text-[var(--grey)]/80 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Nous proposons des solutions intralogistiques complètes, conçues pour maximiser l&apos;efficacité de votre chaîne d&apos;approvisionnement. Que ce soit pour le stockage, la manutention, ou la gestion des flux, nos solutions s&apos;adaptent à vos besoins spécifiques.
          </p>
        </div>

        {/* Solutions Grid - 3x2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {solutions.map((solution, index) => (
            <SolutionCard key={index} {...solution} />
          ))}
        </div>
      </div>
    </section>
  )
}
