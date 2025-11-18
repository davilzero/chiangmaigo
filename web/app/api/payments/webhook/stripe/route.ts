import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('stripe-signature') || ''
    // TODO: ตรวจลายเซ็นด้วย STRIPE_WEBHOOK_SECRET และสร้าง event
    // const event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    // Mock handle
    console.log('Stripe webhook received', { signature, length: payload.length })
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 })
  }
}



