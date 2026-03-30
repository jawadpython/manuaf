import Link from 'next/link'
import { ContactForm } from '@/components/contact/ContactForm'
import { PageHero } from '@/components/layout/PageHero'
import { getFormFieldsForLocation } from '@/lib/data'
import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Demander un devis | Location chariots Casablanca',
  description:
    "Devis personnalisé location ou vente chariots élévateurs. MANUAF Casablanca, réponse sous 24h.",
  canonical: '/demander-chariot',
})

export default async function DemanderChariotPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; category?: string }>
}) {
  const params = await searchParams
  const product = params.product ? decodeURIComponent(params.product) : ''
  const category = params.category ? decodeURIComponent(params.category) : ''

  const isRentalLocationForm =
    category === 'chariots-de-location' || category === 'nacelles-de-location'

  const initialFormFields = isRentalLocationForm ? await getFormFieldsForLocation() : undefined

  const categoryLabel =
    category === 'nacelles-de-location'
      ? 'Nacelles de location'
      : category === 'chariots-de-location'
        ? 'Chariots de location'
        : category

  let initialMessage = ''
  if (product) {
    initialMessage = `Je souhaite obtenir un devis pour le produit suivant : ${product}.\n\n`
  }
  if (category) {
    initialMessage += `Catégorie concernée : ${categoryLabel}.\n\n`
  }
  if (initialMessage) {
    initialMessage += 'Merci de me recontacter avec les détails et conditions.'
  }

  const heroSubtitle = product
    ? `Produit concerné : ${product}. Complétez le formulaire — notre équipe vous répondra sous 24h.`
    : 'Remplissez le formulaire et notre équipe vous répondra sous 24h'

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <PageHero
        label="Demande de devis"
        title="Demander un devis"
        subtitle={heroSubtitle}
        image="/images/contact.webp"
      />

      <section className="py-10 md:py-16">
        <div
          className={`mx-auto px-4 sm:px-6 ${
            isRentalLocationForm ? 'max-w-5xl' : 'max-w-3xl'
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
              className={`font-bold text-[#333333] mb-4 ${
                isRentalLocationForm ? 'text-xl md:text-2xl' : 'text-lg'
              }`}
            >
              Demande de devis {isRentalLocationForm && '— Location'}
            </h3>
            <p className="text-[#666666] text-sm mb-6">
              Pour toute autre question ou demande d&apos;information,{' '}
              <Link href="/contact" className="text-[var(--accent)] font-medium hover:underline">
                contactez-nous directement
              </Link>
              .
            </p>
            <ContactForm
              initialMessage={initialMessage}
              productName={product || undefined}
              formContext={isRentalLocationForm ? category : undefined}
              initialFormFields={initialFormFields}
              variant={isRentalLocationForm ? 'location' : 'default'}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
