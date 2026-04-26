import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendRentalRequestEmail } from '@/lib/email'
import { sanitizeInput, sanitizeTextarea } from '@/lib/utils'
import { formatLocationDurationFr, isValidIsoDateOnly } from '@/lib/locationRentalDates'

const MOTORISATION_VALUES = ['electrique', 'thermique']

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const chariot_type = sanitizeInput(body.chariot_type) || 'Non spécifié'
    const motorisationRaw = sanitizeInput(body.motorisation)
    const motorisation =
      motorisationRaw && MOTORISATION_VALUES.includes(motorisationRaw)
        ? motorisationRaw
        : 'electrique'
    const capacite_kg = body.capacite_kg != null ? Math.max(0, Math.min(10000, Number(body.capacite_kg) || 0)) : null
    const hauteur_m = body.hauteur_m != null ? Math.max(0, Math.min(20, parseFloat(String(body.hauteur_m)) || 0)) : null
    const ville = sanitizeInput(body.ville) || null

    const startRaw = sanitizeInput(body.location_start)
    const endRaw = sanitizeInput(body.location_end)
    let duree_location: string | null = null

    if (startRaw || endRaw) {
      if (!startRaw || !endRaw) {
        return NextResponse.json(
          { error: 'Indiquez la date de début et la date de fin de location.' },
          { status: 400 }
        )
      }
      if (!isValidIsoDateOnly(startRaw) || !isValidIsoDateOnly(endRaw)) {
        return NextResponse.json({ error: 'Dates invalides.' }, { status: 400 })
      }
      if (endRaw < startRaw) {
        return NextResponse.json(
          { error: 'La date de fin doit être le même jour ou après la date de début.' },
          { status: 400 }
        )
      }
      duree_location = formatLocationDurationFr(startRaw, endRaw)
    } else {
      duree_location = sanitizeInput(body.duree_location) || null
    }
    const type_roues = sanitizeInput(body.type_roues) || null
    const type_mat = sanitizeInput(body.type_mat) || null
    const notes = sanitizeTextarea(body.notes) || null
    const client_name = sanitizeInput(body.client_name)
    const client_phone = sanitizeInput(body.client_phone)

    if (!client_name || client_name.length < 2) {
      return NextResponse.json({ error: 'Nom requis (min. 2 caractères)' }, { status: 400 })
    }
    if (!client_phone || client_phone.length < 6) {
      return NextResponse.json({ error: 'Téléphone requis (min. 6 caractères)' }, { status: 400 })
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
