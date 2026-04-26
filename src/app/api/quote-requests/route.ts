import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendQuoteRequestEmail } from '@/lib/email'
import { allowPublicApiRequest } from '@/lib/rateLimit'
import { sanitizeQuoteCustomData } from '@/lib/sanitizeQuoteCustomData'
import { sanitizeInput, sanitizeTextarea, isValidEmail } from '@/lib/utils'
import { isValidDevisType } from '@/lib/devisTypes'

export async function POST(request: Request) {
  try {
    if (!allowPublicApiRequest(request, 'quote')) {
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
    const product = body.product ? sanitizeInput(body.product) : null
    const customData = body.customData
    const devisTypeRaw = body.devisType != null ? sanitizeInput(String(body.devisType)) : null
    const devisType = devisTypeRaw && isValidDevisType(devisTypeRaw) ? devisTypeRaw : null

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
        { error: "Format d'email invalide" },
        { status: 400 }
      )
    }
    if (!message || message.length < 10) {
      return NextResponse.json(
        { error: 'Message requis (min. 10 caractères)' },
        { status: 400 }
      )
    }

    const mergedCustom = sanitizeQuoteCustomData(customData, devisType)

    const quote = await prisma.quoteRequest.create({
      data: {
        name,
        email,
        message,
        company: company || undefined,
        phone: phone || undefined,
        product: product || undefined,
        ...(Object.keys(mergedCustom).length > 0 ? { customData: mergedCustom as object } : {}),
      },
    })

    await sendQuoteRequestEmail(quote).catch((err) => {
      console.error('Quote request email notification failed:', err)
    })

    return NextResponse.json({ success: true, id: quote.id })
  } catch (error) {
    console.error('Quote request error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement' },
      { status: 500 }
    )
  }
}
