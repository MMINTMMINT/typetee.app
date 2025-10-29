import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      shirtColor,
      size,
      mode,
      text,
      asciiArt,
      font,
      textSize,
      placement,
      shippingInfo,
    } = body
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Custom ${shirtColor.toUpperCase()} T-Shirt - ${size}`,
              description: `${mode.toUpperCase()} design on ${placement}`,
            },
            unit_amount: 2999, // $29.99
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      metadata: {
        shirtColor,
        size,
        mode,
        text,
        asciiArt: mode === 'ascii' ? asciiArt : '',
        font,
        textSize: textSize.toString(),
        placement,
        shippingEmail: shippingInfo.email,
        shippingName: shippingInfo.name,
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        shippingState: shippingInfo.state,
        shippingZip: shippingInfo.zip,
        shippingCountry: shippingInfo.country,
      },
    })
    
    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
