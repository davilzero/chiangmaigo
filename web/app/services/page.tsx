'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useMonetizationStore } from '@/lib/store/monetizationStore'

interface ServiceItem {
  id: string
  name: string
  description: string
  category: string
  price: number
  images: string[]
  rating: number
  reviewCount: number
}

export default function ServicesPage() {
  const searchParams = useSearchParams()
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const categoryFromUrl = searchParams.get('category') || 'ทั้งหมด'
  const [activeCategory, setActiveCategory] = useState<string>(categoryFromUrl)
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular')
  const [page, setPage] = useState(1)
  const pageSize = 9
  const { sponsoredServiceIds, loadFromStorage } = useMonetizationStore()

  useEffect(() => {
    const cat = searchParams.get('category') || 'ทั้งหมด'
    setActiveCategory(cat)
    setPage(1)
  }, [searchParams])

  useEffect(() => {
    loadFromStorage()
    const load = async () => {
      try {
        const res = await fetch('/api/services')
        const data = await res.json()
        setServices(data.services || [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [loadFromStorage])

  const categories = ['ทั้งหมด', 'ทัวร์', 'ที่พัก', 'ร้านอาหาร', 'กิจกรรม']

  const filtered = services
    .filter((s) => {
      const matchCat = activeCategory === 'ทั้งหมด' ? true : s.category === activeCategory
      const q = query.trim().toLowerCase()
      const matchQuery =
        q.length === 0 ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      return matchCat && matchQuery
    })
    .sort((a, b) => {
      // Sponsored มาก่อนเสมอ
      const aSponsored = sponsoredServiceIds.includes(a.id)
      const bSponsored = sponsoredServiceIds.includes(b.id)
      if (aSponsored !== bSponsored) return aSponsored ? -1 : 1
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
      // popular (ใช้ reviewCount เป็นตัวแทน)
      return (b.reviewCount || 0) - (a.reviewCount || 0)
    })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">บริการท่องเที่ยว</h1>
          
          {/* Search and Filter Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="ค้นหาบริการ..."
                className="input pl-12"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <button
              className="btn-secondary flex items-center gap-2"
              onClick={() => {
                setQuery('')
                setActiveCategory('ทั้งหมด')
                setSortBy('popular')
                setPage(1)
              }}
              aria-label="ล้างตัวกรอง"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden md:inline">รีเซ็ตตัวกรอง</span>
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setPage(1)
                }}
                className={`px-4 py-2 rounded-lg text-sm ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {/* Sort */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600">พบ {filtered.length} บริการ</p>
            <select
              className="input w-auto"
              value={sortBy}
              onChange={(e) => {
                const v = e.target.value as typeof sortBy
                setSortBy(v)
                setPage(1)
              }}
            >
              <option value="popular">เรียงตามความนิยม</option>
              <option value="price-asc">เรียงตามราคา: ต่ำ-สูง</option>
              <option value="price-desc">เรียงตามราคา: สูง-ต่ำ</option>
              <option value="rating">เรียงตามคะแนน</option>
            </select>
          </div>
        </div>
        
        {/* Services Grid */}
        {loading ? (
          <p className="text-neutral-600">กำลังโหลด...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paged.map((s) => (
              <Link
                key={s.id}
                href={`/services/${s.id}`}
                className="card hover:shadow-md transition-shadow relative"
              >
                <div className="aspect-video bg-neutral-200 rounded-lg mb-4 overflow-hidden relative">
                  {s.images?.[0] ? (
                    <Image
                      src={s.images[0]}
                      alt={s.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-sm">
                      ไม่มีรูปภาพ
                    </div>
                  )}
                  {sponsoredServiceIds.includes(s.id) && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Sponsored
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-1">{s.name}</h3>
                <p className="text-neutral-600 mb-3 line-clamp-2">{s.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(Math.round(s.rating || 0))}
                  </div>
                  <span className="text-sm text-neutral-600">({s.reviewCount || 0})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary-600 font-bold text-lg">฿{s.price.toLocaleString()}</span>
                  <span className="text-sm text-neutral-500">{s.category}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              className="px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ก่อนหน้า
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === p
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  {p}
                </button>
              )
            })}
            <button
              className="px-4 py-2 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              ถัดไป
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

