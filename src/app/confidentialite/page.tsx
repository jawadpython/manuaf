import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
}

export default function ConfidentialitePage() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <PageHero
        title="Politique de confidentialité"
        imageIndex={9}
      />

      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white p-8 md:p-12 border-t-4 border-[var(--accent)]">
            <div className="text-[#666666] space-y-6">
              <p>
                MANUAF s&apos;engage à protéger les données personnelles des
                utilisateurs de ce site. Les informations collectées via le formulaire
                de contact sont utilisées uniquement pour répondre à vos demandes.
              </p>
              <p>
                Conformément à la législation marocaine sur la protection des données personnelles 
                (Loi 09-08), vous disposez d&apos;un droit d&apos;accès,
                de rectification et de suppression de vos données. Contactez-nous
                à Contact@manuaf.com pour exercer ces droits.
              </p>
              <p>
                Aucune donnée personnelle n&apos;est cédée à des tiers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
