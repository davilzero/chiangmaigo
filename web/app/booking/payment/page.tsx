'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2, Upload, X, FileImage } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useMonetizationStore } from '@/lib/store/monetizationStore'
import { useAuthStore } from '@/lib/store/authStore'
import { addNotification } from '@/lib/utils/notifications'
import { mockServices } from '@/lib/mock/services'

function PaymentContent() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed' | null>(null)
  const [gateway, setGateway] = useState<'omise' | 'stripe'>('omise')
  const search = useSearchParams()
  const { loadFromStorage } = useMonetizationStore()
  const [paymentSettings, setPaymentSettings] = useState<any>(null)
  const [paymentSlip, setPaymentSlip] = useState<string | null>(null) // Store image URL
  const [paymentSlipFile, setPaymentSlipFile] = useState<File | null>(null) // Store file object

  const paymentMethod = (search.get('paymentMethod') || 'card') as 'card' | 'promptpay' | 'bank'

  // Load payment settings from localStorage
  useEffect(() => {
    loadFromStorage()
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin-payment-settings')
      if (saved) {
        setPaymentSettings(JSON.parse(saved))
      }
    }
  }, [loadFromStorage])

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        alert('กรุณาอัปโหลดไฟล์รูปภาพ (JPG, PNG) หรือ PDF เท่านั้น')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('ขนาดไฟล์ต้องไม่เกิน 5MB')
        return
      }
      
      setPaymentSlipFile(file)
      // Create preview URL
      if (file.type.startsWith('image/')) {
        setPaymentSlip(URL.createObjectURL(file))
      } else {
        // For PDF, we'll just store the file name
        setPaymentSlip(file.name)
      }
    }
  }

  const removeSlip = () => {
    if (paymentSlip && paymentSlip.startsWith('blob:')) {
      URL.revokeObjectURL(paymentSlip)
    }
    setPaymentSlip(null)
    setPaymentSlipFile(null)
  }

  const handlePayment = async () => {
    // For promptpay and bank transfer, require slip upload
    if ((paymentMethod === 'promptpay' || paymentMethod === 'bank') && !paymentSlipFile) {
      alert('กรุณาอัปโหลดสลิปการโอนเงินก่อนดำเนินการต่อ')
      return
    }

    setPaymentStatus('processing')
    try {
      if (paymentMethod === 'card') {
        // Card payment
        const res = await fetch('/api/payments/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: 'demo-booking-1',
            amount: Number(search.get('total') || '0'),
            currency: 'THB',
            gateway,
          }),
        })
        if (!res.ok) throw new Error('checkout failed')
        const data = await res.json()
        setPaymentStatus('success')
      } else {
        // PromptPay or Bank Transfer - upload slip first
        if (paymentSlipFile) {
          const formData = new FormData()
          formData.append('slip', paymentSlipFile)
          formData.append('bookingId', 'demo-booking-1')
          formData.append('amount', String(search.get('total') || '0'))
          formData.append('paymentMethod', paymentMethod)
          
          const res = await fetch('/api/payments/upload-slip', {
            method: 'POST',
            body: formData,
          })
          
          if (!res.ok) throw new Error('upload failed')
          
          // Simulate success after upload
          setTimeout(() => {
            setPaymentStatus('success')
          }, 1500)
        }
      }
    } catch (e) {
      setPaymentStatus('failed')
    }
  }

  const isGuest = search.get('isGuest') === 'true'
  const guestName = search.get('guestName') || ''
  const guestEmail = search.get('guestEmail') || ''

  if (paymentStatus === 'success') {
    // บันทึกการจองล่าสุดลง localStorage (เดโม)
    const serviceId = search.get('serviceId') || ''
    const serviceName = search.get('serviceName') || 'บริการ'
    const packageName = search.get('packageName') || 'แพ็คเกจพื้นฐาน'
    const date = search.get('date') || ''
    const people = Number(search.get('people') || '1')
    const total = Number(search.get('total') || '0')
    const svc = mockServices.find((s) => s.id === serviceId || s.name === serviceName)
    const category = svc?.category || 'ทั้งหมด'
    
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('user-bookings')
      const list = existing ? JSON.parse(existing) : []
      // Calculate convenience fee
      const convenienceFee = typeof window !== 'undefined' ? 
        JSON.parse(localStorage.getItem('monetization-storage') || '{}')?.convenienceFee || 0 : 0
      const subtotal = total - convenienceFee
      
      const userId = user?.id || (isGuest ? `guest-${guestEmail}` : 'unknown')
      
      const newBooking = {
        id: `bk_${Date.now()}`,
        serviceId,
        serviceName,
        date,
        numberOfPeople: people,
        subtotal: subtotal,
        convenienceFee: convenienceFee,
        totalPrice: total,
        status: paymentMethod === 'card' ? 'confirmed' : 'pending_review',
        paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending',
        packageName,
        category,
        createdAt: new Date().toISOString(),
        // User information
        userId: userId !== 'unknown' ? userId : undefined,
        // Guest information
        guestName: isGuest ? guestName : undefined,
        guestEmail: isGuest ? guestEmail : undefined,
        guestPhone: search.get('guestPhone') || undefined,
        isGuest: isGuest,
        // Payment method and slip
        paymentMethod: paymentMethod,
        paymentSlip: paymentSlipFile ? {
          fileName: paymentSlipFile.name,
          fileSize: paymentSlipFile.size,
          fileType: paymentSlipFile.type,
          uploadedAt: new Date().toISOString(),
        } : undefined,
      }
      localStorage.setItem('user-bookings', JSON.stringify([newBooking, ...list]))
      
      // Create notification for user
      if (userId && userId !== 'unknown') {
        addNotification({
          userId: userId,
          title: 'การจองสำเร็จ',
          message: `การจองของคุณสำหรับ "${serviceName}" สำเร็จแล้ว${isPendingReview ? ' (รอการตรวจสอบสลิป)' : ''}`,
          type: isPendingReview ? 'info' : 'success',
          link: `/user/bookings/${newBooking.id}`,
        })
      }
      
      // Clear all booking-related temporary data after successful booking
      if (typeof window !== 'undefined') {
        // Mark booking as completed (to clear forms on next visit)
        sessionStorage.setItem('booking-completed', 'true')
        
        // Clear sessionStorage (temporary data)
        sessionStorage.removeItem('guest-info')
        sessionStorage.removeItem('booking-in-progress')
        sessionStorage.removeItem('booking-form-data')
        
        // Clear localStorage guest-info only if it's a guest booking
        if (isGuest) {
          localStorage.removeItem('guest-info')
        }
      }
    }
    
    const isPendingReview = paymentMethod === 'promptpay' || paymentMethod === 'bank'
    
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            {isPendingReview ? 'อัปโหลดสลิปสำเร็จ!' : 'ชำระเงินสำเร็จ!'}
          </h1>
          {isPendingReview ? (
            <div className="space-y-4 mb-6 text-left">
              <p className="text-neutral-600">
                สลิปการโอนเงินของคุณได้รับการอัปโหลดแล้ว เราจะตรวจสอบและยืนยันการชำระเงินภายใน 24 ชั่วโมง
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  📧 เราจะส่งอีเมลแจ้งผลการตรวจสอบไปที่{' '}
                  <span className="font-semibold">{isGuest ? guestEmail : 'อีเมลของคุณ'}</span>
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⏳ สถานะการจอง: <span className="font-semibold">รอการตรวจสอบ</span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-neutral-600 mb-6">
              การจองของคุณได้รับการยืนยันแล้ว เราจะส่งอีเมลยืนยันไปที่{' '}
              <span className="font-semibold">{isGuest ? guestEmail : 'อีเมลของคุณ'}</span>{' '}
              ในเร็วๆ นี้
            </p>
          )}
          
          {isGuest && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-primary-800 mb-2">💡 สมัครสมาชิกเพื่อรับสิทธิพิเศษ!</h3>
              <p className="text-sm text-primary-700 mb-3">
                สมัครสมาชิกฟรีเพื่อ:
              </p>
              <ul className="text-sm text-primary-700 space-y-1 list-disc list-inside mb-3">
                <li>จัดการการจองได้ง่ายขึ้น</li>
                <li>สะสมคะแนนและรับส่วนลด</li>
                <li>เข้าถึงโปรโมชั่นพิเศษ</li>
                <li>บันทึกข้อมูลการจองอัตโนมัติ</li>
              </ul>
              <Link
                href={`/register?email=${encodeURIComponent(guestEmail)}&name=${encodeURIComponent(guestName)}`}
                className="btn-primary text-sm w-full"
              >
                สมัครสมาชิกตอนนี้
              </Link>
            </div>
          )}
          
          <div className="space-y-2">
            {typeof window !== 'undefined' && (
              <button
                onClick={() => {
                  // Get the latest booking ID from localStorage
                  const local = localStorage.getItem('user-bookings')
                  if (local) {
                    const bookings = JSON.parse(local)
                    if (bookings.length > 0) {
                      router.push(`/user/bookings/${bookings[0].id}`)
                      return
                    }
                  }
                  router.push('/user/bookings')
                }}
                className="btn-primary w-full"
              >
                ดูใบสรุปการจอง
              </button>
            )}
            {!isGuest && (
              <button
                onClick={() => router.push('/user/bookings')}
                className="btn-secondary w-full"
              >
                ดูการจองทั้งหมด
              </button>
            )}
            <button
              onClick={() => router.push('/')}
              className="btn-secondary w-full"
            >
              กลับไปหน้าแรก
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="card max-w-md w-full">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-center">การชำระเงินไม่สำเร็จ</h1>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-red-800 mb-2">สาเหตุที่เป็นไปได้:</h3>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              <li>ยอดเงินในบัญชีไม่เพียงพอ</li>
              <li>บัตรเครดิตหมดอายุ</li>
              <li>ข้อมูลบัตรไม่ถูกต้อง</li>
              <li>เกิดข้อผิดพลาดจากระบบชำระเงิน</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => setPaymentStatus(null)}
              className="btn-primary w-full"
            >
              ลองใหม่อีกครั้ง
            </button>
            <button
              onClick={() => router.push('/booking/confirm')}
              className="btn-secondary w-full"
            >
              เปลี่ยนวิธีชำระเงิน
            </button>
            <a
              href="/support"
              className="block text-center text-sm text-primary-600 hover:underline"
            >
              ติดต่อฝ่ายสนับสนุน
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Render different payment UI based on payment method
  const renderPaymentForm = () => {
    if (paymentMethod === 'promptpay') {
      const promptpay = paymentSettings?.promptpay || {
        accountName: 'บริษัท เชียงใหม่โก จำกัด',
        accountNumber: '0812345678',
        bankName: 'ธนาคารกรุงเทพ',
        qrCode: '',
      }
      
      return (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">ชำระเงินผ่านพร้อมเพย์</h2>
          <div className="space-y-4">
            {promptpay.qrCode && (
              <div className="flex justify-center">
                <img
                  src={promptpay.qrCode}
                  alt="QR Code"
                  className="w-64 h-64 border border-neutral-300 rounded-lg"
                />
              </div>
            )}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">ชื่อบัญชี:</span>
                <span>{promptpay.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">หมายเลขพร้อมเพย์:</span>
                <span className="font-mono">{promptpay.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">ธนาคาร:</span>
                <span>{promptpay.bankName}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-primary-200">
                <span>ยอดที่ต้องชำระ:</span>
                <span className="text-primary-600">฿{Number(search.get('total') || '0').toLocaleString()}</span>
              </div>
            </div>
            {/* Payment Slip Upload */}
            <div className="border border-neutral-300 rounded-lg p-4">
              <label className="block text-sm font-medium mb-2">
                อัปโหลดสลิปการโอนเงิน <span className="text-red-500">*</span>
              </label>
              {paymentSlip ? (
                <div className="space-y-3">
                  {paymentSlip.startsWith('blob:') ? (
                    <div className="relative">
                      <img
                        src={paymentSlip}
                        alt="Payment Slip"
                        className="w-full max-w-md mx-auto border border-neutral-300 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeSlip}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-300">
                      <div className="flex items-center gap-2">
                        <FileImage className="w-5 h-5 text-primary-600" />
                        <span className="text-sm">{paymentSlip}</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeSlip}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = 'image/*,.pdf'
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (file) {
                          handleSlipUpload({ target: { files: [file] } } as any)
                        }
                      }
                      input.click()
                    }}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    เปลี่ยนไฟล์
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                  <Upload className="w-8 h-8 text-neutral-400" />
                  <span className="text-sm text-neutral-600">คลิกเพื่ออัปโหลดสลิปการโอนเงิน</span>
                  <span className="text-xs text-neutral-500">รองรับไฟล์ JPG, PNG, PDF (ไม่เกิน 5MB)</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleSlipUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ หลังจากอัปโหลดสลิปแล้ว ระบบจะตรวจสอบและยืนยันการชำระเงินภายใน 24 ชั่วโมง
              </p>
            </div>
            
            <button
              onClick={handlePayment}
              disabled={paymentStatus === 'processing' || !paymentSlipFile}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentStatus === 'processing' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  กำลังอัปโหลดและประมวลผล...
                </>
              ) : (
                'ยืนยันการชำระเงิน'
              )}
            </button>
          </div>
        </div>
      )
    }
    
    if (paymentMethod === 'bank') {
      const accounts = paymentSettings?.bankTransfer?.accounts || [
        {
          bankName: 'ธนาคารกรุงเทพ',
          accountNumber: '123-456-7890',
          accountName: 'บริษัท เชียงใหม่โก จำกัด',
          branch: 'สาขาเชียงใหม่',
        },
      ]
      
      return (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">ชำระเงินผ่านโอนธนาคาร</h2>
          <div className="space-y-4">
            <div className="space-y-3">
              {accounts.map((account: any, index: number) => (
                <div key={index} className="border border-neutral-300 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">{account.bankName}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">เลขที่บัญชี:</span>
                      <span className="font-mono font-semibold">{account.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">ชื่อบัญชี:</span>
                      <span className="font-semibold">{account.accountName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">สาขา:</span>
                      <span>{account.branch}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex justify-between font-bold text-lg">
                <span>ยอดที่ต้องชำระ:</span>
                <span className="text-primary-600">฿{Number(search.get('total') || '0').toLocaleString()}</span>
              </div>
            </div>
            {/* Payment Slip Upload */}
            <div className="border border-neutral-300 rounded-lg p-4">
              <label className="block text-sm font-medium mb-2">
                อัปโหลดสลิปการโอนเงิน <span className="text-red-500">*</span>
              </label>
              {paymentSlip ? (
                <div className="space-y-3">
                  {paymentSlip.startsWith('blob:') ? (
                    <div className="relative">
                      <img
                        src={paymentSlip}
                        alt="Payment Slip"
                        className="w-full max-w-md mx-auto border border-neutral-300 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeSlip}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-300">
                      <div className="flex items-center gap-2">
                        <FileImage className="w-5 h-5 text-primary-600" />
                        <span className="text-sm">{paymentSlip}</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeSlip}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = 'image/*,.pdf'
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0]
                        if (file) {
                          handleSlipUpload({ target: { files: [file] } } as any)
                        }
                      }
                      input.click()
                    }}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    เปลี่ยนไฟล์
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                  <Upload className="w-8 h-8 text-neutral-400" />
                  <span className="text-sm text-neutral-600">คลิกเพื่ออัปโหลดสลิปการโอนเงิน</span>
                  <span className="text-xs text-neutral-500">รองรับไฟล์ JPG, PNG, PDF (ไม่เกิน 5MB)</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleSlipUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ หลังจากอัปโหลดสลิปแล้ว ระบบจะตรวจสอบและยืนยันการชำระเงินภายใน 24 ชั่วโมง
              </p>
            </div>
            
            <button
              onClick={handlePayment}
              disabled={paymentStatus === 'processing' || !paymentSlipFile}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentStatus === 'processing' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  กำลังอัปโหลดและประมวลผล...
                </>
              ) : (
                'ยืนยันการชำระเงิน'
              )}
            </button>
          </div>
        </div>
      )
    }
    
    // Card payment (default)
    return (
      <>
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">เลือกผู้ให้บริการชำระเงิน</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className={`p-4 border rounded-lg cursor-pointer ${gateway === 'omise' ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:bg-neutral-50'}`}>
              <input
                type="radio"
                name="gateway"
                value="omise"
                checked={gateway === 'omise'}
                onChange={() => setGateway('omise')}
                className="mr-2"
              />
              Omise (PromptPay/บัตรในไทย)
            </label>
            <label className={`p-4 border rounded-lg cursor-pointer ${gateway === 'stripe' ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:bg-neutral-50'}`}>
              <input
                type="radio"
                name="gateway"
                value="stripe"
                checked={gateway === 'stripe'}
                onChange={() => setGateway('stripe')}
                className="mr-2"
              />
              Stripe (บัตรสากล)
            </label>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-4">ข้อมูลบัตรเครดิต</h2>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
            <div>
              <label className="block text-sm font-medium mb-2">หมายเลขบัตร</label>
              <input
                type="text"
                className="input"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">วันหมดอายุ</label>
                <input
                  type="text"
                  className="input"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CVV</label>
                <input
                  type="text"
                  className="input"
                  placeholder="123"
                  maxLength={3}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">ชื่อบนบัตร</label>
              <input
                type="text"
                className="input"
                placeholder="ชื่อ นามสกุล"
              />
            </div>
            
            <button
              type="submit"
              disabled={paymentStatus === 'processing'}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {paymentStatus === 'processing' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  กำลังประมวลผล...
                </>
              ) : (
                'ยืนยันการชำระเงิน'
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-6 text-center text-sm text-neutral-600">
          <p>การชำระเงินของคุณจะถูกเข้ารหัสและปลอดภัย (ผ่าน {gateway === 'omise' ? 'Omise' : 'Stripe'})</p>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">ชำระเงิน</h1>
          
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4">สรุปการชำระเงิน</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>{search.get('serviceName') || 'บริการท่องเที่ยวเชียงใหม่'}</span>
                <span>฿{Number(search.get('total') || '0').toLocaleString()}</span>
              </div>
              <div className="border-t border-neutral-200 pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>ยอดรวม</span>
                  <span className="text-primary-600">฿{Number(search.get('total') || '0').toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-neutral-500">รวมค่าธรรมเนียมระบบแล้ว</p>
            </div>
          </div>
          
          {renderPaymentForm()}
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">กำลังโหลด...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}

