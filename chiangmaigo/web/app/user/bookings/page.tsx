'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Filter, Star, Calendar, MapPin, X, CreditCard } from 'lucide-react'

export default function UserBookingsPage() {
  const [allBookings, setAllBookings] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled'>('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | 'paid' | 'pending' | 'refunded'>('all')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)

  useEffect(() => {
    // โหลดรายการจาก localStorage แล้วรวมกับ mock (เพื่อให้มีข้อมูลตั้งต้น)
    const local = typeof window !== 'undefined' ? localStorage.getItem('user-bookings') : null
    const localList = local ? JSON.parse(local) : []
    const mock = [
      {
        id: 'seed-1',
        serviceName: 'ทัวร์ดอยสุเทพ',
        date: '2024-01-15',
        numberOfPeople: 2,
        totalPrice: 1500,
        status: 'confirmed',
        paymentStatus: 'paid',
        canReview: true,
        createdAt: '2024-01-10T09:00:00Z',
      },
      {
        id: 'seed-2',
        serviceName: 'กิจกรรมทำอาหาร',
        date: '2024-01-20',
        numberOfPeople: 1,
        totalPrice: 800,
        status: 'pending',
        paymentStatus: 'pending',
        canReview: false,
        createdAt: '2024-01-18T09:00:00Z',
      },
      {
        id: 'seed-3',
        serviceName: 'ที่พักรีสอร์ท',
        date: '2024-02-01',
        numberOfPeople: 2,
        totalPrice: 2500,
        status: 'completed',
        paymentStatus: 'paid',
        canReview: true,
        createdAt: '2024-01-25T09:00:00Z',
      },
      {
        id: 'seed-4',
        serviceName: 'ทัวร์วัด',
        date: '2024-01-10',
        numberOfPeople: 1,
        totalPrice: 500,
        status: 'cancelled',
        paymentStatus: 'refunded',
        canReview: false,
        createdAt: '2024-01-05T09:00:00Z',
        category: 'ท่องเที่ยว',
      },
      {
        id: 'seed-5',
        serviceName: 'สปาและนวด',
        date: '2024-01-25',
        numberOfPeople: 2,
        totalPrice: 1200,
        status: 'pending',
        paymentStatus: 'pending',
        canReview: false,
        createdAt: '2024-01-22T09:00:00Z',
        category: 'สปาและสุขภาพ',
      },
    ]
    const merged = [...localList, ...mock].sort((a, b) => {
      const da = new Date(a.createdAt || a.date).getTime()
      const db = new Date(b.createdAt || b.date).getTime()
      return db - da
    })
    setAllBookings(merged)
  }, [])

  // Filter bookings based on all filters
  const bookings = useMemo(() => {
    return allBookings.filter((booking) => {
      // Search filter
      const matchQuery = 
        !query ||
        booking.serviceName?.toLowerCase().includes(query.toLowerCase()) ||
        booking.id?.toLowerCase().includes(query.toLowerCase()) ||
        booking.packageName?.toLowerCase().includes(query.toLowerCase()) ||
        booking.category?.toLowerCase().includes(query.toLowerCase())
      
      // Status filter
      const matchStatus = 
        statusFilter === 'all' || 
        booking.status === statusFilter ||
        (statusFilter === 'pending' && (booking.status === 'pending' || booking.status === 'pending_review'))
      
      // Payment status filter
      const matchPaymentStatus = 
        paymentStatusFilter === 'all' ||
        booking.paymentStatus === paymentStatusFilter ||
        (paymentStatusFilter === 'pending' && (booking.paymentStatus === 'pending' || booking.paymentStatus === 'pending_review'))
      
      // Date filter
      const bookingDate = new Date(booking.date).getTime()
      const matchDateFrom = !dateFrom || bookingDate >= new Date(dateFrom).getTime()
      const matchDateTo = !dateTo || bookingDate <= new Date(dateTo).getTime()
      
      return matchQuery && matchStatus && matchPaymentStatus && matchDateFrom && matchDateTo
    })
  }, [allBookings, query, statusFilter, paymentStatusFilter, dateFrom, dateTo])

  const clearFilters = () => {
    setQuery('')
    setStatusFilter('all')
    setPaymentStatusFilter('all')
    setDateFrom('')
    setDateTo('')
  }

  const hasActiveFilters = statusFilter !== 'all' || paymentStatusFilter !== 'all' || dateFrom || dateTo || query

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-neutral-100 text-neutral-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'ยืนยันแล้ว'
      case 'completed':
        return 'เสร็จสมบูรณ์'
      case 'pending':
        return 'รอยืนยัน'
      case 'cancelled':
        return 'ยกเลิก'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">การจองของฉัน</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <Link href="/user/dashboard" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ภาพรวม
              </Link>
              <Link href="/user/bookings" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                การจองของฉัน
              </Link>
              <Link href="/user/profile" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ข้อมูลส่วนตัว
              </Link>
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
                    placeholder="ค้นหาการจอง (ชื่อบริการ, หมายเลข, หมวดหมู่)..."
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
                    { label: 'ยืนยันแล้ว', value: 'confirmed' },
                    { label: 'รอยืนยัน', value: 'pending' },
                    { label: 'เสร็จสมบูรณ์', value: 'completed' },
                    { label: 'ยกเลิก', value: 'cancelled' },
                  ].map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setStatusFilter(status.value as any)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        statusFilter === status.value
                          ? 'bg-primary-600 text-white'
                          : 'bg-white border border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      {status.label}
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
                  พบ {bookings.length} รายการ
                  {statusFilter !== 'all' && ` (สถานะ: ${getStatusText(statusFilter)})`}
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
            
            {/* Bookings List */}
            {bookings.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-neutral-600 text-lg mb-2">ไม่พบการจอง</p>
                <p className="text-neutral-500 text-sm">
                  {query ? 'ลองค้นหาด้วยคำอื่น' : 'ยังไม่มีการจองในสถานะนี้'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                <div key={booking.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-24 h-24 bg-neutral-200 rounded-lg"></div>
                      <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{booking.serviceName}</h3>
                        <div className="space-y-1 text-sm text-neutral-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                          <span>วันที่: {booking.date ? new Date(booking.date).toLocaleDateString('th-TH') : '-'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>จำนวนคน: {booking.numberOfPeople} คน</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                          <span className="text-sm text-neutral-600">
                            ชำระเงิน: {booking.paymentStatus === 'paid' ? 'ชำระแล้ว' : 'รอชำระ'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600 text-lg mb-2">
                        ฿{booking.totalPrice.toLocaleString()}
                      </p>
                      <div className="space-y-2">
                        <Link
                          href={`/user/bookings/${booking.id}`}
                          className="block text-sm text-primary-600 hover:underline"
                        >
                          ดูรายละเอียด
                        </Link>
                      {booking.canReview && (
                          <Link
                            href={`/user/bookings/${booking.id}/review`}
                            className="block text-sm text-primary-600 hover:underline flex items-center gap-1"
                          >
                            <Star className="w-4 h-4" />
                            ให้คะแนน/เขียนรีวิว
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

