'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, CreditCard, Edit, Trash2, Download, X } from 'lucide-react'

export default function UserPaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    type: 'Visa',
    last4: '',
    expiryDate: '',
    cardholderName: '',
  })

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
    if (typeof window !== 'undefined') {
      localStorage.setItem('user-payment-methods', JSON.stringify(list))
    }
  }

  const openAddModal = () => {
    setFormData({
      type: 'Visa',
      last4: '',
      expiryDate: '',
      cardholderName: '',
    })
    setEditingId(null)
    setShowModal(true)
  }

  const openEditModal = (id: number) => {
    const m = paymentMethods.find((x) => x.id === id)
    if (!m) return
    setFormData({
      type: m.type,
      last4: m.last4,
      expiryDate: m.expiryDate,
      cardholderName: m.cardholderName,
    })
    setEditingId(id)
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.last4 || !formData.expiryDate || !formData.cardholderName) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    if (editingId !== null) {
      const next = paymentMethods.map((x) =>
        x.id === editingId ? { ...x, ...formData } : x
      )
      save(next)
    } else {
      const next = [
        {
          id: Date.now(),
          ...formData,
          isDefault: paymentMethods.length === 0,
        },
        ...paymentMethods,
      ]
      save(next)
    }
    setShowModal(false)
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
          <button className="btn-primary flex items-center gap-2" onClick={openAddModal}>
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
              {filtered.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-neutral-600 text-lg mb-2">ไม่พบวิธีการชำระเงิน</p>
                  <p className="text-neutral-500 text-sm">
                    {query ? 'ลองค้นหาด้วยคำอื่น' : 'ยังไม่มีวิธีการชำระเงิน'}
                  </p>
                </div>
              ) : (
                filtered.map((method) => (
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
                        <button
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                          onClick={() => openEditModal(method.id)}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          onClick={() => removeMethod(method.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {editingId !== null ? 'แก้ไขบัตร' : 'เพิ่มบัตรใหม่'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  ประเภทบัตร <span className="text-red-500">*</span>
                </label>
                <select
                  className="input"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="American Express">American Express</option>
                  <option value="JCB">JCB</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  เลขท้าย 4 หลัก <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="เช่น 4242"
                  value={formData.last4}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                    setFormData({ ...formData, last4: val })
                  }}
                  required
                  maxLength={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  วันหมดอายุ (MM/YY) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="เช่น 12/25"
                  value={formData.expiryDate}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '')
                    if (val.length >= 2) {
                      val = val.slice(0, 2) + '/' + val.slice(2, 4)
                    }
                    setFormData({ ...formData, expiryDate: val })
                  }}
                  required
                  maxLength={5}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  ชื่อบนบัตร <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="ชื่อ-นามสกุล"
                  value={formData.cardholderName}
                  onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                  required
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  ยกเลิก
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingId !== null ? 'บันทึกการแก้ไข' : 'เพิ่มบัตร'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
