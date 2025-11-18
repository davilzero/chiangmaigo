import { Package, Calendar, DollarSign, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'

export default function MerchantDashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">แดชบอร์ดผู้ประกอบการ</h1>
          <Link href="/merchant/services/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            เพิ่มบริการใหม่
          </Link>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">บริการทั้งหมด</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <Package className="w-12 h-12 text-primary-600 opacity-50" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">การจองวันนี้</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <Calendar className="w-12 h-12 text-primary-600 opacity-50" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">รายได้เดือนนี้</p>
                <p className="text-3xl font-bold">฿125,000</p>
              </div>
              <DollarSign className="w-12 h-12 text-primary-600 opacity-50" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">อัตราการเติบโต</p>
                <p className="text-3xl font-bold">+12%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-primary-600 opacity-50" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <Link href="/merchant/dashboard" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                ภาพรวม
              </Link>
              <Link href="/merchant/services" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                จัดการบริการ
              </Link>
              <Link href="/merchant/bookings" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                การจอง
              </Link>
              <Link href="/merchant/promotions" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                โปรโมชั่น
              </Link>
              <Link href="/merchant/advertisements" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                โฆษณา
              </Link>
              <Link href="/merchant/profile" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                โปรไฟล์ธุรกิจ
              </Link>
              <Link href="/merchant/notifications" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                การแจ้งเตือน
              </Link>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Recent Bookings */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">การจองล่าสุด</h2>
                <Link href="/merchant/bookings" className="text-sm text-primary-600 hover:underline">
                  ดูทั้งหมด
                </Link>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div>
                      <h3 className="font-semibold">การจอง #{1000 + i}</h3>
                      <p className="text-sm text-neutral-600">บริการท่องเที่ยวเชียงใหม่</p>
                      <p className="text-sm text-neutral-600">วันที่: 15 ม.ค. 2024 • 2 คน</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">฿1,500</p>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        ยืนยันแล้ว
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Popular Services */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">บริการยอดนิยม</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
                      <div>
                        <h3 className="font-semibold">บริการท่องเที่ยว {i}</h3>
                        <p className="text-sm text-neutral-600">32 การจอง • 4.5 ⭐</p>
                      </div>
                    </div>
                    <Link href={`/merchant/services/${i}`} className="text-sm text-primary-600 hover:underline">
                      จัดการ
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


