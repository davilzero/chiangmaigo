import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('x-omise-signature') || ''
    // TODO: ตรวจลายเซ็นด้วย OMISE_SECRET_KEY หรือ webhook secret (ถ้ามี)
    console.log('Omise webhook received', { signature, length: payload.length })
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Omise webhook error:', error)
    return NextResponse.json({ error: 'Invalid webhook' }, { status: 400 })
  }
}



