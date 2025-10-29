import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { createPrintifyOrder } from '@/lib/printify'

export async function POST(request: NextRequest) {
  // Initialize Stripe at request time, not module load time
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
  })

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Webhook signature verification failed:', errorMessage)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  
  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    try {
      // Extract metadata
      const metadata = session.metadata!
      
      // Create order on Printify
      const printifyOrder = await createPrintifyOrder({
        shirtColor: metadata.shirtColor,
        size: metadata.size,
        mode: metadata.mode,
        text: metadata.text,
        asciiArt: metadata.asciiArt,
        font: metadata.font,
        textSize: parseInt(metadata.textSize, 10),
        placement: metadata.placement,
        shippingInfo: {
          email: metadata.shippingEmail,
          name: metadata.shippingName,
          address: metadata.shippingAddress,
          city: metadata.shippingCity,
          state: metadata.shippingState,
          zip: metadata.shippingZip,
          country: metadata.shippingCountry,
        },
      })
      
      // Send confirmation email
      await sendOrderConfirmationEmail({
        email: metadata.shippingEmail,
        name: metadata.shippingName,
        orderId: session.id,
        printifyOrderId: printifyOrder.id,
        design: {
          mode: metadata.mode,
          text: metadata.text,
          asciiArt: metadata.asciiArt,
          font: metadata.font,
          placement: metadata.placement,
        },
        shirtColor: metadata.shirtColor,
        size: metadata.size,
      })
      
      console.log('Order processed successfully:', session.id)
    } catch (error) {
      console.error('Error processing order:', error)
      // You might want to implement retry logic or manual intervention here
    }
  }
  
  return NextResponse.json({ received: true })
}
