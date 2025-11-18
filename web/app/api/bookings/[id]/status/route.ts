import { NextResponse } from 'next/server'

// Mock status update - ภายหลังเชื่อมต่อ Prisma
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, paymentStatus } = await request.json()
    if (!status && !paymentStatus) {
      return NextResponse.json(
        { error: 'status or paymentStatus required' },
        { status: 400 }
      )
    }

    // TODO: อัปเดตในฐานข้อมูลด้วย Prisma
    const updated = {
      id: params.id,
      status: status || 'confirmed',
      paymentStatus: paymentStatus || 'paid',
    }

    return NextResponse.json({ booking: updated })
  } catch (error) {
    console.error('Update booking status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}



