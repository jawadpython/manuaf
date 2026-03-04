import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { HeroSection } from '@/components/home/HeroSection'
import { CredibilityBand } from '@/components/home/CredibilityBand'
import { createMetadata } from '@/lib/seo'

const SolutionsSection = dynamic(
  () => import('@/components/home/SolutionsSection').then((m) => ({ default: m.SolutionsSection })),
  { ssr: true, loading: () => <SolutionsSectionSkeleton /> }
)

const FeaturedProducts = dynamic(
  () => import('@/components/home/FeaturedProducts').then((m) => ({ default: m.FeaturedProducts })),
  { ssr: true, loading: () => <FeaturedProductsSkeleton /> }
)

const NewsletterSection = dynamic(
  () => import('@/components/home/NewsletterSection').then((m) => ({ default: m.NewsletterSection })),
  { ssr: true, loading: () => <NewsletterSectionSkeleton /> }
)

const CTASection = dynamic(
  () => import('@/components/home/CTASection').then((m) => ({ default: m.CTASection })),
  { ssr: true, loading: () => <CTASectionSkeleton /> }
)

function SolutionsSectionSkeleton() {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-[#F3F5F7]" aria-hidden>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-32 mb-10 bg-[var(--grey)]/10 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[2/1] bg-[var(--grey)]/10 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedProductsSkeleton() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-[#F5F6F7]" aria-hidden>
      <div className="max-w-[1820px] mx-auto px-4 sm:px-4 lg:px-4">
        <div className="h-24 mb-12 bg-[var(--grey)]/10 rounded animate-pulse max-w-2xl mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded shadow-md overflow-hidden">
              <div className="aspect-[2/1] bg-[var(--grey)]/10 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-20 bg-[var(--grey)]/10 rounded animate-pulse" />
                <div className="h-4 w-full bg-[var(--grey)]/10 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-[var(--grey)]/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function NewsletterSectionSkeleton() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-[#333333]" aria-hidden>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="h-16 w-16 bg-[var(--grey)]/20 rounded-full mx-auto mb-6 animate-pulse" />
        <div className="h-8 w-64 bg-white/10 rounded mx-auto mb-4 animate-pulse" />
        <div className="h-4 w-96 max-w-full bg-white/10 rounded mx-auto animate-pulse" />
      </div>
    </section>
  )
}

function CTASectionSkeleton() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-[var(--accent)]" aria-hidden>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="h-8 w-72 bg-white/20 rounded mx-auto mb-4 animate-pulse" />
        <div className="h-4 w-80 max-w-full bg-white/20 rounded mx-auto animate-pulse" />
      </div>
    </section>
  )
}

export const metadata: Metadata = createMetadata({
  title: 'MANUAF | Location chariots élévateurs Casablanca - Intralogistique Maroc',
  description:
    "Location et vente de chariots élévateurs à Casablanca. MANUAF, expert intralogistique au Maroc : transpalettes, nacelles, maintenance et pièces.",
  canonical: '/',
})

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CredibilityBand />
      <SolutionsSection />
      <FeaturedProducts />
      <NewsletterSection />
      <CTASection />
    </>
  )
}
