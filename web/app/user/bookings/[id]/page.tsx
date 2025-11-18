'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, 
  Users, 
  MapPin, 
  CreditCard, 
  Download, 
  Printer, 
  FileImage,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Phone,
  User,
  Building
} from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [customerProfile, setCustomerProfile] = useState<any>(null)
  const [customerAddresses, setCustomerAddresses] = useState<any[]>([])

  useEffect(() => {
    const loadBooking = () => {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('user-bookings')
        const bookings = local ? JSON.parse(local) : []
        const found = bookings.find((b: any) => b.id === params.id)
        
        if (found) {
          setBooking(found)
        } else {
          // Try mock data
          const mock = {
            id: params.id,
            serviceName: 'ทัวร์ดอยสุเทพ',
            packageName: 'แพ็คเกจพื้นฐาน',
            date: '2024-01-15',
            numberOfPeople: 2,
            totalPrice: 1500,
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentMethod: 'card',
            createdAt: '2024-01-10T09:00:00Z',
            guestName: user?.name || 'ผู้ใช้ทดสอบ',
            guestEmail: user?.email || 'test@example.com',
            guestPhone: '0812345678',
          }
          setBooking(mock)
        }
        
        // Load customer profile
        const profile = localStorage.getItem('user-profile')
        if (profile) {
          setCustomerProfile(JSON.parse(profile))
        } else if (user) {
          setCustomerProfile({
            name: user.name,
            email: user.email,
            phone: '',
          })
        }
        
        // Load customer addresses
        const addresses = localStorage.getItem('user-addresses')
        if (addresses) {
          setCustomerAddresses(JSON.parse(addresses))
        }
        
        setLoading(false)
      }
    }
    loadBooking()
  }, [params.id, user])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          text: 'ยืนยันแล้ว',
          color: 'text-green-600',
          bg: 'bg-green-50',
          icon: CheckCircle,
        }
      case 'pending_review':
        return {
          text: 'รอการตรวจสอบ',
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          icon: Clock,
        }
      case 'completed':
        return {
          text: 'เสร็จสมบูรณ์',
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          icon: CheckCircle,
        }
      case 'cancelled':
        return {
          text: 'ยกเลิก',
          color: 'text-red-600',
          bg: 'bg-red-50',
          icon: XCircle,
        }
      default:
        return {
          text: status,
          color: 'text-neutral-600',
          bg: 'bg-neutral-50',
          icon: Clock,
        }
    }
  }

  const getPaymentMethodText = (method?: string) => {
    switch (method) {
      case 'card':
        return 'บัตรเครดิต/เดบิต'
      case 'promptpay':
        return 'พร้อมเพย์'
      case 'bank':
        return 'โอนผ่านธนาคาร'
      default:
        return 'ไม่ระบุ'
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // TODO: Generate PDF receipt
    alert('ฟีเจอร์ดาวน์โหลดใบเสร็จ PDF กำลังพัฒนา')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">ไม่พบข้อมูลการจอง</h1>
          <p className="text-neutral-600 mb-6">ไม่พบการจองที่คุณต้องการ</p>
          <Link href="/user/bookings" className="btn-primary">
            กลับไปหน้ารายการจอง
          </Link>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(booking.status)

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">ใบสรุปการจอง</h1>
              <p className="text-neutral-600">หมายเลขการจอง: {booking.id}</p>
            </div>
            <div className="flex gap-2 print:hidden">
              <button
                onClick={handleDownload}
                className="btn-secondary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                ดาวน์โหลด
              </button>
              <button
                onClick={handlePrint}
                className="btn-secondary flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                พิมพ์
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information - Main Section */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-bold">ข้อมูลลูกค้า</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">ชื่อ-นามสกุล</p>
                      <p className="font-semibold text-lg">
                        {booking.guestName || customerProfile?.name || user?.name || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">อีเมล</p>
                      <p className="font-medium break-all">
                        {booking.guestEmail || customerProfile?.email || user?.email || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 mb-1">เบอร์โทรศัพท์</p>
                      <p className="font-medium">
                        {booking.guestPhone || customerProfile?.phone || '-'}
                      </p>
                    </div>
                  </div>
                  {customerAddresses.length > 0 && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-neutral-500 mb-2">ที่อยู่</p>
                        {customerAddresses
                          .filter((addr: any) => addr.isDefault)
                          .map((addr: any, index: number) => (
                            <div key={index} className="space-y-1">
                              <p className="font-medium">{addr.name}</p>
                              <p className="text-neutral-600 text-sm">{addr.address}</p>
                              <p className="text-xs text-neutral-500">
                                {addr.type === 'BILLING' || addr.type === 'ที่อยู่สำหรับออกใบเสร็จ' 
                                  ? 'ที่อยู่สำหรับออกใบเสร็จ' 
                                  : 'ที่อยู่สำหรับจัดส่ง'}
                              </p>
                            </div>
                          ))}
                        {customerAddresses.filter((addr: any) => addr.isDefault).length === 0 && customerAddresses[0] && (
                          <div className="space-y-1">
                            <p className="font-medium">{customerAddresses[0].name}</p>
                            <p className="text-neutral-600 text-sm">{customerAddresses[0].address}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {booking.isGuest && (
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                      <User className="w-4 h-4" />
                      จองแบบ Guest
                    </span>
                  </div>
                )}
              </div>

              {/* Booking Status */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">สถานะการจอง</h2>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusInfo.bg}`}>
                    <statusInfo.icon className={`w-5 h-5 ${statusInfo.color}`} />
                    <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">สถานะการชำระเงิน:</span>
                    <span className="font-medium">
                      {booking.paymentStatus === 'paid' ? 'ชำระแล้ว' : 
                       booking.paymentStatus === 'pending' ? 'รอการตรวจสอบ' : 
                       'ยังไม่ชำระ'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">วิธีการชำระเงิน:</span>
                    <span className="font-medium">{getPaymentMethodText(booking.paymentMethod)}</span>
                  </div>
                  {booking.paymentSlip && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">สลิปการโอนเงิน:</span>
                      <span className="font-medium text-green-600">อัปโหลดแล้ว</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Details */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4">รายละเอียดบริการ</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{booking.serviceName}</h3>
                    {booking.packageName && (
                      <p className="text-neutral-600">แพ็คเกจ: {booking.packageName}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-neutral-400" />
                      <div>
                        <p className="text-xs text-neutral-500">วันที่</p>
                        <p className="font-medium">
                          {booking.date ? new Date(booking.date).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }) : '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-neutral-400" />
                      <div>
                        <p className="text-xs text-neutral-500">จำนวนคน</p>
                        <p className="font-medium">{booking.numberOfPeople} คน</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Slip (if exists) */}
              {booking.paymentSlip && (
                <div className="card">
                  <h2 className="text-xl font-bold mb-4">สลิปการโอนเงิน</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileImage className="w-5 h-5 text-primary-600" />
                        <div>
                          <p className="font-medium">{booking.paymentSlip.fileName}</p>
                          <p className="text-xs text-neutral-500">
                            {(booking.paymentSlip.fileSize / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-green-600 font-medium">อัปโหลดแล้ว</span>
                    </div>
                    {booking.paymentSlip.uploadedAt && (
                      <p className="text-xs text-neutral-500">
                        อัปโหลดเมื่อ: {new Date(booking.paymentSlip.uploadedAt).toLocaleString('th-TH')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Special Requirements */}
              {booking.specialRequirements && (
                <div className="card">
                  <h2 className="text-xl font-bold mb-4">ข้อกำหนดพิเศษ</h2>
                  <p className="text-neutral-700">{booking.specialRequirements}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-primary-600" />
                  <h2 className="text-xl font-bold">ข้อมูลลูกค้า</h2>
                </div>
                <div className="space-y-4">
                  {/* Personal Info */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 text-neutral-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-xs text-neutral-500 mb-1">ชื่อ-นามสกุล</p>
                        <p className="font-medium text-base">
                          {booking.guestName || customerProfile?.name || user?.name || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-neutral-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-xs text-neutral-500 mb-1">อีเมล</p>
                        <p className="font-medium text-base break-all">
                          {booking.guestEmail || customerProfile?.email || user?.email || '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-neutral-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-xs text-neutral-500 mb-1">เบอร์โทรศัพท์</p>
                        <p className="font-medium text-base">
                          {booking.guestPhone || customerProfile?.phone || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Address */}
                  {customerAddresses.length > 0 && (
                    <div className="pt-4 border-t border-neutral-200">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-neutral-400 mt-1" />
                        <div className="flex-1">
                          <p className="text-xs text-neutral-500 mb-2">ที่อยู่</p>
                          {customerAddresses
                            .filter((addr: any) => addr.isDefault)
                            .map((addr: any, index: number) => (
                              <div key={index} className="space-y-1">
                                <p className="font-medium text-sm">{addr.name}</p>
                                <p className="text-sm text-neutral-600">{addr.address}</p>
                                <p className="text-xs text-neutral-500">
                                  {addr.type === 'BILLING' ? 'ที่อยู่สำหรับออกใบเสร็จ' : 'ที่อยู่สำหรับจัดส่ง'}
                                </p>
                              </div>
                            ))}
                          {customerAddresses.filter((addr: any) => addr.isDefault).length === 0 && (
                            <p className="text-sm text-neutral-600">
                              {customerAddresses[0]?.address || '-'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Guest Badge */}
                  {booking.isGuest && (
                    <div className="pt-4 border-t border-neutral-200">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        <User className="w-3 h-3" />
                        จองแบบ Guest
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4">สรุปการชำระเงิน</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">ราคาแพ็คเกจ</span>
                    <span>฿{(booking.subtotal || booking.totalPrice || 0).toLocaleString()}</span>
                  </div>
                  {booking.convenienceFee && booking.convenienceFee > 0 && (
                    <div className="flex justify-between text-sm text-neutral-600">
                      <span>ค่าธรรมเนียมระบบ</span>
                      <span>฿{booking.convenienceFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-neutral-200 pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>ยอดรวม</span>
                      <span className="text-primary-600">
                        ฿{(booking.totalPrice || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-neutral-200">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <CreditCard className="w-4 h-4" />
                      <span>{getPaymentMethodText(booking.paymentMethod)}</span>
                    </div>
                    {booking.paymentStatus && (
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          booking.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.paymentStatus === 'paid' ? 'ชำระแล้ว' : 'รอการตรวจสอบ'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4">ข้อมูลการจอง</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">หมายเลขการจอง:</span>
                    <span className="font-mono text-xs">{booking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">วันที่จอง:</span>
                    <span>
                      {booking.createdAt 
                        ? new Date(booking.createdAt).toLocaleDateString('th-TH')
                        : '-'}
                    </span>
                  </div>
                  {booking.category && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">หมวดหมู่:</span>
                      <span>{booking.category}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="card print:hidden">
                <div className="space-y-2">
                  {booking.canReview && booking.status === 'completed' && (
                    <Link
                      href={`/user/bookings/${booking.id}/review`}
                      className="btn-primary w-full text-center"
                    >
                      ให้คะแนน/เขียนรีวิว
                    </Link>
                  )}
                  <Link
                    href="/user/bookings"
                    className="btn-secondary w-full text-center"
                  >
                    กลับไปหน้ารายการจอง
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          body {
            background: white;
          }
          .card {
            border: 1px solid #e5e5e5;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  )
}

