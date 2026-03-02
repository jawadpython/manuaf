import type { RentalRequest } from '@prisma/client'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL || 'contact@manuaf.com'

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
  } else if (process.env.SMTP_HOST) {
    // Optional: nodemailer if SMTP configured
    console.log('Email (SMTP not implemented, log only):', subject)
    console.log(body)
  } else {
    console.log('[MANUAF] Rental request:', subject)
    console.log(body)
  }
}
