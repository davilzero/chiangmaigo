import Link from 'next/link'
import { Package, Calendar, Star, Settings, MapPin, CreditCard } from 'lucide-react'

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ศูนย์ผู้ใช้ส่วนบุคคล</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">การจองทั้งหมด</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">การจองที่กำลังจะมาถึง</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Star className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">รีวิวที่เขียน</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <Link href="/user/dashboard" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                ภาพรวม
              </Link>
              <Link href="/user/bookings" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                การจองของฉัน
              </Link>
              <Link href="/user/profile" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ข้อมูลส่วนตัว
              </Link>
              <Link href="/user/addresses" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ที่อยู่
              </Link>
              <Link href="/user/payment-methods" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                วิธีการชำระเงิน
              </Link>
              <Link href="/user/reviews" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                รีวิวของฉัน
              </Link>
              <Link href="/user/notifications" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                การแจ้งเตือน
              </Link>
              <Link href="/user/messages" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ข้อความ
              </Link>
              <Link href="/user/settings" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                <Settings className="w-4 h-4 inline mr-2" />
                ตั้งค่า
              </Link>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Recent Bookings */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">การจองล่าสุด</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
                      <div>
                        <h3 className="font-semibold">บริการท่องเที่ยว {i}</h3>
                        <p className="text-sm text-neutral-600">วันที่: 15 ม.ค. 2024</p>
                        <p className="text-sm text-neutral-600">สถานะ: ยืนยันแล้ว</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">฿1,500</p>
                      <Link href={`/user/bookings/${i}`} className="text-sm text-primary-600 hover:underline">
                        ดูรายละเอียด
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">การดำเนินการด่วน</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/services" className="p-4 border border-neutral-200 rounded-lg text-center hover:bg-neutral-50">
                  <Package className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                  <p className="text-sm font-medium">จองบริการ</p>
                </Link>
                <Link href="/user/reviews" className="p-4 border border-neutral-200 rounded-lg text-center hover:bg-neutral-50">
                  <Star className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                  <p className="text-sm font-medium">เขียนรีวิว</p>
                </Link>
                <Link href="/user/addresses" className="p-4 border border-neutral-200 rounded-lg text-center hover:bg-neutral-50">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                  <p className="text-sm font-medium">จัดการที่อยู่</p>
                </Link>
                <Link href="/user/payment-methods" className="p-4 border border-neutral-200 rounded-lg text-center hover:bg-neutral-50">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                  <p className="text-sm font-medium">ชำระเงิน</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


