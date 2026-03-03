import { NextResponse } from 'next/server'
import { sanitizeInput, sanitizeTextarea, isValidEmail } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = sanitizeInput(body.name)
    const email = sanitizeInput(body.email)
    const company = body.company ? sanitizeInput(body.company) : null
    const phone = body.phone ? sanitizeInput(body.phone) : null
    const message = sanitizeTextarea(body.message)

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: 'Nom requis (min. 2 caractères)' },
        { status: 400 }
      )
    }
    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      )
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }
    if (!message || message.length < 10) {
      return NextResponse.json(
        { error: 'Message requis (min. 10 caractères)' },
        { status: 400 }
      )
    }

    // En production : envoyer l'email via un service (Resend, SendGrid, etc.)
    // Pour l'instant, on simule un envoi réussi
    // In production, replace this with actual email sending service
    if (process.env.NODE_ENV === 'development') {
      console.log('Contact form submission:', { name, email, company, phone, message })
    }

    return NextResponse.json({ success: true, message: 'Message envoyé' })
  } catch {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
