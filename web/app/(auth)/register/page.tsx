'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RegisterPage() {
  const search = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  // Load data from URL query params (for guest checkout)
  useEffect(() => {
    const email = search.get('email') || ''
    const name = search.get('name') || ''
    if (email || name) {
      setFormData((prev) => ({
        ...prev,
        email,
        name,
      }))
    }
  }, [search])

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12">
      <div className="card max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">สมัครสมาชิก</h1>
        
        {search.get('email') && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-primary-800">
              ✅ ข้อมูลของคุณถูกเติมให้อัตโนมัติแล้ว เพียงแค่ตั้งรหัสผ่านเพื่อสมัครสมาชิก
            </p>
          </div>
        )}
        
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              ชื่อ-นามสกุล
            </label>
            <input
              type="text"
              id="name"
              className="input"
              placeholder="ชื่อ-นามสกุล"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              อีเมล
            </label>
            <input
              type="email"
              id="email"
              className="input"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={!!search.get('email')}
            />
            {search.get('email') && (
              <p className="text-xs text-neutral-500 mt-1">อีเมลจากข้อมูลการจองของคุณ</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              id="phone"
              className="input"
              placeholder="0812345678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              รหัสผ่าน
            </label>
            <input
              type="password"
              id="password"
              className="input"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              ยืนยันรหัสผ่าน
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="input"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
          
          <label className="flex items-start gap-2">
            <input type="checkbox" className="rounded mt-1" required />
            <span className="text-sm">
              ฉันยอมรับ{' '}
              <Link href="/terms" className="text-primary-600 hover:underline">
                ข้อกำหนดและเงื่อนไข
              </Link>{' '}
              และ{' '}
              <Link href="/privacy" className="text-primary-600 hover:underline">
                นโยบายความเป็นส่วนตัว
              </Link>
            </span>
          </label>
          
          <button type="submit" className="btn-primary w-full">
            สมัครสมาชิก
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-600">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" className="text-primary-600 hover:underline font-medium">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

