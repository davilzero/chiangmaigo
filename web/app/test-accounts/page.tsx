'use client'

import { Copy, CheckCircle, User, Building, Shield } from 'lucide-react'
import { useState } from 'react'

const testAccounts = [
  {
    role: 'customer',
    icon: User,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    accounts: [
      { email: 'user@example.com', password: '123456', name: 'ผู้ใช้ 1' },
      { email: 'customer@test.com', password: '123456', name: 'ลูกค้าทดสอบ' },
    ],
  },
  {
    role: 'merchant',
    icon: Building,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    accounts: [
      { email: 'merchant@example.com', password: '123456', name: 'ผู้ประกอบการ 1' },
      { email: 'shop@chiangmaigo.com', password: '123456', name: 'ร้านค้าทดสอบ' },
    ],
  },
  {
    role: 'admin',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    accounts: [
      { email: 'admin@example.com', password: 'admin123', name: 'ผู้ดูแลระบบ' },
      { email: 'admin@chiangmaigo.com', password: 'admin123', name: 'Admin สำรอง' },
    ],
  },
]

export default function TestAccountsPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case 'customer':
        return 'ลูกค้า'
      case 'merchant':
        return 'ผู้ประกอบการ'
      case 'admin':
        return 'ผู้ดูแลระบบ'
      default:
        return role
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">🔐 รหัสทดสอบระบบ</h1>
            <p className="text-neutral-600 text-lg">
              ใช้บัญชีเหล่านี้เพื่อทดสอบฟีเจอร์ต่างๆ ของระบบ
            </p>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg inline-block">
              <p className="text-sm text-yellow-800">
              ⚠️ <strong>หมายเหตุ:</strong> ระบบนี้เป็น Demo Version - รหัสผ่านไม่มีการตรวจสอบจริง
              </p>
            </div>
          </div>

          {/* Test Accounts by Role */}
          <div className="space-y-6">
            {testAccounts.map((group) => {
              const Icon = group.icon
              return (
                <div key={group.role} className="card">
                  <div className={`flex items-center gap-3 mb-6 ${group.bgColor} p-4 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${group.color}`} />
                    <div>
                      <h2 className="text-2xl font-bold">{getRoleName(group.role)}</h2>
                      <p className="text-sm text-neutral-600">
                        {group.role === 'customer' && 'สำหรับทดสอบการจองและจัดการบัญชี'}
                        {group.role === 'merchant' && 'สำหรับทดสอบการจัดการบริการและการจอง'}
                        {group.role === 'admin' && 'สำหรับทดสอบการจัดการระบบทั้งหมด'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.accounts.map((account, index) => {
                      const accountId = `${group.role}-${index}`
                      return (
                        <div
                          key={accountId}
                          className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-lg">{account.name}</h3>
                            <span className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded">
                              {group.role}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {/* Email */}
                            <div>
                              <label className="text-xs text-neutral-500 mb-1 block">
                                อีเมล
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={account.email}
                                  readOnly
                                  className="flex-1 input text-sm"
                                />
                                <button
                                  onClick={() => copyToClipboard(account.email, `${accountId}-email`)}
                                  className="p-2 hover:bg-neutral-100 rounded transition-colors"
                                  title="คัดลอกอีเมล"
                                >
                                  {copied === `${accountId}-email` ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4 text-neutral-400" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Password */}
                            <div>
                              <label className="text-xs text-neutral-500 mb-1 block">
                                รหัสผ่าน
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={account.password}
                                  readOnly
                                  className="flex-1 input text-sm font-mono"
                                />
                                <button
                                  onClick={() => copyToClipboard(account.password, `${accountId}-password`)}
                                  className="p-2 hover:bg-neutral-100 rounded transition-colors"
                                  title="คัดลอกรหัสผ่าน"
                                >
                                  {copied === `${accountId}-password` ? (
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4 text-neutral-400" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-neutral-200">
                            <a
                              href="/login"
                              className="btn-primary w-full text-center text-sm"
                              onClick={(e) => {
                                e.preventDefault()
                                // Auto-fill login form (if implemented)
                                window.location.href = `/login?email=${encodeURIComponent(account.email)}&password=${encodeURIComponent(account.password)}`
                              }}
                            >
                              ใช้บัญชีนี้เข้าสู่ระบบ
                            </a>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 card">
            <h2 className="text-xl font-bold mb-4">🚀 วิธีใช้งาน</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">1. เลือกบัญชี</h3>
                <p className="text-sm text-neutral-600">
                  เลือกบัญชีตามบทบาทที่ต้องการทดสอบ
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold mb-2">2. คัดลอกข้อมูล</h3>
                <p className="text-sm text-neutral-600">
                  คลิกปุ่ม <Copy className="w-3 h-3 inline" /> เพื่อคัดลอกอีเมลหรือรหัสผ่าน
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold mb-2">3. เข้าสู่ระบบ</h3>
                <p className="text-sm text-neutral-600">
                  ไปที่หน้า <a href="/login" className="text-primary-600 underline">Login</a> และกรอกข้อมูล
                </p>
              </div>
            </div>
          </div>

          {/* Guest Checkout Info */}
          <div className="mt-6 card bg-primary-50 border-primary-200">
            <h2 className="text-xl font-bold mb-4">💡 Guest Checkout</h2>
            <p className="text-neutral-700 mb-2">
              คุณสามารถทดสอบการจองโดยไม่ต้อง Login ได้:
            </p>
            <ul className="list-disc list-inside space-y-1 text-neutral-700">
              <li>ไปที่หน้า <a href="/services" className="text-primary-600 underline">รายการบริการ</a></li>
              <li>เลือกบริการที่ต้องการ</li>
              <li>กรอกข้อมูลติดต่อ (Guest) ในหน้าจอง</li>
              <li>ชำระเงินและดูใบสรุปการจอง</li>
            </ul>
          </div>

          {/* Reset Data */}
          <div className="mt-6 card bg-neutral-100">
            <h2 className="text-xl font-bold mb-4">🔄 รีเซ็ตข้อมูล</h2>
            <p className="text-neutral-700 mb-4">
              หากต้องการรีเซ็ตข้อมูลการทดสอบทั้งหมด:
            </p>
            <button
              onClick={() => {
                if (confirm('คุณต้องการล้างข้อมูลทั้งหมดใน localStorage และ sessionStorage ใช่หรือไม่?')) {
                  localStorage.clear()
                  sessionStorage.clear()
                  alert('ล้างข้อมูลเรียบร้อยแล้ว กำลังรีโหลดหน้า...')
                  window.location.reload()
                }
              }}
              className="btn-secondary"
            >
              ล้างข้อมูลทั้งหมด
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

