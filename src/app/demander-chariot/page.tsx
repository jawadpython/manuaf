import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'
import { PageHero } from '@/components/layout/PageHero'
import { getFormFieldsForLocation } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Demander un devis',
  description:
    'Demandez un devis personnalisé pour vos chariots élévateurs ou pièces de rechange. MANUAF répond sous 24h.',
}

export default async function DemanderChariotPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; category?: string }>
}) {
  const params = await searchParams
  const product = params.product ? decodeURIComponent(params.product) : ''
  const category = params.category ? decodeURIComponent(params.category) : ''

  const initialFormFields =
    category === 'chariots-de-location' ? await getFormFieldsForLocation() : undefined

  let initialMessage = ''
  if (product) {
    initialMessage = `Je souhaite obtenir un devis pour le produit suivant : ${product}.\n\n`
  }
  if (category) {
    initialMessage += `Catégorie concernée : ${category}.\n\n`
  }
  if (initialMessage) {
    initialMessage += 'Merci de me recontacter avec les détails et conditions.'
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <PageHero
        label="Demande de devis"
        title="Demander un devis"
        subtitle="Remplissez le formulaire et notre équipe vous répondra sous 24h"
        image="/images/contact.webp"
      />

      <section className="py-10 md:py-16">
        <div
          className={`mx-auto px-4 sm:px-6 ${
            category === 'chariots-de-location' ? 'max-w-5xl' : 'max-w-3xl'
          }`}
        >
          <div
            className={`bg-white border-t-4 border-[var(--accent)] shadow-lg ${
              category === 'chariots-de-location'
                ? 'p-6 sm:p-8 md:p-10 rounded-xl'
                : 'p-5 sm:p-6 md:p-8'
            }`}
          >
            <h3
              className={`font-bold text-[#333333] mb-6 ${
                category === 'chariots-de-location' ? 'text-xl md:text-2xl' : 'text-lg'
              }`}
            >
              Demande de devis {category === 'chariots-de-location' && '— Location'}
            </h3>
            <ContactForm
              initialMessage={initialMessage}
              productName={product || undefined}
              formContext={category === 'chariots-de-location' ? category : undefined}
              initialFormFields={initialFormFields}
              variant={category === 'chariots-de-location' ? 'location' : 'default'}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
