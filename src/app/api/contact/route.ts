import { NextResponse } from 'next/server'
import { sendContactFormEmail } from '@/lib/email'
import { allowPublicApiRequest } from '@/lib/rateLimit'
import { sanitizeInput, sanitizeTextarea, isValidEmail } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    if (!allowPublicApiRequest(request, 'contact')) {
      return NextResponse.json(
        { error: 'Trop de demandes. Réessayez dans quelques minutes.' },
        { status: 429 }
      )
    }

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

    try {
      await sendContactFormEmail({ name, email, company, phone, message })
    } catch (err) {
      console.error('Contact form email failed:', err)
      if (process.env.RESEND_API_KEY) {
        return NextResponse.json(
          { error: 'Impossible d\'envoyer le message pour le moment. Réessayez plus tard ou appelez-nous.' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json({ success: true, message: 'Message envoyé' })
  } catch {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
