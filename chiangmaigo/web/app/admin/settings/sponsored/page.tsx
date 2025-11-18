'use client'

import { useEffect, useState } from 'react'
import { useMonetizationStore } from '@/lib/store/monetizationStore'
import { useAuthStore } from '@/lib/store/authStore'
import { logEditHistory } from '@/lib/utils/editHistory'
import { Search, Star, Check, X } from 'lucide-react'
import { mockServices } from '@/lib/mock/services'

export default function AdminSponsoredServicesPage() {
  const { user } = useAuthStore()
  const {
    sponsoredServiceIds,
    setSettings,
    loadFromStorage,
  } = useMonetizationStore()

  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด')

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  const categories = ['ทั้งหมด', 'ทัวร์', 'ที่พัก', 'ร้านอาหาร', 'กิจกรรม']

  const filteredServices = mockServices.filter((service) => {
    const matchQuery = 
      !query ||
      service.name.toLowerCase().includes(query.toLowerCase()) ||
      service.description.toLowerCase().includes(query.toLowerCase())
    
    const matchCategory = 
      selectedCategory === 'ทั้งหมด' ||
      service.category === selectedCategory
    
    return matchQuery && matchCategory
  })

  const toggleSponsored = (serviceId: string) => {
    const isSponsored = sponsoredServiceIds.includes(serviceId)
    const newSponsored = isSponsored
      ? sponsoredServiceIds.filter(id => id !== serviceId)
      : [...sponsoredServiceIds, serviceId]
    
    setSettings({ sponsoredServiceIds: newSponsored })
    
    // Log edit history
    if (user) {
      logEditHistory({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: isSponsored ? 'deactivate' : 'activate',
        entityType: 'sponsored-service',
        entityId: serviceId,
      })
    }
  }

  const clearAllSponsored = () => {
    if (confirm('คุณต้องการลบบริการสปอนเซอร์ทั้งหมดใช่หรือไม่?')) {
      setSettings({ sponsoredServiceIds: [] })
      
      // Log edit history
      if (user) {
        logEditHistory({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action: 'delete',
          entityType: 'sponsored-service',
          entityId: 'all',
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">จัดการบริการยอดนิยม / สปอนเซอร์</h1>
            <p className="text-neutral-600">
              เลือกบริการที่จะแสดงเป็นบริการยอดนิยม (Sponsored) ในหน้าแรกและหน้ารายการบริการ
            </p>
          </div>
          {sponsoredServiceIds.length > 0 && (
            <button
              onClick={clearAllSponsored}
              className="btn-secondary text-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              ลบทั้งหมด
            </button>
          )}
        </div>

        {/* Summary */}
        <div className="card mb-6 bg-primary-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-primary-800 mb-1">
                บริการสปอนเซอร์ปัจจุบัน
              </h2>
              <p className="text-sm text-primary-700">
                มีบริการสปอนเซอร์ทั้งหมด <span className="font-bold text-lg">{sponsoredServiceIds.length}</span> รายการ
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold text-primary-700">
                {sponsoredServiceIds.length}
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="ค้นหาบริการ..."
                className="input pl-12"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => {
            const isSponsored = sponsoredServiceIds.includes(service.id)
            return (
              <div
                key={service.id}
                className={`card cursor-pointer transition-all hover:shadow-lg ${
                  isSponsored ? 'border-2 border-primary-500 bg-primary-50' : ''
                }`}
                onClick={() => toggleSponsored(service.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                    <p className="text-sm text-neutral-600 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                  {isSponsored && (
                    <div className="ml-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                  <div className="space-y-1">
                    <div className="text-sm text-neutral-600">
                      <span className="font-medium">หมวดหมู่:</span> {service.category}
                    </div>
                    <div className="text-sm text-neutral-600">
                      <span className="font-medium">ราคา:</span> ฿{service.price.toLocaleString()}
                    </div>
                    {service.rating > 0 && (
                      <div className="text-sm text-neutral-600">
                        <span className="font-medium">คะแนน:</span> {service.rating} ⭐
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSponsored(service.id)
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isSponsored
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                    title={isSponsored ? 'ลบออกจากสปอนเซอร์' : 'เพิ่มเป็นสปอนเซอร์'}
                  >
                    {isSponsored ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Star className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-neutral-600 text-lg mb-2">ไม่พบบริการ</p>
            <p className="text-neutral-500 text-sm">
              {query ? 'ลองค้นหาด้วยคำอื่น' : 'ยังไม่มีบริการในหมวดหมู่นี้'}
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="card mt-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">💡 วิธีใช้งาน</h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>คลิกที่การ์ดบริการเพื่อเพิ่ม/ลบออกจากรายการสปอนเซอร์</li>
            <li>บริการสปอนเซอร์จะแสดงก่อนบริการอื่นๆ ในหน้ารายการบริการ</li>
            <li>บริการสปอนเซอร์จะมี Badge "Sponsored" แสดงในหน้ารายการ</li>
            <li>สามารถเลือกได้หลายบริการ</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

