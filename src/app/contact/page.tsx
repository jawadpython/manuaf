import Link from 'next/link'
import { ContactForm } from '@/components/contact/ContactForm'
import { PageHero } from '@/components/layout/PageHero'
import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Contact MANUAF | Devis chariots Casablanca',
  description:
    "Contactez MANUAF à Casablanca pour un devis location ou vente de chariots élévateurs. Conseil expert manutention.",
  canonical: '/contact',
})

export default function ContactPage() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <PageHero
        label="Nous contacter"
        title="Contact"
        subtitle="Notre équipe est à votre disposition pour répondre à toutes vos questions"
        image="/images/contact.webp"
      />

      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-white p-5 sm:p-6 border-t-4 border-[var(--accent)]">
                <h3 className="font-bold text-[#333333] text-lg mb-6">
                  Informations de contact
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#999999] uppercase tracking-wider mb-1">Adresse</p>
                      <p className="text-[#666666] text-sm">
                        26, Avenue Mers Sultan<br />
                        Appt N°3 Etage 1<br />
                        Casablanca, Maroc
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#999999] uppercase tracking-wider mb-1">Téléphone</p>
                      <div className="space-y-1">
                        <a
                          href="tel:+212670085699"
                          className="block text-[#666666] text-sm hover:text-[var(--accent)] transition-colors"
                        >
                          +212 670 085 699
                        </a>
                        <a
                          href="tel:+212631995242"
                          className="block text-[#666666] text-sm hover:text-[var(--accent)] transition-colors"
                        >
                          +212 631 995 242
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#999999] uppercase tracking-wider mb-1">Email</p>
                      <a
                        href="mailto:Contact@manuaf.com"
                        className="text-[#666666] text-sm hover:text-[var(--accent)] transition-colors"
                      >
                        Contact@manuaf.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-[#999999] uppercase tracking-wider mb-1">Horaires</p>
                      <p className="text-[#666666] text-sm">
                        Lundi - Vendredi<br />
                        8h30 - 18h00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-5 sm:p-6 md:p-8 border-t-4 border-[var(--accent)]">
                <h3 className="font-bold text-[#333333] text-lg mb-4">
                  Envoyez-nous un message
                </h3>
                <p className="text-[#666666] text-sm mb-6">
                  Besoin d&apos;un devis pour la{' '}
                  <Link href="/produits/chariots/location" className="text-[var(--accent)] font-medium hover:underline">
                    location
                  </Link>
                  {' '}ou l&apos;{' '}
                  <Link href="/produits/chariots/occasion" className="text-[var(--accent)] font-medium hover:underline">
                    achat de chariots d&apos;occasion
                  </Link>
                  ? Utilisez notre{' '}
                  <Link href="/demander-chariot" className="text-[var(--accent)] font-medium hover:underline">
                    formulaire de demande de devis
                  </Link>
                  .
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
