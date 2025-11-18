'use client'

import { useState } from 'react'
import { Save, History } from 'lucide-react'

export default function UserProfilePage() {
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user-profile')
      if (saved) return JSON.parse(saved)
    }
    return {
      name: 'ชื่อ นามสกุล',
      email: 'user@example.com',
      phone: '0812345678',
    }
  })
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">จัดการบัญชีผู้ใช้</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <a href="/user/dashboard" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ภาพรวม
              </a>
              <a href="/user/bookings" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                การจองของฉัน
              </a>
              <a href="/user/profile" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                ข้อมูลส่วนตัว
              </a>
              <a href="/user/addresses" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ที่อยู่
              </a>
              <a href="/user/payment-methods" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                วิธีการชำระเงิน
              </a>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Form */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">ข้อมูลโปรไฟล์</h2>
                <button className="text-sm text-primary-600 hover:underline flex items-center gap-2">
                  <History className="w-4 h-4" />
                  ประวัติการแก้ไข
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">อีเมล</label>
                  <input
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    className="input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                
                <button
                  type="button"
                  className="btn-primary flex items-center gap-2"
                  onClick={() => {
                    localStorage.setItem('user-profile', JSON.stringify(formData))
                    setSavedMsg('บันทึกแล้ว')
                    setTimeout(() => setSavedMsg(null), 1500)
                  }}
                >
                  <Save className="w-4 h-4" />
                  บันทึกการเปลี่ยนแปลง
                </button>
                {savedMsg && <p className="text-sm text-green-600">{savedMsg}</p>}
              </form>
            </div>
            
            {/* Change Password */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">เปลี่ยนรหัสผ่าน</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">รหัสผ่านปัจจุบัน</label>
                  <input type="password" className="input" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">รหัสผ่านใหม่</label>
                  <input type="password" className="input" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">ยืนยันรหัสผ่านใหม่</label>
                  <input type="password" className="input" />
                </div>
                
                <button type="submit" className="btn-primary">
                  เปลี่ยนรหัสผ่าน
                </button>
              </form>
            </div>
            
            {/* Privacy Settings */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">การตั้งค่าความเป็นส่วนตัว</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span>แสดงโปรไฟล์สาธารณะ</span>
                  <input type="checkbox" className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span>อนุญาตให้ผู้ประกอบการติดต่อ</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span>รับอีเมลโปรโมชั่น</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

