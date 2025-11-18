import { Users, Building2, Package, DollarSign, TrendingUp, Activity } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">แดชบอร์ดระบบ (Admin Only!)</h1>
          <p className="text-neutral-600">ภาพรวมของระบบและสถิติการใช้งาน</p>
        </div>
        
        {/* Real-time Status */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              <span className="font-semibold">สถานะระบบ: ทำงานปกติ</span>
            </div>
            <span className="text-sm text-neutral-600">อัปเดตล่าสุด: {new Date().toLocaleString('th-TH')}</span>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">ผู้ใช้ทั้งหมด</p>
                <p className="text-3xl font-bold">1,234</p>
                <p className="text-xs text-green-600 mt-1">+12% จากเดือนที่แล้ว</p>
              </div>
              <Users className="w-12 h-12 text-primary-600 opacity-50" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">ผู้ประกอบการ</p>
                <p className="text-3xl font-bold">89</p>
                <p className="text-xs text-green-600 mt-1">+5 รายใหม่</p>
              </div>
              <Building2 className="w-12 h-12 text-primary-600 opacity-50" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">บริการทั้งหมด</p>
                <p className="text-3xl font-bold">456</p>
                <p className="text-xs text-green-600 mt-1">+23 รายการใหม่</p>
              </div>
              <Package className="w-12 h-12 text-primary-600 opacity-50" />
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">รายได้รวม</p>
                <p className="text-3xl font-bold">฿2.5M</p>
                <p className="text-xs text-green-600 mt-1">+18% จากเดือนที่แล้ว</p>
              </div>
              <DollarSign className="w-12 h-12 text-primary-600 opacity-50" />
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">บันทึกกิจกรรมล่าสุด</h2>
          <div className="space-y-3">
            {[
              { action: 'ผู้ใช้ใหม่สมัครสมาชิก', user: 'user@example.com', time: '2 นาทีที่แล้ว' },
              { action: 'บริการใหม่ถูกสร้าง', service: 'ทัวร์ดอยสุเทพ', time: '15 นาทีที่แล้ว' },
              { action: 'การจองใหม่', booking: '#1234', time: '30 นาทีที่แล้ว' },
              { action: 'ผู้ประกอบการใหม่', merchant: 'ร้าน ABC', time: '1 ชั่วโมงที่แล้ว' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-neutral-600">
                    {activity.user || activity.service || activity.booking || activity.merchant}
                  </p>
                </div>
                <span className="text-sm text-neutral-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="card">
            <h3 className="font-semibold mb-4">จัดการผู้ใช้</h3>
            <div className="space-y-2">
              <a href="/admin/users" className="block text-primary-600 hover:underline">ดูผู้ใช้ทั้งหมด</a>
              <a href="/admin/users/new" className="block text-primary-600 hover:underline">เพิ่มผู้ใช้ใหม่</a>
              <a href="/admin/admins" className="block text-primary-600 hover:underline">จัดการ Admin</a>
            </div>
          </div>
          
          <div className="card">
            <h3 className="font-semibold mb-4">จัดการบริการ</h3>
            <div className="space-y-2">
              <a href="/admin/services" className="block text-primary-600 hover:underline">อนุมัติบริการ</a>
              <a href="/admin/categories" className="block text-primary-600 hover:underline">จัดการหมวดหมู่</a>
              <a href="/admin/banners" className="block text-primary-600 hover:underline">จัดการแบนเนอร์</a>
            </div>
          </div>
          
          <div className="card">
            <h3 className="font-semibold mb-4">ตั้งค่าระบบ</h3>
            <div className="space-y-2">
              <a href="/admin/settings" className="block text-primary-600 hover:underline">ตั้งค่าทั่วไป</a>
              <a href="/admin/settings/payment" className="block text-primary-600 hover:underline">ตั้งค่าชำระเงิน</a>
              <a href="/admin/settings/security" className="block text-primary-600 hover:underline">ความปลอดภัย</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

