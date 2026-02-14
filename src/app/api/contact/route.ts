import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, phone, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    // En production : envoyer l'email via un service (Resend, SendGrid, etc.)
    // Pour l'instant, on simule un envoi réussi
    // In production, replace this with actual email sending service
    if (process.env.NODE_ENV === 'development') {
      console.log('Contact form submission:', { name, email, company, phone, message })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
