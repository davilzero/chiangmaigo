'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search, Filter, MessageSquare, Check, X, Calendar, CreditCard } from 'lucide-react'
import { addNotification } from '@/lib/utils/notifications'

export default function MerchantBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | 'paid' | 'pending' | 'refunded'>('all')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)

  useEffect(() => {
    // seed data with all statuses
    const seed = [
      {
        id: '1',
        bookingNumber: '#1001',
        serviceName: 'ทัวร์ดอยสุเทพ',
        customerName: 'ผู้ใช้ 1',
        date: '2024-01-15',
        numberOfPeople: 2,
        totalPrice: 1500,
        status: 'pending',
        paymentStatus: 'paid',
      },
      {
        id: '2',
        bookingNumber: '#1002',
        serviceName: 'กิจกรรมทำอาหาร',
        customerName: 'ผู้ใช้ 2',
        date: '2024-01-20',
        numberOfPeople: 1,
        totalPrice: 800,
        status: 'confirmed',
        paymentStatus: 'paid',
      },
      {
        id: '3',
        bookingNumber: '#1003',
        serviceName: 'ที่พักรีสอร์ท',
        customerName: 'ผู้ใช้ 3',
        date: '2024-02-01',
        numberOfPeople: 2,
        totalPrice: 2500,
        status: 'completed',
        paymentStatus: 'paid',
      },
      {
        id: '4',
        bookingNumber: '#1004',
        serviceName: 'ทัวร์วัด',
        customerName: 'ผู้ใช้ 4',
        date: '2024-01-10',
        numberOfPeople: 1,
        totalPrice: 500,
        status: 'cancelled',
        paymentStatus: 'refunded',
      },
      {
        id: '5',
        bookingNumber: '#1005',
        serviceName: 'สปาและนวด',
        customerName: 'ผู้ใช้ 5',
        date: '2024-01-25',
        numberOfPeople: 2,
        totalPrice: 1200,
        status: 'pending',
        paymentStatus: 'pending',
      },
    ]
    // load from localStorage (bookings created on payment success in demo)
    let local: any[] = []
    if (typeof window !== 'undefined') {
      const s = localStorage.getItem('merchant-bookings')
      if (s) local = JSON.parse(s)
      // Also load from user-bookings to show all bookings
      const userBookings = localStorage.getItem('user-bookings')
      if (userBookings) {
        const userBookingsList = JSON.parse(userBookings)
        // Convert user bookings to merchant format
        const converted = userBookingsList.map((b: any) => ({
          id: b.id,
          bookingNumber: `#${b.id.slice(-4)}`,
          serviceName: b.serviceName,
          customerName: b.guestName || b.userName || 'Guest',
          date: b.date,
          numberOfPeople: b.numberOfPeople,
          totalPrice: b.totalPrice,
          status: b.status,
          paymentStatus: b.paymentStatus,
          userId: b.userId,
          guestEmail: b.guestEmail,
          customerId: b.userId || b.guestEmail,
        }))
        local = [...local, ...converted]
      }
    }
    // Merge and remove duplicates
    const all = [...local, ...seed]
    const unique = all.filter((b, index, self) => 
      index === self.findIndex((t) => t.id === b.id)
    )
    setBookings(unique)
  }, [])

  const persist = (list: any[]) => {
    setBookings(list)
    if (typeof window !== 'undefined') {
      // persist only non-seed edits for demo (store whole list for simplicity)
      localStorage.setItem('merchant-bookings', JSON.stringify(list))
    }
  }

  const handleConfirm = (id: string) => {
    const booking = bookings.find(b => b.id === id)
    if (!booking) return
    
    const next = bookings.map((b) => (b.id === id ? { ...b, status: 'confirmed', paymentStatus: 'paid' } : b))
    persist(next)
    
    // Update user bookings
    if (typeof window !== 'undefined') {
      const userBookings = localStorage.getItem('user-bookings')
      if (userBookings) {
        const list = JSON.parse(userBookings)
        const updated = list.map((b: any) => 
          b.id === id ? { ...b, status: 'confirmed', paymentStatus: 'paid' } : b
        )
        localStorage.setItem('user-bookings', JSON.stringify(updated))
      }
    }
    
    // Create notification for customer
    // Try to find user ID from booking data
    const customerId = booking.userId || booking.customerId || booking.guestEmail
    if (customerId) {
      // Also try to find from user-bookings to get exact userId
      let exactUserId = customerId
      if (typeof window !== 'undefined') {
        const userBookings = localStorage.getItem('user-bookings')
        if (userBookings) {
          const list = JSON.parse(userBookings)
          const found = list.find((b: any) => b.id === id)
          if (found && found.userId) {
            exactUserId = found.userId
          }
        }
      }
      
      addNotification({
        userId: exactUserId,
        title: 'การจองได้รับการยืนยัน',
        message: `การจองของคุณสำหรับ "${booking.serviceName}" ได้รับการยืนยันแล้ว`,
        type: 'success',
        link: `/user/bookings/${id}`,
      })
    }
  }

  const handleReject = (id: string) => {
    const booking = bookings.find(b => b.id === id)
    if (!booking) return
    
    if (!confirm('คุณต้องการปฏิเสธการจองนี้ใช่หรือไม่?')) return
    
    const next = bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled', paymentStatus: 'refunded' } : b))
    persist(next)
    
    // Update user bookings
    if (typeof window !== 'undefined') {
      const userBookings = localStorage.getItem('user-bookings')
      if (userBookings) {
        const list = JSON.parse(userBookings)
        const updated = list.map((b: any) => 
          b.id === id ? { ...b, status: 'cancelled', paymentStatus: 'refunded' } : b
        )
        localStorage.setItem('user-bookings', JSON.stringify(updated))
      }
    }
    
    // Create notification for customer
    const customerId = booking.userId || booking.customerId || booking.guestEmail
    if (customerId) {
      // Also try to find from user-bookings to get exact userId
      let exactUserId = customerId
      if (typeof window !== 'undefined') {
        const userBookings = localStorage.getItem('user-bookings')
        if (userBookings) {
          const list = JSON.parse(userBookings)
          const found = list.find((b: any) => b.id === id)
          if (found && found.userId) {
            exactUserId = found.userId
          }
        }
      }
      
      addNotification({
        userId: exactUserId,
        title: 'การจองถูกปฏิเสธ',
        message: `การจองของคุณสำหรับ "${booking.serviceName}" ถูกปฏิเสธ กรุณาติดต่อผู้ให้บริการสำหรับข้อมูลเพิ่มเติม`,
        type: 'error',
        link: `/user/bookings/${id}`,
      })
    }
  }

  const handleMessage = (id: string) => {
    alert(`ส่งข้อความถึงการจอง ${id} (เดโม)`)
  }

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      // Search filter
      const matchQ =
        !query ||
        b.bookingNumber?.toLowerCase().includes(query.toLowerCase()) ||
        b.serviceName?.toLowerCase().includes(query.toLowerCase()) ||
        b.customerName?.toLowerCase().includes(query.toLowerCase())
      
      // Status filter
      const matchStatus = 
        statusFilter === 'all' || 
        b.status === statusFilter ||
        (statusFilter === 'pending' && (b.status === 'pending' || b.status === 'pending_review'))
      
      // Payment status filter
      const matchPaymentStatus = 
        paymentStatusFilter === 'all' ||
        b.paymentStatus === paymentStatusFilter ||
        (paymentStatusFilter === 'pending' && (b.paymentStatus === 'pending' || b.paymentStatus === 'pending_review'))
      
      // Date filter
      const t = new Date(b.date).getTime()
      const fromOk = !dateFrom || t >= new Date(dateFrom).getTime()
      const toOk = !dateTo || t <= new Date(dateTo).getTime()
      
      return matchQ && matchStatus && matchPaymentStatus && fromOk && toOk
    })
  }, [bookings, query, statusFilter, paymentStatusFilter, dateFrom, dateTo])

  const clearFilters = () => {
    setQuery('')
    setStatusFilter('all')
    setPaymentStatusFilter('all')
    setDateFrom('')
    setDateTo('')
  }

  const hasActiveFilters = statusFilter !== 'all' || paymentStatusFilter !== 'all' || dateFrom || dateTo || query

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">จัดการรายการจอง</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <a href="/merchant/dashboard" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ภาพรวม
              </a>
              <a href="/merchant/services" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                จัดการบริการ
              </a>
              <a href="/merchant/bookings" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                การจอง
              </a>
              <a href="/merchant/promotions" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                โปรโมชั่น
              </a>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filter */}
            <div className="card">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาการจอง (หมายเลข, บริการ, ลูกค้า)..."
                    className="input pl-12"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                  className={`btn-secondary flex items-center gap-2 ${showAdvancedFilter ? 'bg-primary-600 text-white' : ''}`}
                >
                  <Filter className="w-4 h-4" />
                  ตัวกรองขั้นสูง
                  {hasActiveFilters && (
                    <span className="ml-1 px-1.5 py-0.5 bg-white text-primary-600 rounded-full text-xs">
                      {[statusFilter !== 'all' ? 1 : 0, paymentStatusFilter !== 'all' ? 1 : 0, dateFrom ? 1 : 0, dateTo ? 1 : 0, query ? 1 : 0].reduce((a, b) => a + b, 0)}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Status Filter Buttons */}
              <div className="mb-4">
                <p className="text-sm font-medium text-neutral-700 mb-2">กรองตามสถานะการจอง:</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: 'ทั้งหมด', value: 'all' },
                    { label: 'รอยืนยัน', value: 'pending' },
                    { label: 'ยืนยันแล้ว', value: 'confirmed' },
                    { label: 'เสร็จสมบูรณ์', value: 'completed' },
                    { label: 'ยกเลิก', value: 'cancelled' },
                  ].map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStatusFilter(s.value as any)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        statusFilter === s.value
                          ? 'bg-primary-600 text-white'
                          : 'bg-white border border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Status Filter */}
              <div className="mb-4">
                <p className="text-sm font-medium text-neutral-700 mb-2">กรองตามสถานะการชำระเงิน:</p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: 'ทั้งหมด', value: 'all' },
                    { label: 'ชำระแล้ว', value: 'paid' },
                    { label: 'รอชำระ', value: 'pending' },
                    { label: 'คืนเงินแล้ว', value: 'refunded' },
                  ].map((payment) => (
                    <button
                      key={payment.value}
                      onClick={() => setPaymentStatusFilter(payment.value as any)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        paymentStatusFilter === payment.value
                          ? 'bg-green-600 text-white'
                          : 'bg-white border border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      {payment.value !== 'all' && <CreditCard className="w-4 h-4" />}
                      {payment.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Filter Panel */}
              {showAdvancedFilter && (
                <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">ตัวกรองขั้นสูง</h3>
                    <button
                      onClick={() => setShowAdvancedFilter(false)}
                      className="p-1 hover:bg-neutral-200 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">จากวันที่</label>
                      <input
                        type="date"
                        className="input w-full"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">ถึงวันที่</label>
                      <input
                        type="date"
                        className="input w-full"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <button
                        onClick={clearFilters}
                        className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        ล้างตัวกรองทั้งหมด
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Results count */}
              <div className="mt-4 text-sm text-neutral-600 flex items-center justify-between">
                <span>
                  พบ {filtered.length} รายการ
                  {statusFilter !== 'all' && ` (สถานะ: ${
                    statusFilter === 'pending' ? 'รอยืนยัน' :
                    statusFilter === 'confirmed' ? 'ยืนยันแล้ว' :
                    statusFilter === 'completed' ? 'เสร็จสมบูรณ์' :
                    statusFilter === 'cancelled' ? 'ยกเลิก' :
                    statusFilter
                  })`}
                  {paymentStatusFilter !== 'all' && ` (ชำระเงิน: ${
                    paymentStatusFilter === 'paid' ? 'ชำระแล้ว' :
                    paymentStatusFilter === 'pending' ? 'รอชำระ' :
                    paymentStatusFilter === 'refunded' ? 'คืนเงินแล้ว' :
                    paymentStatusFilter
                  })`}
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary-600 hover:underline"
                  >
                    ล้างตัวกรอง
                  </button>
                )}
              </div>
            </div>

            {/* Bookings Table */}
            <div className="card">
              {filtered.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-600 text-lg mb-2">ไม่พบการจอง</p>
                  <p className="text-neutral-500 text-sm">
                    {query ? 'ลองค้นหาด้วยคำอื่น' : 'ยังไม่มีการจองในสถานะนี้'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left py-3 px-4 font-semibold">หมายเลขการจอง</th>
                        <th className="text-left py-3 px-4 font-semibold">บริการ</th>
                        <th className="text-left py-3 px-4 font-semibold">ลูกค้า</th>
                        <th className="text-left py-3 px-4 font-semibold">วันที่</th>
                        <th className="text-left py-3 px-4 font-semibold">จำนวนคน</th>
                        <th className="text-left py-3 px-4 font-semibold">ราคา</th>
                        <th className="text-left py-3 px-4 font-semibold">สถานะ</th>
                        <th className="text-right py-3 px-4 font-semibold">การดำเนินการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((booking) => (
                      <tr key={booking.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-4 px-4">
                          <span className="font-medium">{booking.bookingNumber}</span>
                        </td>
                        <td className="py-4 px-4">{booking.serviceName}</td>
                        <td className="py-4 px-4">{booking.customerName}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(booking.date).toLocaleDateString('th-TH')}
                          </div>
                        </td>
                        <td className="py-4 px-4">{booking.numberOfPeople} คน</td>
                        <td className="py-4 px-4 font-semibold">฿{booking.totalPrice.toLocaleString()}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'pending' || booking.status === 'pending_review'
                              ? 'bg-yellow-100 text-yellow-700'
                              : booking.status === 'completed'
                              ? 'bg-blue-100 text-blue-700'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}>
                            {booking.status === 'confirmed' 
                              ? 'ยืนยันแล้ว' 
                              : booking.status === 'pending' || booking.status === 'pending_review'
                              ? 'รอยืนยัน'
                              : booking.status === 'completed'
                              ? 'เสร็จสมบูรณ์'
                              : booking.status === 'cancelled'
                              ? 'ยกเลิก'
                              : booking.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {(booking.status === 'pending' || booking.status === 'pending_review') && (
                              <>
                                <button
                                  onClick={() => handleConfirm(booking.id)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="ยืนยัน"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(booking.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="ปฏิเสธ"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleMessage(booking.id)}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="ส่งข้อความ"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Summary Report */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">รายงานสรุปการจอง</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">ยอดรวม</p>
                  <p className="text-2xl font-bold">฿4,800</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1">รายได้</p>
                  <p className="text-2xl font-bold text-green-600">฿4,800</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1">การจองทั้งหมด</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600 mb-1">บริการยอดนิยม</p>
                  <p className="text-lg font-semibold">ทัวร์ดอยสุเทพ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

