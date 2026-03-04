import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import { Providers } from './providers'
import { ConditionalLayout } from '@/components/layout/ConditionalLayout'
import { SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/seo'
import './globals.css'

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const defaultDescription =
  "MANUAF, référence intralogistique au Maroc. Location de chariots élévateurs à Casablanca, vente, maintenance, pièces. Transpalettes, nacelles."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MANUAF | Location chariots élévateurs Casablanca - Intralogistique Maroc',
    template: '%s | MANUAF',
  },
  description: defaultDescription,
  keywords: [
    'location chariots élévateurs Casablanca',
    'forklift rental Casablanca',
    'chariot élévateur',
    'manutention',
    'intralogistique',
    'Maroc',
    'transpalette',
    'nacelle',
    'pièces de rechange',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    url: SITE_URL,
    siteName: 'MANUAF',
    title: 'MANUAF | Location chariots élévateurs Casablanca - Intralogistique Maroc',
    description: defaultDescription,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'MANUAF Intralogistique' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MANUAF | Location chariots élévateurs Casablanca',
    description: defaultDescription,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${bebas.variable} ${inter.variable} antialiased`}>
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  )
}
