'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Save, History } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'
import { logEditHistory } from '@/lib/utils/editHistory'

export default function AdminSettingsPage() {
  const { user } = useAuthStore()
  const [settings, setSettings] = useState({
    defaultLanguage: 'th',
    adminLanguage: 'th',
    defaultCurrency: 'THB',
    maintenanceMode: false,
    transactionFee: 5,
  })

  const handleSave = () => {
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin-settings', JSON.stringify(settings))
      
      // Log edit history
      if (user) {
        logEditHistory({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action: 'update',
          entityType: 'settings',
          entityId: 'general',
          changes: [
            { field: 'settings', oldValue: 'previous', newValue: JSON.stringify(settings) }
          ],
        })
      }
      
      alert('บันทึกการตั้งค่าเรียบร้อยแล้ว')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ตั้งค่าระบบ (Admin Only!)</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <a href="/admin/dashboard" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ภาพรวม
              </a>
              <a href="/admin/users" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                จัดการผู้ใช้
              </a>
              <a href="/admin/services" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                จัดการบริการ
              </a>
              <a href="/admin/settings" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                ตั้งค่าระบบ
              </a>
              <a href="/admin/settings/payment" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ตั้งค่าชำระเงิน
              </a>
              <a href="/admin/settings/security" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ความปลอดภัย
              </a>
              <Link href="/admin/settings/edit-history" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ประวัติการแก้ไข
              </Link>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* General Settings */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">การตั้งค่าทั่วไป</h2>
                <Link
                  href="/admin/settings/edit-history"
                  className="text-sm text-primary-600 hover:underline flex items-center gap-2"
                >
                  <History className="w-4 h-4" />
                  ประวัติการแก้ไข
                </Link>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ภาษาเริ่มต้น</label>
                  <select
                    className="input"
                    value={settings.defaultLanguage}
                    onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
                  >
                    <option value="th">ไทย</option>
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">ภาษาสำหรับหน้า Admin</label>
                  <select
                    className="input"
                    value={settings.adminLanguage}
                    onChange={(e) => setSettings({ ...settings, adminLanguage: e.target.value })}
                  >
                    <option value="th">ไทย</option>
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">สกุลเงินหลัก</label>
                  <select
                    className="input"
                    value={settings.defaultCurrency}
                    onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                  >
                    <option value="THB">THB (บาท)</option>
                    <option value="USD">USD (ดอลลาร์)</option>
                    <option value="CNY">CNY (หยวน)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">ค่าธรรมเนียมการทำธุรกรรม (%)</label>
                  <input
                    type="number"
                    className="input"
                    value={settings.transactionFee}
                    onChange={(e) => setSettings({ ...settings, transactionFee: parseFloat(e.target.value) })}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    />
                    <span>โหมดบำรุงรักษา (Maintenance Mode)</span>
                  </label>
                  {settings.maintenanceMode && (
                    <p className="text-sm text-yellow-600 mt-2">
                      ⚠️ ระบบจะแสดงหน้าบำรุงรักษาให้กับผู้ใช้ทั่วไป
                    </p>
                  )}
                </div>
                
                <button 
                  type="button"
                  onClick={handleSave}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  บันทึกการตั้งค่า
                </button>
              </form>
            </div>
            
            {/* System Notifications */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">การแจ้งเตือนทั่วระบบ</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span>แจ้งเตือนอีเมล</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span>แจ้งเตือน SMS</span>
                  <input type="checkbox" className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span>แจ้งเตือน Push Notification</span>
                  <input type="checkbox" className="rounded" defaultChecked />
                </label>
              </div>
            </div>
            
            {/* Email Templates */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">แม่แบบอีเมล/SMS</h2>
              <div className="space-y-2">
                <a href="/admin/settings/email-templates" className="block text-primary-600 hover:underline">
                  จัดการแม่แบบอีเมล
                </a>
                <a href="/admin/settings/sms-templates" className="block text-primary-600 hover:underline">
                  จัดการแม่แบบ SMS
                </a>
              </div>
            </div>

            {/* Monetization & Sponsored */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Monetization & บริการยอดนิยม</h2>
              <div className="space-y-2">
                <a href="/admin/settings/monetization" className="block text-primary-600 hover:underline">
                  ตั้งค่า Monetization (ค่าธรรมเนียม, คอมมิชชัน)
                </a>
                <a href="/admin/settings/sponsored" className="block text-primary-600 hover:underline">
                  จัดการบริการยอดนิยม / สปอนเซอร์
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

