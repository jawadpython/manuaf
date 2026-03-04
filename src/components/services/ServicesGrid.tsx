'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { RANDOM_IMAGES } from '@/lib/randomImages'

type ServiceId = 'maintenance' | 'reconditionnement' | 'location' | null

const VALID_SERVICE_IDS: ServiceId[] = ['maintenance', 'reconditionnement', 'location']

function getServiceFromParams(searchParams: URLSearchParams | null): ServiceId {
  if (!searchParams) return 'maintenance'
  const service = searchParams.get('service')
  return VALID_SERVICE_IDS.includes(service as ServiceId) ? (service as ServiceId) : 'maintenance'
}

const serviceCards = [
  {
    id: 'maintenance' as const,
    title: 'Maintenance',
    description: 'Entretien préventif et curatif de vos équipements par nos techniciens certifiés',
    image: RANDOM_IMAGES[1],
  },
  {
    id: 'reconditionnement' as const,
    title: 'Reconditionnement',
    description: "Remise à neuf complète de vos chariots pour prolonger leur durée de vie",
    image: RANDOM_IMAGES[2],
  },
  {
    id: 'location' as const,
    title: 'Location',
    description: "Solutions de location flexibles pour répondre à vos besoins ponctuels ou à long terme",
    image: RANDOM_IMAGES[3],
  },
]

const CheckIcon = () => (
  <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

export function ServicesGrid() {
  const searchParams = useSearchParams()
  const [selectedService, setSelectedService] = useState<ServiceId>(() =>
    getServiceFromParams(searchParams)
  )
  const contentRef = useRef<HTMLDivElement>(null)
  const isInitialMount = useRef(true)

  // Sync from URL ?service= when nav link opens /services?service=xxx
  useEffect(() => {
    const fromParams = getServiceFromParams(searchParams)
    setSelectedService(fromParams)
  }, [searchParams])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (selectedService && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedService])

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-[#F3F5F7] relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Solutions-style grid — image cards with overlay */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch">
          {serviceCards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => {
                setSelectedService(card.id)
                window.history.replaceState(null, '', `/services?service=${card.id}`)
              }}
              className={`block w-full text-left relative overflow-hidden aspect-[2/1] ring-2 ring-offset-2 ring-offset-[#F3F5F7] ${
                selectedService === card.id ? 'ring-[var(--accent)] ring-offset-4' : 'ring-transparent'
              }`}
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <h2 className="text-white font-bold text-xs sm:text-sm mb-0.5">
                  {card.title}
                </h2>
                <span className="en-savoir-plus text-white/90 text-[10px] sm:text-[11px] font-medium flex items-center gap-1">
                  En savoir plus
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* In-page expanded content — integrated page section */}
        {selectedService === 'maintenance' && (
          <div ref={contentRef} className="mt-14 md:mt-20 scroll-mt-8">
            <div className="border-t-4 border-[var(--accent)] bg-white pt-6 px-6 pb-6 min-h-[520px]">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-[var(--accent)] font-semibold text-sm uppercase tracking-wider mb-1">Service</p>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Maintenance</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedService(null)
                    window.history.replaceState(null, '', '/services')
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[var(--foreground-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Replier
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)] mb-3 pb-2 border-b border-[var(--border)]">Maintenance préventive</h3>
                  <p className="text-[var(--foreground-muted)] mb-6 leading-relaxed text-sm">
                    Un entretien régulier est essentiel pour garantir la performance, la sécurité
                    et la longévité de vos équipements. Notre service de maintenance préventive
                    vous permet d&apos;éviter les pannes coûteuses et les arrêts de production.
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Contrôles périodiques selon les préconisations constructeur',
                      'Vérification des niveaux (huile, liquide de refroidissement, batterie)',
                      "Remplacement des filtres et pièces d'usure",
                      'Lubrification des organes mécaniques',
                      'Contrôle de sécurité et conformité',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckIcon />
                        <span className="text-[var(--foreground-muted)] text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)] mb-3 pb-2 border-b border-[var(--border)]">Maintenance curative</h3>
                  <p className="text-[var(--foreground-muted)] mb-6 leading-relaxed text-sm">
                    En cas de panne ou de dysfonctionnement, notre équipe intervient rapidement
                    pour diagnostiquer et réparer vos équipements. Nous disposons d&apos;un
                    stock important de pièces de rechange pour minimiser les délais d&apos;intervention.
                  </p>
                  <ul className="space-y-3">
                    {[
                      'Diagnostic électronique et mécanique',
                      'Réparation moteur, transmission, hydraulique',
                      "Dépannage d'urgence 24/7",
                      'Intervention sur site ou en atelier',
                      'Garantie sur toutes nos interventions',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckIcon />
                        <span className="text-[var(--foreground-muted)] text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-8 mt-8">
                <h3 className="text-base font-bold text-[var(--foreground)] mb-4">Pourquoi nous choisir ?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'Techniciens certifiés', desc: 'Équipe de techniciens formés et certifiés par les principaux constructeurs', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                    { title: 'Réactivité', desc: 'Intervention rapide pour minimiser vos arrêts de production', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { title: 'Toutes marques', desc: 'Expertise sur toutes les marques : Toyota, Jungheinrich, Yale, Linde, etc.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                      <h4 className="text-sm font-bold text-[var(--foreground)] mb-2">{item.title}</h4>
                      <p className="text-[var(--foreground-muted)] text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-[var(--border)] flex flex-wrap justify-center gap-4">
                <Link
                  href="/services/maintenance"
                  className="text-[var(--accent)] font-medium hover:underline text-sm"
                >
                  Voir la page maintenance complète
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[var(--accent)] text-[#1a1a1a] font-extrabold hover:bg-[var(--accent-hover)] rounded"
                >
                  Demander un devis maintenance
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {selectedService === 'reconditionnement' && (
          <div ref={contentRef} className="mt-14 md:mt-20 scroll-mt-8">
            <div className="border-t-4 border-[var(--accent)] bg-white pt-6 px-6 pb-6 min-h-[520px]">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-[var(--accent)] font-semibold text-sm uppercase tracking-wider mb-1">Service</p>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Reconditionnement</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedService(null)
                    window.history.replaceState(null, '', '/services')
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[var(--foreground-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Replier
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)] mb-3 pb-2 border-b border-[var(--border)]">Qu&apos;est-ce que le reconditionnement ?</h3>
                  <p className="text-[var(--foreground-muted)] mb-6 leading-relaxed text-sm">
                    Le reconditionnement est un processus complet de remise à neuf de votre chariot élévateur.
                    Cette opération permet de restaurer les performances d&apos;origine de votre équipement
                    tout en prolongeant sa durée de vie de plusieurs années.
                  </p>
                  <p className="text-[var(--foreground-muted)] text-sm leading-relaxed">
                    Contrairement à une simple réparation, le reconditionnement implique un démontage complet,
                    une inspection approfondie de tous les composants, le remplacement des pièces usées,
                    et une remise en état conforme aux standards du constructeur.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)] mb-4 pb-2 border-b border-[var(--border)]">Processus de reconditionnement</h3>
                  <div className="space-y-4">
                    {[
                      { n: 1, title: 'Diagnostic complet', desc: 'Inspection approfondie de tous les systèmes : moteur, transmission, hydraulique, électrique' },
                      { n: 2, title: 'Démontage et nettoyage', desc: 'Démontage complet, nettoyage et préparation de toutes les pièces' },
                      { n: 3, title: 'Remplacement des pièces', desc: "Remplacement de toutes les pièces usées par des pièces d'origine neuves" },
                      { n: 4, title: 'Remontage et tests', desc: 'Remontage professionnel et tests de conformité selon les standards constructeur' },
                    ].map(({ n, title, desc }) => (
                      <div key={n} className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-white font-bold">
                          {n}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[var(--foreground)] mb-2">{title}</h4>
                          <p className="text-[var(--foreground-muted)] text-sm">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-8 mt-8 mb-8">
                <h3 className="text-base font-bold text-[var(--foreground)] mb-4">Avantages</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'Économique', desc: "Coût jusqu'à 60% inférieur à l'achat d'un équipement neuf" },
                    { title: 'Garantie', desc: "Garantie complète sur le reconditionnement et les pièces installées" },
                    { title: 'Performance', desc: "Performances restaurées aux standards d'origine du constructeur" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-bold text-[var(--foreground)] mb-2">{item.title}</h4>
                      <p className="text-[var(--foreground-muted)] text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-8 mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/services/reconditionnement"
                  className="text-[var(--accent)] font-medium hover:underline text-sm"
                >
                  Voir la page reconditionnement complète
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[var(--accent)] text-[#1a1a1a] font-extrabold hover:bg-[var(--accent-hover)] rounded"
                >
                  Demander un devis reconditionnement
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {selectedService === 'location' && (
          <div ref={contentRef} className="mt-14 md:mt-20 scroll-mt-8">
            <div className="border-t-4 border-[var(--accent)] bg-white pt-6 px-6 pb-6 min-h-[520px]">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-[var(--accent)] font-semibold text-sm uppercase tracking-wider mb-1">Service</p>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Location</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedService(null)
                    window.history.replaceState(null, '', '/services')
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[var(--foreground-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Replier
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)] mb-3 pb-2 border-b border-[var(--border)]">Pourquoi choisir la location ?</h3>
                  <p className="text-[var(--foreground-muted)] mb-6 leading-relaxed text-sm">
                    La location de chariots élévateurs est la solution idéale pour répondre à vos besoins
                    temporaires ou tester un équipement avant achat. Elle vous permet de bénéficier
                    d&apos;équipements performants sans investissement initial.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Pas d'investissement initial",
                      'Flexibilité des durées (courte, moyenne, longue durée)',
                      'Maintenance et réparations incluses',
                      'Équipements récents et entretenus',
                      "Possibilité d'achat en fin de location",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckIcon />
                        <span className="text-[var(--foreground-muted)] text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)] mb-4 pb-2 border-b border-[var(--border)]">Types de location</h3>
                  <div className="space-y-4">
                    <div className="bg-[var(--background-alt)] p-6 shadow-md">
                      <h4 className="text-sm font-bold text-[var(--foreground)] mb-2">Location courte durée</h4>
                      <p className="text-[var(--foreground-muted)] text-sm mb-3">
                        Pour vos besoins ponctuels : quelques jours à quelques semaines
                      </p>
                      <ul className="text-[var(--foreground-muted)] text-sm space-y-1">
                        <li>• Idéal pour les pics d&apos;activité</li>
                        <li>• Dépannage d&apos;urgence</li>
                        <li>• Projets temporaires</li>
                      </ul>
                    </div>
                    <div className="bg-[var(--background-alt)] p-6 shadow-md">
                      <h4 className="text-sm font-bold text-[var(--foreground)] mb-2">Location longue durée</h4>
                      <p className="text-[var(--foreground-muted)] text-sm mb-3">
                        Pour vos besoins récurrents : plusieurs mois à plusieurs années
                      </p>
                      <ul className="text-[var(--foreground-muted)] text-sm space-y-1">
                        <li>• Tarifs préférentiels</li>
                        <li>• Maintenance complète incluse</li>
                        <li>• Option d&apos;achat en fin de contrat</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-8 mt-8 mb-8">
                <h3 className="text-base font-bold text-[var(--foreground)] mb-4">Nos avantages</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: 'Parc varié', desc: "Large gamme d'équipements électriques et thermiques disponibles" },
                    { title: 'Réactivité', desc: 'Mise à disposition rapide selon vos besoins' },
                    { title: 'Maintenance incluse', desc: 'Entretien et réparations pris en charge pendant toute la durée de location' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-bold text-[var(--foreground)] mb-2">{item.title}</h4>
                      <p className="text-[var(--foreground-muted)] text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-8 mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/produits/chariots/location"
                  className="text-[var(--accent)] font-medium hover:underline text-sm"
                >
                  Voir nos chariots disponibles à la location
                </Link>
                <Link
                  href="/demander-chariot?category=chariots-de-location"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[var(--accent)] text-[#1a1a1a] font-extrabold hover:bg-[var(--accent-hover)] rounded"
                >
                  Demander un devis location
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
