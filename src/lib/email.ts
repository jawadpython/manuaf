import type { QuoteRequest, RentalRequest } from '@prisma/client'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL || 'contact@manuaf.com'

async function deliverAdminNotification(subject: string, body: string): Promise<void> {
  if (process.env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: ADMIN_EMAIL,
        subject,
        text: body,
      }),
    })
    if (!res.ok) throw new Error(`Resend API error: ${await res.text()}`)
    return
  }
  if (process.env.SMTP_HOST) {
    console.log('Email (SMTP not implemented, log only):', subject)
    console.log(body)
    return
  }
  console.log('[MANUAF]', subject)
  console.log(body)
}

export async function sendRentalRequestEmail(rental: RentalRequest): Promise<void> {
  const subject = `[MANUAF] Nouvelle demande de location - ${rental.client_name}`
  const body = `
Nouvelle demande de location de chariot

Type chariot: ${rental.chariot_type}
Motorisation: ${rental.motorisation}
Capacité (kg): ${rental.capacite_kg ?? '-'}
Hauteur (m): ${rental.hauteur_m ?? '-'}
Ville: ${rental.ville ?? '-'}
Durée: ${rental.duree_location ?? '-'}
Type roues: ${rental.type_roues ?? '-'}
Type mât: ${rental.type_mat ?? '-'}

Client: ${rental.client_name}
Téléphone: ${rental.client_phone}

Notes:
${rental.notes ?? '-'}

---
ID: ${rental.id}
Date: ${rental.createdAt.toISOString()}
`.trim()

  await deliverAdminNotification(subject, body)
}

export async function sendContactFormEmail(payload: {
  name: string
  email: string
  company: string | null
  phone: string | null
  message: string
}): Promise<void> {
  const subject = `[MANUAF] Contact site - ${payload.name}`
  const body = `
Message depuis le formulaire Contact

Nom: ${payload.name}
Email: ${payload.email}
Société: ${payload.company ?? '-'}
Téléphone: ${payload.phone ?? '-'}

Message:
${payload.message}
`.trim()

  await deliverAdminNotification(subject, body)
}

export async function sendQuoteRequestEmail(quote: QuoteRequest): Promise<void> {
  const subject = `[MANUAF] Demande de devis - ${quote.name}`
  let customBlock = '-'
  if (quote.customData && typeof quote.customData === 'object' && !Array.isArray(quote.customData)) {
    customBlock = Object.entries(quote.customData as Record<string, unknown>)
      .map(([k, v]) => `${k}: ${v == null ? '-' : String(v)}`)
      .join('\n')
  }
  const body = `
Nouvelle demande de devis

Nom: ${quote.name}
Email: ${quote.email}
Société: ${quote.company ?? '-'}
Téléphone: ${quote.phone ?? '-'}
Produit / contexte: ${quote.product ?? '-'}

Message:
${quote.message}

Champs personnalisés:
${customBlock}

---
ID: ${quote.id}
Date: ${quote.createdAt.toISOString()}
`.trim()

  await deliverAdminNotification(subject, body)
}
