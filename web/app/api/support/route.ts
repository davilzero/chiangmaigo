import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let payload: any = {}

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData()
      payload = {
        name: form.get('name') || '',
        email: form.get('email') || '',
        subject: form.get('subject') || '',
        message: form.get('message') || '',
        type: form.get('type') || 'question',
        // ในเดโมนี้เราจะไม่เก็บไฟล์แนบจริง
      }
    } else {
      payload = await request.json()
    }

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 })
    }

    // เดโม: บันทึกลง memory เทียม (สำหรับ production ควรบันทึก DB หรือส่งอีเมล)
    // เราจะเพียงส่งกลับ id จำลอง
    const ticketId = `sp_${Date.now()}`

    return NextResponse.json({ ok: true, ticketId })
  } catch (error) {
    console.error('Support submit error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}


