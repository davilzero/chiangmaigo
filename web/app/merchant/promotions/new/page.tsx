'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, X, Calendar } from 'lucide-react'

export default function NewPromotionPage() {
  const router = useRouter()
  const [promotion, setPromotion] = useState({
    title: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    startDate: '',
    endDate: '',
    featured: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('merchant-promotions')
      const existing = saved ? JSON.parse(saved) : []
      const newPromo = {
        id: `promo-${Date.now()}`,
        ...promotion,
        status: 'active',
        daysUntilExpiry: Math.ceil((new Date(promotion.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem('merchant-promotions', JSON.stringify([newPromo, ...existing]))
    }
    
    router.push('/merchant/promotions')
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">สร้างโปรโมชั่นใหม่</h1>
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
                  placeholder="เช่น โปรโมชั่นปีใหม่"
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
                  placeholder="อธิบายรายละเอียดโปรโมชั่น"
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
                    placeholder={promotion.discountType === 'percentage' ? 'เช่น 20' : 'เช่น 500'}
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
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={promotion.featured}
                    onChange={(e) => setPromotion({ ...promotion, featured: e.target.checked })}
                  />
                  <span>แสดงในหน้าหลัก</span>
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
              บันทึกโปรโมชั่น
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


