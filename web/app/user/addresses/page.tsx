'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, X } from 'lucide-react'

export default function UserAddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'ที่อยู่สำหรับออกใบเสร็จ',
  })

  useEffect(() => {
    const local = typeof window !== 'undefined' ? localStorage.getItem('user-addresses') : null
    const localList = local ? JSON.parse(local) : null
    const seed = [
      {
        id: 1,
        name: 'ที่อยู่บ้าน',
        address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพมหานคร 10110',
        type: 'ที่อยู่สำหรับออกใบเสร็จ',
        isDefault: true,
      },
      {
        id: 2,
        name: 'ที่ทำงาน',
        address: '456 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพมหานคร 10500',
        type: 'ที่อยู่สำหรับจัดส่งเอกสาร',
        isDefault: false,
      },
    ]
    setAddresses(localList || seed)
  }, [])

  const save = (list: any[]) => {
    setAddresses(list)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user-addresses', JSON.stringify(list))
    }
  }

  const openAddModal = () => {
    setFormData({ name: '', address: '', type: 'ที่อยู่สำหรับออกใบเสร็จ' })
    setEditingId(null)
    setShowModal(true)
  }

  const openEditModal = (id: number) => {
    const item = addresses.find((a) => a.id === id)
    if (!item) return
    setFormData({
      name: item.name,
      address: item.address,
      type: item.type,
    })
    setEditingId(id)
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.address) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    if (editingId !== null) {
      const next = addresses.map((a) =>
        a.id === editingId ? { ...a, ...formData } : a
      )
      save(next)
    } else {
      const next = [
        {
          id: Date.now(),
          ...formData,
          isDefault: addresses.length === 0,
        },
        ...addresses,
      ]
      save(next)
    }
    setShowModal(false)
  }

  const removeAddress = (id: number) => {
    if (!confirm('ลบที่อยู่นี้?')) return
    const next = addresses.filter((a) => a.id !== id)
    if (next.length && !next.some((a) => a.isDefault)) next[0].isDefault = true
    save(next)
  }

  const filtered = addresses.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.address.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">จัดการที่อยู่</h1>
          <button className="btn-primary flex items-center gap-2" onClick={openAddModal}>
            <Plus className="w-4 h-4" />
            เพิ่มที่อยู่ใหม่
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
              <a href="/user/addresses" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                ที่อยู่
              </a>
              <a href="/user/payment-methods" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
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
                    placeholder="ค้นหาที่อยู่..."
                    className="input pl-12"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <select className="input w-auto">
                  <option>เรียงตาม: ชื่อ</option>
                  <option>เรียงตาม: วันที่เพิ่ม</option>
                  <option>เรียงตาม: ประเภท</option>
                </select>
              </div>
            </div>
            
            {/* Addresses List */}
            <div className="space-y-4">
              {filtered.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-neutral-600 text-lg mb-2">ไม่พบที่อยู่</p>
                  <p className="text-neutral-500 text-sm">
                    {query ? 'ลองค้นหาด้วยคำอื่น' : 'ยังไม่มีที่อยู่'}
                  </p>
                </div>
              ) : (
                filtered.map((address) => (
                  <div key={address.id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{address.name}</h3>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                              เริ่มต้น
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-700 mb-2">{address.address}</p>
                        <p className="text-sm text-neutral-600">{address.type}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                          onClick={() => openEditModal(address.id)}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          onClick={() => removeAddress(address.id)}
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
                {editingId !== null ? 'แก้ไขที่อยู่' : 'เพิ่มที่อยู่ใหม่'}
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
                  ชื่อที่อยู่ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="เช่น บ้าน/ที่ทำงาน"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  รายละเอียดที่อยู่ <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  className="input"
                  placeholder="กรอกที่อยู่เต็ม"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  ประเภท <span className="text-red-500">*</span>
                </label>
                <select
                  className="input"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="ที่อยู่สำหรับออกใบเสร็จ">ที่อยู่สำหรับออกใบเสร็จ</option>
                  <option value="ที่อยู่สำหรับจัดส่งเอกสาร">ที่อยู่สำหรับจัดส่งเอกสาร</option>
                </select>
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
                  {editingId !== null ? 'บันทึกการแก้ไข' : 'เพิ่มที่อยู่'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
