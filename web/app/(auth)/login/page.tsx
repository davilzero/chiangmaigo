'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const login = useAuthStore((s) => s.login)
  const setUser = useAuthStore((s) => s.setUser)
  const setToken = useAuthStore((s) => s.setToken)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-fill from query parameters
  useEffect(() => {
    const emailParam = searchParams.get('email')
    const passwordParam = searchParams.get('password')
    if (emailParam) setEmail(emailParam)
    if (passwordParam) setPassword(passwordParam)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      router.push('/user/dashboard')
    } catch (err: any) {
      setError(err?.message || 'เข้าสู่ระบบไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="card max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">เข้าสู่ระบบ</h1>
        
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              อีเมล
            </label>
            <input
              type="email"
              id="email"
              className="input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">จดจำฉัน</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-primary-600 hover:underline">
              ลืมรหัสผ่าน?
            </Link>
          </div>
          
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-neutral-600">
            ยังไม่มีบัญชี?{' '}
            <Link href="/register" className="text-primary-600 hover:underline font-medium">
              สมัครสมาชิก
            </Link>
          </p>
          <p className="text-xs text-neutral-500">
            หรือ{' '}
            <Link href="/test-accounts" className="text-primary-600 hover:underline">
              ดูรหัสทดสอบ
            </Link>
          </p>
        </div>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">หรือ</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              className="btn-secondary"
              onClick={() => {
                // เดโม OAuth: ตั้งค่าผู้ใช้ทันทีโดยไม่เรียก provider จริง
                setUser({
                  id: 'oauth-google',
                  email: 'google-demo@chiangmaigo.local',
                  name: 'Google User (Demo)',
                  role: 'customer',
                })
                setToken('mock-oauth-token')
                router.push('/user/dashboard')
              }}
            >
              Google
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setUser({
                  id: 'oauth-facebook',
                  email: 'facebook-demo@chiangmaigo.local',
                  name: 'Facebook User (Demo)',
                  role: 'customer',
                })
                setToken('mock-oauth-token')
                router.push('/user/dashboard')
              }}
            >
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

