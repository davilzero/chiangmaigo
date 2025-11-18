import { NextResponse } from 'next/server'
import { getPaymentProvider } from '@/lib/payments/factory'
import { PaymentGateway } from '@/lib/payments/types'

// Mock checkout - จะเชื่อมต่อ Stripe/Omise/PayPal ภายหลัง
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bookingId, amount, currency = 'THB', gateway = 'omise' } = body || {}

    if (!bookingId || !amount) {
      return NextResponse.json({ error: 'bookingId and amount are required' }, { status: 400 })
    }

    const provider = getPaymentProvider(gateway as PaymentGateway)
    const paymentIntent = await provider.createPaymentIntent({
      bookingId,
      amount,
      currency,
      gateway,
    })

    return NextResponse.json({ paymentIntent })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


