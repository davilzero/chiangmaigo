'use client'

import { useState } from 'react'
import { Mail, Phone, MessageSquare, HelpCircle, Clock, MapPin, Loader2, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function SupportPage() {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setSuccess(null)
    setError(null)
    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      const res = await fetch('/api/support', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('ส่งข้อความไม่สำเร็จ')
      setSuccess('ส่งข้อความเรียบร้อย ทีมงานจะติดต่อกลับทางอีเมล')
      form.reset()
    } catch (err: any) {
      setError(err?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <HelpCircle className="w-12 h-12 text-primary-600 mx-auto mb-3" />
          <h1 className="text-4xl font-bold mb-3">ศูนย์ช่วยเหลือ</h1>
          <p className="text-neutral-600">
            หากคุณพบปัญหาในการใช้งานหรือมีข้อสงสัยเกี่ยวกับการจอง/การชำระเงิน ทีมงานพร้อมช่วยเหลือคุณ
          </p>
        </div>

        {/* Quick Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link href="/faq" className="card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-6 h-6 text-primary-600" />
              <div>
                <h3 className="font-semibold mb-1">คำถามที่พบบ่อย</h3>
                <p className="text-sm text-neutral-600">ค้นหาคำตอบได้อย่างรวดเร็ว</p>
              </div>
            </div>
          </Link>

          <a href="/user/messages" className="card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <MessageSquare className="w-6 h-6 text-primary-600" />
              <div>
                <h3 className="font-semibold mb-1">แชทกับทีมงาน</h3>
                <p className="text-sm text-neutral-600">สอบถามสถานะการจองหรือปัญหาการใช้งาน</p>
              </div>
            </div>
          </a>

          <div className="card">
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-primary-600" />
              <div>
                <h3 className="font-semibold mb-1">เวลาให้บริการ</h3>
                <p className="text-sm text-neutral-600">ทุกวัน 09:00 - 18:00 น. (GMT+7)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <div className="card lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">ติดต่อเรา</h2>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="font-medium">อีเมล</p>
                  <p className="text-neutral-600">support@chiangmaigo.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="font-medium">โทร</p>
                  <p className="text-neutral-600">02-123-4567</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="font-medium">ที่อยู่</p>
                  <p className="text-neutral-600">เชียงใหม่, ประเทศไทย</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Form */}
          <div className="card lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">ส่งคำถาม/รายงานปัญหา</h2>
            {success && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded bg-green-50 border border-green-200 text-green-700 text-sm">
                <CheckCircle className="w-4 h-4" /> {success}
              </div>
            )}
            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
                <XCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ชื่อ-นามสกุล</label>
                  <input name="name" className="input" type="text" placeholder="ชื่อ นามสกุล" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">อีเมล</label>
                  <input name="email" className="input" type="email" placeholder="you@example.com" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">หัวข้อ</label>
                <input name="subject" className="input" type="text" placeholder="หัวข้อคำถาม" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">รายละเอียด</label>
                <textarea name="message" className="input" rows={5} placeholder="อธิบายปัญหาหรือคำถามของคุณ" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ประเภท</label>
                  <select name="type" className="input" defaultValue="question" required>
                    <option value="question">คำถามทั่วไป</option>
                    <option value="booking">ปัญหาการจอง</option>
                    <option value="payment">ปัญหาการชำระเงิน</option>
                    <option value="account">บัญชีผู้ใช้</option>
                    <option value="other">อื่นๆ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">แนบไฟล์ (ถ้ามี)</label>
                  <input name="attachment" className="input" type="file" accept="image/*,.pdf" />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn-primary flex items-center gap-2" disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}


