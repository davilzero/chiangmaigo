'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Edit, Trash2, Eye, Calendar, AlertCircle } from 'lucide-react'

export default function MerchantPromotionsPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all')
  const [sortBy, setSortBy] = useState<'latest' | 'name' | 'expiry'>('latest')
  const [promotions, setPromotions] = useState<any[]>([])

  useEffect(() => {
    // Load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('merchant-promotions')
      if (saved) {
        const parsed = JSON.parse(saved)
        setPromotions(parsed)
      } else {
        // Seed data
        const seed = [
          {
            id: '1',
            title: 'โปรโมชั่นปีใหม่',
            description: 'ส่วนลด 20% สำหรับการจองในเดือนมกราคม',
            discountType: 'percentage',
            discountValue: 20,
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            status: 'active',
            featured: true,
            daysUntilExpiry: 5,
            createdAt: '2024-01-01T00:00:00Z',
          },
          {
            id: '2',
            title: 'โปรโมชั่นพิเศษ',
            description: 'ลด 500 บาท',
            discountType: 'fixed',
            discountValue: 500,
            startDate: '2024-02-01',
            endDate: '2024-02-29',
            status: 'active',
            featured: false,
            daysUntilExpiry: 30,
            createdAt: '2024-01-15T00:00:00Z',
          },
        ]
        setPromotions(seed)
        localStorage.setItem('merchant-promotions', JSON.stringify(seed))
      }
    }
  }, [])

  const savePromotions = (newPromotions: any[]) => {
    setPromotions(newPromotions)
    if (typeof window !== 'undefined') {
      localStorage.setItem('merchant-promotions', JSON.stringify(newPromotions))
    }
  }

  const filteredAndSorted = useMemo(() => {
    let filtered = promotions.filter((promo) => {
      const matchQuery = 
        !query ||
        promo.title.toLowerCase().includes(query.toLowerCase()) ||
        promo.description.toLowerCase().includes(query.toLowerCase())
      
      const matchStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'active' && promo.status === 'active') ||
        (statusFilter === 'inactive' && promo.status === 'inactive') ||
        (statusFilter === 'expired' && promo.status === 'expired')
      
      return matchQuery && matchStatus
    })

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title)
      }
      if (sortBy === 'expiry') {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      }
      // latest
      return new Date(b.createdAt || b.startDate).getTime() - new Date(a.createdAt || a.startDate).getTime()
    })

    return filtered
  }, [promotions, query, statusFilter, sortBy])

  const handleDelete = (id: string) => {
    if (!confirm('คุณต้องการลบโปรโมชั่นนี้ใช่หรือไม่?')) return
    savePromotions(promotions.filter(p => p.id !== id))
  }

  const handleEdit = (id: string) => {
    router.push(`/merchant/promotions/${id}/edit`)
  }

  const handleView = (id: string) => {
    router.push(`/merchant/promotions/${id}`)
  }

  const handleToggleStatus = (id: string) => {
    savePromotions(promotions.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ))
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">จัดการโปรโมชั่น/ส่วนลด</h1>
          <button 
            onClick={() => router.push('/merchant/promotions/new')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            สร้างโปรโมชั่นใหม่
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <a href="/merchant/dashboard" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ภาพรวม
              </a>
              <a href="/merchant/services" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                จัดการบริการ
              </a>
              <a href="/merchant/bookings" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                การจอง
              </a>
              <a href="/merchant/promotions" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                โปรโมชั่น
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
                    placeholder="ค้นหาโปรโมชั่น..."
                    className="input pl-12"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <select 
                  className="input w-auto"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="active">ใช้งาน</option>
                  <option value="inactive">ไม่ใช้งาน</option>
                  <option value="expired">หมดอายุ</option>
                </select>
                <select 
                  className="input w-auto"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="latest">เรียงตาม: ล่าสุด</option>
                  <option value="name">เรียงตาม: ชื่อ</option>
                  <option value="expiry">เรียงตาม: วันหมดอายุ</option>
                </select>
              </div>
              <div className="text-sm text-neutral-600">
                พบ {filteredAndSorted.length} โปรโมชั่น
              </div>
            </div>
            
            {/* Promotions List */}
            {filteredAndSorted.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-neutral-600 text-lg mb-2">ไม่พบโปรโมชั่น</p>
                <p className="text-neutral-500 text-sm mb-4">
                  {query ? 'ลองค้นหาด้วยคำอื่น' : 'ยังไม่มีโปรโมชั่น'}
                </p>
                <button
                  onClick={() => router.push('/merchant/promotions/new')}
                  className="btn-primary"
                >
                  สร้างโปรโมชั่นใหม่
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSorted.map((promo) => (
                <div key={promo.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{promo.title}</h3>
                        {promo.featured && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                            แสดงในหน้าหลัก
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded text-xs ${
                          promo.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {promo.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                        </span>
                        {promo.daysUntilExpiry <= 7 && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            ใกล้หมดอายุ ({promo.daysUntilExpiry} วัน)
                          </span>
                        )}
                      </div>
                      <p className="text-neutral-700 mb-3">{promo.description}</p>
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(promo.startDate).toLocaleDateString('th-TH')} - {new Date(promo.endDate).toLocaleDateString('th-TH')}
                          </span>
                        </div>
                        <span className="font-semibold text-primary-600">
                          {promo.discountType === 'percentage' 
                            ? `ลด ${promo.discountValue}%`
                            : `ลด ฿${promo.discountValue.toLocaleString()}`
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(promo.id)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="ดูรายละเอียด"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(promo.id)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="แก้ไข"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(promo.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          promo.status === 'active'
                            ? 'text-yellow-600 hover:bg-yellow-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={promo.status === 'active' ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                      >
                        {promo.status === 'active' ? 'ปิด' : 'เปิด'}
                      </button>
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="ลบ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

