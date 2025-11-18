'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Star, Search } from 'lucide-react'

interface ReviewItem {
  id: string
  serviceName: string
  rating: number
  comment: string
  createdAt: string
}

export default function UserReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    // เดโม: โหลดจาก localStorage ถ้ามีรีวิวจากหน้า /user/bookings/[id]/review ในอนาคต
    const local = typeof window !== 'undefined' ? localStorage.getItem('user-reviews') : null
    const localList: ReviewItem[] = local ? JSON.parse(local) : []
    const mock: ReviewItem[] = [
      {
        id: 'rv-seed-1',
        serviceName: 'ทัวร์ดอยสุเทพ',
        rating: 5,
        comment: 'วิวสวยมาก ไกด์ดูแลดี',
        createdAt: '2024-01-10T09:00:00Z',
      },
    ]
    setReviews([...localList, ...mock])
  }, [])

  const filtered = reviews.filter(
    (r) =>
      r.serviceName.toLowerCase().includes(query.toLowerCase()) ||
      r.comment.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">รีวิวของฉัน</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <Link href="/user/dashboard" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ภาพรวม
              </Link>
              <Link href="/user/bookings" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                การจองของฉัน
              </Link>
              <Link href="/user/reviews" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                รีวิวของฉัน
              </Link>
              <Link href="/user/profile" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ข้อมูลส่วนตัว
              </Link>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search */}
            <div className="card">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาด้วยชื่อบริการหรือข้อความรีวิว..."
                    className="input pl-12"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-4">
              {filtered.map((rv) => (
                <div key={rv.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{rv.serviceName}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < rv.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-neutral-600">
                          {new Date(rv.createdAt).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                      <p className="text-neutral-700">{rv.comment}</p>
                    </div>
                    <div className="text-right">
                      <Link
                        href="/services/doi-suthep"
                        className="text-sm text-primary-600 hover:underline"
                      >
                        ดูบริการ
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="card text-center py-12">
                  <p className="text-neutral-600">ยังไม่มีรีวิว</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



