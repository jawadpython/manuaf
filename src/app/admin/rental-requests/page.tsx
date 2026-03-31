import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demandes de devis - Administration',
}

/** Ancienne URL « Demandes de location » — tout est centralisé sous les demandes de devis. */
export default function AdminRentalRequestsRedirectPage() {
  redirect('/admin/quote-requests')
}
