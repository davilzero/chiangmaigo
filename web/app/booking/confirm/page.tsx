'use client'

import Link from 'next/link'
import { useMemo, useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Calendar, Users, Package as PackageIcon, CreditCard } from 'lucide-react'
import { useMonetizationStore } from '@/lib/store/monetizationStore'
import { useAuthStore } from '@/lib/store/authStore'

function BookingConfirmContent() {
  const search = useSearchParams()
  const router = useRouter()
  const [agree, setAgree] = useState(false)
  const { convenienceFeeFlatTHB, loadFromStorage } = useMonetizationStore()
  const { user, isAuthenticated } = useAuthStore()
  
  // Guest information state
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: '',
  })
  
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'promptpay' | 'bank'>('card')

  // Load guest info from sessionStorage (temporary) or localStorage (persistent)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if there's a booking in progress in sessionStorage
      const bookingInProgress = sessionStorage.getItem('booking-in-progress')
      
      // Only load guest info if there's no completed booking
      if (!bookingInProgress) {
        const saved = sessionStorage.getItem('guest-info') || localStorage.getItem('guest-info')
        if (saved) {
          setGuestInfo(JSON.parse(saved))
        }
      } else {
        // Clear form if booking was completed
        setGuestInfo({ name: '', email: '', phone: '' })
        setAgree(false)
        sessionStorage.removeItem('booking-in-progress')
      }
    }
  }, [])

  // Load user info if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setGuestInfo({
        name: user.name || '',
        email: user.email || '',
        phone: '',
      })
    }
  }, [isAuthenticated, user])

  // ensure settings loaded on first render
  useMemo(() => {
    loadFromStorage()
    return undefined
  }, [loadFromStorage])

  const bookingData = useMemo(() => {
    const name = search.get('name') || 'บริการ'
    const packageName = search.get('packageName') || 'แพ็คเกจพื้นฐาน'
    const unitPrice = Number(search.get('unitPrice') || '0')
    const date = search.get('date') || ''
    const people = Number(search.get('people') || '1')
    const notes = search.get('notes') || ''
    const total = Number(search.get('total') || String(unitPrice * people))
    const id = search.get('id') || ''
    return {
      service: { id, name },
      package: { name: packageName, price: unitPrice },
      date,
      numberOfPeople: people,
      specialRequirements: notes,
      subtotal: total,
      tax: 0,
      total,
    }
  }, [search])

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">ยืนยันการจอง</h1>
          
          <div className="space-y-6">
            {/* Service Summary */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">รายละเอียดบริการ</h2>
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-neutral-200 rounded-lg"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{bookingData.service.name}</h3>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>วันที่: {new Date(bookingData.date).toLocaleDateString('th-TH')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>จำนวนคน: {bookingData.numberOfPeople} คน</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PackageIcon className="w-4 h-4" />
                      <span>แพ็คเกจ: {bookingData.package.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">ข้อมูลติดต่อ</h2>
              {!isAuthenticated && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    💡 คุณกำลังจองแบบ Guest ไม่จำเป็นต้องสมัครสมาชิก แต่เราขอแนะนำให้{' '}
                    <Link href="/register" className="font-semibold underline">
                      สมัครสมาชิก
                    </Link>{' '}
                    เพื่อรับสิทธิพิเศษและสะดวกในการจัดการการจอง
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={guestInfo.name}
                    onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                    required
                    placeholder="ชื่อ นามสกุล"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    อีเมล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="input"
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                    required
                    placeholder="your@email.com"
                    disabled={isAuthenticated}
                  />
                  {isAuthenticated && (
                    <p className="text-xs text-neutral-500 mt-1">อีเมลจากบัญชีของคุณ</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className="input"
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                    required
                    placeholder="0812345678"
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Summary */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">สรุปการชำระเงิน</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>ราคาแพ็คเกจ</span>
                  <span>฿{bookingData.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>ค่าธรรมเนียมระบบ</span>
                  <span>฿{convenienceFeeFlatTHB.toLocaleString()}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>ยอดรวม</span>
                    <span className="text-primary-600">
                      ฿{(bookingData.total + convenienceFeeFlatTHB).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">วิธีการชำระเงิน</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:bg-neutral-50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="w-4 h-4"
                  />
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium">บัตรเครดิต/เดบิต</p>
                      <p className="text-sm text-neutral-600">Visa, Mastercard, JCB</p>
                    </div>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'promptpay' ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:bg-neutral-50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="promptpay"
                    checked={paymentMethod === 'promptpay'}
                    onChange={() => setPaymentMethod('promptpay')}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">พร้อมเพย์</p>
                    <p className="text-sm text-neutral-600">สแกน QR Code เพื่อชำระเงิน</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'bank' ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:bg-neutral-50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">โอนเงินผ่านธนาคาร</p>
                    <p className="text-sm text-neutral-600">ชำระเงินผ่านบัญชีธนาคาร</p>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Terms and Conditions */}
            <div className="card">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="rounded mt-1"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span className="text-sm">
                  ฉันยอมรับ{' '}
                  <Link href="/terms" className="text-primary-600 hover:underline">
                    ข้อกำหนดและเงื่อนไข
                  </Link>{' '}
                  และ{' '}
                  <Link href="/privacy" className="text-primary-600 hover:underline">
                    นโยบายการคืนเงิน
                  </Link>
                </span>
              </label>
              {!agree && (
                <p className="text-xs text-red-600 mt-2">กรุณายอมรับข้อกำหนดและเงื่อนไขก่อนดำเนินการต่อ</p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button onClick={() => router.back()} className="btn-secondary flex-1 text-center">
                ย้อนกลับ
              </button>
              <button
                disabled={!agree || !guestInfo.name || !guestInfo.email || !guestInfo.phone}
                onClick={() => {
                  if (!agree || !guestInfo.name || !guestInfo.email || !guestInfo.phone) return
                  
                  // Save guest info to sessionStorage (temporary) for this booking session
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem('guest-info', JSON.stringify(guestInfo))
                    sessionStorage.setItem('booking-in-progress', 'true')
                  }
                  
                  // Pass guest info and payment method to payment page
                  const params = new URLSearchParams({
                    serviceId: bookingData.service.id,
                    serviceName: bookingData.service.name,
                    packageName: bookingData.package.name,
                    date: bookingData.date,
                    people: String(bookingData.numberOfPeople),
                    total: String(bookingData.total + convenienceFeeFlatTHB),
                    guestName: guestInfo.name,
                    guestEmail: guestInfo.email,
                    guestPhone: guestInfo.phone,
                    isGuest: String(!isAuthenticated),
                    paymentMethod: paymentMethod,
                  })
                  
                  router.push(`/booking/payment?${params.toString()}`)
                }}
                className="btn-primary flex-1 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                aria-disabled={!agree || !guestInfo.name || !guestInfo.email || !guestInfo.phone}
              >
                ดำเนินการชำระเงิน
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">กำลังโหลด...</p>
        </div>
      </div>
    }>
      <BookingConfirmContent />
    </Suspense>
  )
}

