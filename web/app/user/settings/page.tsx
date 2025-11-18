'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function UserSettingsPage() {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user-settings')
      if (saved) return JSON.parse(saved)
    }
    return {
      language: 'th',
      theme: 'light',
      emailNotifications: true,
      smsNotifications: false,
      inAppNotifications: true,
      privacyPublicProfile: false,
      privacyAllowMerchants: true,
    }
  })
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user-settings', JSON.stringify(settings))
    }
  }, [settings])

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">การตั้งค่าผู้ใช้</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <Link href="/user/dashboard" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ภาพรวม
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
              <Link href="/user/settings" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                ตั้งค่า
              </Link>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-3 space-y-6">
            {/* General */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">ทั่วไป</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ภาษา</label>
                  <select
                    className="input"
                    value={settings.language}
                    onChange={(e) => setSettings((s: any) => ({ ...s, language: e.target.value }))}
                  >
                    <option value="th">ไทย</option>
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ธีม</label>
                  <select
                    className="input"
                    value={settings.theme}
                    onChange={(e) => setSettings((s: any) => ({ ...s, theme: e.target.value }))}
                  >
                    <option value="light">สว่าง</option>
                    <option value="dark">มืด</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">การแจ้งเตือน</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span>อีเมล</span>
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings((s: any) => ({ ...s, emailNotifications: e.target.checked }))}
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span>SMS</span>
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={settings.smsNotifications}
                    onChange={(e) => setSettings((s: any) => ({ ...s, smsNotifications: e.target.checked }))}
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span>ในแอป</span>
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={settings.inAppNotifications}
                    onChange={(e) => setSettings((s: any) => ({ ...s, inAppNotifications: e.target.checked }))}
                  />
                </label>
              </div>
            </div>

            {/* Privacy */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">ความเป็นส่วนตัว</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span>แสดงโปรไฟล์สาธารณะ</span>
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={settings.privacyPublicProfile}
                    onChange={(e) => setSettings((s: any) => ({ ...s, privacyPublicProfile: e.target.checked }))}
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span>อนุญาตให้ผู้ประกอบการติดต่อ</span>
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={settings.privacyAllowMerchants}
                    onChange={(e) => setSettings((s: any) => ({ ...s, privacyAllowMerchants: e.target.checked }))}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="btn-primary"
                onClick={() => {
                  localStorage.setItem('user-settings', JSON.stringify(settings))
                  setSavedMsg('บันทึกการตั้งค่าเรียบร้อย')
                  setTimeout(() => setSavedMsg(null), 1500)
                }}
              >
                บันทึกการตั้งค่า
              </button>
            </div>
            {savedMsg && <p className="text-sm text-green-600">{savedMsg}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}


