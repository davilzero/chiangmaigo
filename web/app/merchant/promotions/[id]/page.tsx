'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Edit, Calendar, Percent, DollarSign, Star, AlertCircle } from 'lucide-react'

export default function PromotionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const promotionId = params.id as string
  const [promotion, setPromotion] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('merchant-promotions')
      if (saved) {
        const parsed = JSON.parse(saved)
        const found = parsed.find((p: any) => p.id === promotionId)
        setPromotion(found)
      }
      setLoading(false)
    }
  }, [promotionId])

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

  if (!promotion) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">ไม่พบโปรโมชั่น</h1>
          <p className="text-neutral-600 mb-6">ไม่พบโปรโมชั่นที่คุณต้องการ</p>
          <Link href="/merchant/promotions" className="btn-primary">
            กลับไปหน้ารายการโปรโมชั่น
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">รายละเอียดโปรโมชั่น</h1>
            <div className="flex gap-2">
              <Link
                href={`/merchant/promotions/${promotionId}/edit`}
                className="btn-secondary flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                แก้ไข
              </Link>
              <button
                onClick={() => router.back()}
                className="btn-secondary"
              >
                กลับ
              </button>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{promotion.title}</h2>
                  {promotion.featured && (
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      แสดงในหน้าหลัก
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded text-xs ${
                    promotion.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}>
                    {promotion.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                  </span>
                </div>
                <p className="text-neutral-700 text-lg mb-4">{promotion.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>ระยะเวลาโปรโมชั่น</span>
                  </div>
                  <p className="font-medium">
                    {new Date(promotion.startDate).toLocaleDateString('th-TH')} - {new Date(promotion.endDate).toLocaleDateString('th-TH')}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
                    {promotion.discountType === 'percentage' ? (
                      <Percent className="w-4 h-4" />
                    ) : (
                      <DollarSign className="w-4 h-4" />
                    )}
                    <span>ส่วนลด</span>
                  </div>
                  <p className="font-bold text-primary-600 text-xl">
                    {promotion.discountType === 'percentage' 
                      ? `ลด ${promotion.discountValue}%`
                      : `ลด ฿${promotion.discountValue.toLocaleString()}`
                    }
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {promotion.daysUntilExpiry !== undefined && (
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">วันหมดอายุ</div>
                    {promotion.daysUntilExpiry <= 7 && (
                      <div className="flex items-center gap-2 text-yellow-600 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">ใกล้หมดอายุ ({promotion.daysUntilExpiry} วัน)</span>
                      </div>
                    )}
                    <p className="font-medium">
                      {promotion.daysUntilExpiry > 0 
                        ? `เหลืออีก ${promotion.daysUntilExpiry} วัน`
                        : 'หมดอายุแล้ว'
                      }
                    </p>
                  </div>
                )}

                {promotion.createdAt && (
                  <div>
                    <div className="text-sm text-neutral-600 mb-1">วันที่สร้าง</div>
                    <p className="font-medium">
                      {new Date(promotion.createdAt).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

