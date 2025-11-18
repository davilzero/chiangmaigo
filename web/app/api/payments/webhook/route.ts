import { NextResponse } from 'next/server'

// Mock webhook handler - ต่อกับ webhook ของ gateway ในอนาคต
export async function POST(request: Request) {
  try {
    const event = await request.json()

    // TODO: verify signature with gateway secret
    // const signature = request.headers.get('stripe-signature') || ''
    // verify...

    // ตัวอย่างอีเวนต์
    switch (event.type) {
      case 'payment.succeeded':
        // TODO: อัปเดต booking paymentStatus = 'paid'
        break
      case 'payment.failed':
        // TODO: อัปเดต booking paymentStatus = 'failed'
        break
      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


