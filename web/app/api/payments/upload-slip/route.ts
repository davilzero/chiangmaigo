import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const slip = formData.get('slip') as File
    const bookingId = formData.get('bookingId') as string
    const amount = formData.get('amount') as string
    const paymentMethod = formData.get('paymentMethod') as string

    if (!slip) {
      return NextResponse.json(
        { error: 'กรุณาอัปโหลดสลิปการโอนเงิน' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(slip.type)) {
      return NextResponse.json(
        { error: 'รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG) หรือ PDF เท่านั้น' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (slip.size > maxSize) {
      return NextResponse.json(
        { error: 'ขนาดไฟล์ต้องไม่เกิน 5MB' },
        { status: 400 }
      )
    }

    // TODO: In production, upload to cloud storage (S3, GCS, etc.)
    // For now, we'll just return a mock response
    const mockSlipUrl = `https://example.com/slips/${Date.now()}-${slip.name}`

    // TODO: Save slip info to database
    // await prisma.paymentSlip.create({
    //   data: {
    //     bookingId,
    //     slipUrl: mockSlipUrl,
    //     fileName: slip.name,
    //     fileSize: slip.size,
    //     fileType: slip.type,
    //     paymentMethod,
    //     amount: parseFloat(amount),
    //     status: 'PENDING_REVIEW',
    //   }
    // })

    return NextResponse.json({
      success: true,
      message: 'อัปโหลดสลิปสำเร็จ',
      slipUrl: mockSlipUrl,
      bookingId,
      status: 'PENDING_REVIEW',
    })
  } catch (error) {
    console.error('Upload slip error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปโหลดสลิป' },
      { status: 500 }
    )
  }
}

