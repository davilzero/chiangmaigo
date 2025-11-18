'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, CreditCard, Edit, Trash2, Download } from 'lucide-react'

export default function UserPaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    const local = typeof window !== 'undefined' ? localStorage.getItem('user-payment-methods') : null
    const localList = local ? JSON.parse(local) : null
    const seed = [
      {
        id: 1,
        type: 'Visa',
        last4: '4242',
        expiryDate: '12/25',
        cardholderName: 'ชื่อ นามสกุล',
        isDefault: true,
      },
      {
        id: 2,
        type: 'Mastercard',
        last4: '8888',
        expiryDate: '06/26',
        cardholderName: 'ชื่อ นามสกุล',
        isDefault: false,
      },
    ]
    setPaymentMethods(localList || seed)
  }, [])

  const save = (list: any[]) => {
    setPaymentMethods(list)
    localStorage.setItem('user-payment-methods', JSON.stringify(list))
  }

  const addMethod = () => {
    const type = prompt('ประเภทบัตร (Visa/Mastercard/etc.)') || 'Visa'
    const last4 = prompt('เลขท้าย 4 หลัก') || '0000'
    const expiryDate = prompt('วันหมดอายุ (MM/YY)') || '12/30'
    const cardholderName = prompt('ชื่อบนบัตร') || 'ชื่อ นามสกุล'
    const next = [{ id: Date.now(), type, last4, expiryDate, cardholderName, isDefault: paymentMethods.length === 0 }, ...paymentMethods]
    save(next)
  }

  const editMethod = (id: number) => {
    const m = paymentMethods.find((x) => x.id === id)
    if (!m) return
    const type = prompt('ประเภทบัตร', m.type) || m.type
    const last4 = prompt('เลขท้าย 4 หลัก', m.last4) || m.last4
    const expiryDate = prompt('วันหมดอายุ (MM/YY)', m.expiryDate) || m.expiryDate
    const cardholderName = prompt('ชื่อบนบัตร', m.cardholderName) || m.cardholderName
    const next = paymentMethods.map((x) => (x.id === id ? { ...x, type, last4, expiryDate, cardholderName } : x))
    save(next)
  }

  const removeMethod = (id: number) => {
    if (!confirm('ลบวิธีการชำระเงินนี้?')) return
    const next = paymentMethods.filter((x) => x.id !== id)
    if (next.length && !next.some((x) => x.isDefault)) next[0].isDefault = true
    save(next)
  }

  const filtered = paymentMethods.filter(
    (m) =>
      m.type.toLowerCase().includes(query.toLowerCase()) ||
      m.cardholderName.toLowerCase().includes(query.toLowerCase()) ||
      m.last4.includes(query)
  )

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">จัดการวิธีการชำระเงิน</h1>
          <button className="btn-primary flex items-center gap-2" onClick={addMethod}>
            <Plus className="w-4 h-4" />
            เพิ่มบัตรใหม่
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <a href="/user/dashboard" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ภาพรวม
              </a>
              <a href="/user/profile" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ข้อมูลส่วนตัว
              </a>
              <a href="/user/addresses" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ที่อยู่
              </a>
              <a href="/user/payment-methods" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                วิธีการชำระเงิน
              </a>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filter */}
            <div className="card">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาวิธีการชำระเงิน..."
                    className="input pl-12"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <select className="input w-auto">
                  <option>เรียงตาม: ประเภทบัตร</option>
                  <option>เรียงตาม: วันที่เพิ่ม</option>
                  <option>เรียงตาม: ตัวอักษร</option>
                </select>
                <button className="btn-secondary flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  ส่งออก
                </button>
              </div>
            </div>
            
            {/* Payment Methods List */}
            <div className="space-y-4">
              {filtered.map((method) => (
                <div key={method.id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary-100 rounded-lg">
                        <CreditCard className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{method.type} •••• {method.last4}</h3>
                          {method.isDefault && (
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                              เริ่มต้น
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600">
                          {method.cardholderName} • หมดอายุ {method.expiryDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" onClick={() => editMethod(method.id)}>
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => removeMethod(method.id)}>
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

