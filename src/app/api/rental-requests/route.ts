import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendRentalRequestEmail } from '@/lib/email'

const MOTORISATION_VALUES = ['electrique', 'thermique']

function sanitize(str: unknown): string {
  if (str == null || typeof str !== 'string') return ''
  return str.trim().slice(0, 500)
}

function sanitizeTextarea(str: unknown): string {
  if (str == null || typeof str !== 'string') return ''
  return str.trim().slice(0, 2000)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const chariot_type = sanitize(body.chariot_type) || 'Non spécifié'
    const motorisation = sanitize(body.motorisation)
    const capacite_kg = body.capacite_kg != null ? Math.max(0, Math.min(10000, Number(body.capacite_kg) || 0)) : null
    const hauteur_m = body.hauteur_m != null ? Math.max(0, Math.min(20, parseFloat(String(body.hauteur_m)) || 0)) : null
    const ville = sanitize(body.ville) || null
    const duree_location = sanitize(body.duree_location) || null
    const type_roues = sanitize(body.type_roues) || null
    const type_mat = sanitize(body.type_mat) || null
    const notes = sanitizeTextarea(body.notes) || null
    const client_name = sanitize(body.client_name)
    const client_phone = sanitize(body.client_phone)

    if (!client_name || client_name.length < 2) {
      return NextResponse.json({ error: 'Nom requis (min. 2 caractères)' }, { status: 400 })
    }
    if (!client_phone || client_phone.length < 6) {
      return NextResponse.json({ error: 'Téléphone requis (min. 6 caractères)' }, { status: 400 })
    }
    if (!motorisation || !MOTORISATION_VALUES.includes(motorisation)) {
      return NextResponse.json({ error: 'Motorisation invalide' }, { status: 400 })
    }

    const rental = await prisma.rentalRequest.create({
      data: {
        chariot_type,
        motorisation,
        capacite_kg: capacite_kg && capacite_kg > 0 ? capacite_kg : null,
        hauteur_m: hauteur_m != null && hauteur_m > 0 ? hauteur_m : null,
        ville,
        duree_location,
        type_roues,
        type_mat,
        notes,
        client_name,
        client_phone,
        status: 'new',
      },
    })

    await sendRentalRequestEmail(rental).catch((err) => {
      console.error('Email notification failed:', err)
    })

    return NextResponse.json({ success: true, id: rental.id })
  } catch (error) {
    console.error('Rental request error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
