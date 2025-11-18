'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Save, X } from 'lucide-react'

export default function EditPromotionPage() {
  const router = useRouter()
  const params = useParams()
  const promotionId = params.id as string
  const [loading, setLoading] = useState(true)
  const [promotion, setPromotion] = useState({
    id: '',
    title: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    startDate: '',
    endDate: '',
    featured: false,
    status: 'active',
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('merchant-promotions')
      if (saved) {
        const parsed = JSON.parse(saved)
        const found = parsed.find((p: any) => p.id === promotionId)
        if (found) {
          setPromotion({
            id: found.id,
            title: found.title || '',
            description: found.description || '',
            discountType: found.discountType || 'percentage',
            discountValue: found.discountValue || 0,
            startDate: found.startDate || '',
            endDate: found.endDate || '',
            featured: found.featured || false,
            status: found.status || 'active',
          })
        }
      }
      setLoading(false)
    }
  }, [promotionId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('merchant-promotions')
      if (saved) {
        const parsed = JSON.parse(saved)
        const updated = parsed.map((p: any) => 
          p.id === promotionId
            ? {
                ...p,
                ...promotion,
                daysUntilExpiry: Math.ceil((new Date(promotion.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
                updatedAt: new Date().toISOString(),
              }
            : p
        )
        localStorage.setItem('merchant-promotions', JSON.stringify(updated))
      }
    }
    
    router.push('/merchant/promotions')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">แก้ไขโปรโมชั่น</h1>
          <button
            onClick={() => router.back()}
            className="btn-secondary"
          >
            ยกเลิก
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">ข้อมูลโปรโมชั่น</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  ชื่อโปรโมชั่น <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  value={promotion.title}
                  onChange={(e) => setPromotion({ ...promotion, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  คำอธิบาย <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  className="input"
                  value={promotion.description}
                  onChange={(e) => setPromotion({ ...promotion, description: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    ประเภทส่วนลด <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="input"
                    value={promotion.discountType}
                    onChange={(e) => setPromotion({ ...promotion, discountType: e.target.value as any })}
                    required
                  >
                    <option value="percentage">เปอร์เซ็นต์ (%)</option>
                    <option value="fixed">จำนวนเงินคงที่ (฿)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {promotion.discountType === 'percentage' ? 'เปอร์เซ็นต์ส่วนลด' : 'จำนวนเงินส่วนลด'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={promotion.discountValue}
                    onChange={(e) => setPromotion({ ...promotion, discountValue: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step={promotion.discountType === 'percentage' ? '1' : '0.01'}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    วันที่เริ่มต้น <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={promotion.startDate}
                    onChange={(e) => setPromotion({ ...promotion, startDate: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    วันที่สิ้นสุด <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={promotion.endDate}
                    onChange={(e) => setPromotion({ ...promotion, endDate: e.target.value })}
                    required
                    min={promotion.startDate}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={promotion.featured}
                    onChange={(e) => setPromotion({ ...promotion, featured: e.target.checked })}
                  />
                  <span>แสดงในหน้าหลัก</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={promotion.status === 'active'}
                    onChange={(e) => setPromotion({ ...promotion, status: e.target.checked ? 'active' : 'inactive' })}
                  />
                  <span>เปิดใช้งาน</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary flex-1"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


