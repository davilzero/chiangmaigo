'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Save, ArrowLeft } from 'lucide-react'

export default function AdminUsersNewPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'customer' | 'merchant' | 'admin'>('customer')
  const [status, setStatus] = useState<'active' | 'suspended'>('active')
  const [submitting, setSubmitting] = useState(false)
  const STORAGE_KEY = 'admin-users'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      alert('กรุณากรอกชื่อและอีเมล')
      return
    }
    setSubmitting(true)
    try {
      let list: any[] = []
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY)
        list = saved ? JSON.parse(saved) : []
      }
      const newUser = {
        id: `${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        role,
        status,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      const next = [newUser, ...list]
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      }
      router.push('/admin/users')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">เพิ่มผู้ใช้ใหม่</h1>
          <button
            onClick={() => router.push('/admin/users')}
            className="px-3 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-50 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปจัดการผู้ใช้
          </button>
        </div>

        <div className="card max-w-2xl">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">ชื่อ</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น สมชาย ใจดี"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">อีเมล</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">บทบาท</label>
                <select
                  className="input"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                >
                  <option value="customer">ลูกค้า</option>
                  <option value="merchant">ผู้ประกอบการ</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">สถานะ</label>
                <select
                  className="input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="active">ใช้งาน</option>
                  <option value="suspended">ระงับ</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                บันทึกผู้ใช้
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}



