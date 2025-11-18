'use client'

import { useEffect, useMemo, useState } from 'react'
import { Heart, Share2, MapPin, Calendar, Users, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface ServiceDetail {
  id: string
  name: string
  description: string
  category: string
  price: number
  images: string[]
  location: { address: string; lat: number; lng: number }
  rating: number
  reviewCount: number
  packages?: { id: string; name: string; price: number; duration: string }[]
}

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [service, setService] = useState<ServiceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [date, setDate] = useState<string>('')
  const [people, setPeople] = useState<number>(1)
  const [notes, setNotes] = useState<string>('')

  // Clear form data when component mounts if booking was completed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bookingCompleted = sessionStorage.getItem('booking-completed')
      if (bookingCompleted) {
        // Clear form
        setDate('')
        setPeople(1)
        setNotes('')
        sessionStorage.removeItem('booking-completed')
      }
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/services/${params.id}`)
        const data = await res.json()
        setService(data.service)
        // default select first package if exists
        if (data.service?.packages?.length) {
          setSelectedPackageId(data.service.packages[0].id)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  const selectedPackage = useMemo(() => {
    return service?.packages?.find((p) => p.id === selectedPackageId) || null
  }, [service, selectedPackageId])

  const unitPrice = selectedPackage ? Number(selectedPackage.price) : Number(service?.price || 0)
  const total = unitPrice * (people || 1)

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!service) return
    const pkg = selectedPackage
    const paramsObj = new URLSearchParams({
      id: service.id,
      name: service.name,
      packageId: pkg?.id || 'default',
      packageName: pkg?.name || 'แพ็คเกจพื้นฐาน',
      unitPrice: String(unitPrice),
      date,
      people: String(people),
      notes,
      total: String(total),
    })
    router.push(`/booking/confirm?${paramsObj.toString()}`)
  }

  if (loading) {
    return <div className="min-h-screen bg-neutral-50"><div className="container mx-auto px-4 py-8">กำลังโหลด...</div></div>
  }

  if (!service) {
    return <div className="min-h-screen bg-neutral-50"><div className="container mx-auto px-4 py-8">ไม่พบบริการ</div></div>
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <div className="aspect-video bg-neutral-200 rounded-lg overflow-hidden relative">
              {service.images?.[0] && (
                <Image src={service.images[0]} alt={service.name} fill className="object-cover" unoptimized />
              )}
            </div>
          </div>
          <div className="space-y-4">
            {(service.images || []).slice(1, 4).map((src, i) => (
              <div key={i} className="aspect-video bg-neutral-200 rounded-lg overflow-hidden relative">
                <Image src={src} alt={`${service.name} ${i + 2}`} fill className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Actions */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
                  <div className="flex items-center gap-4 text-neutral-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{service.location?.address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{service.rating} ({service.reviewCount} รีวิว)</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">รายละเอียด</h2>
              <p className="text-neutral-700 leading-relaxed">{service.description}</p>
            </div>
            
            {/* Packages */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">แพ็คเกจ</h2>
              <div className="space-y-4">
                {(service.packages && service.packages.length > 0 ? service.packages : [
                  { id: 'default', name: 'แพ็คเกจพื้นฐาน', price: service.price, duration: '1 วัน' },
                ]).map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedPackageId === pkg.id ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-primary-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{pkg.name}</h3>
                        <p className="text-sm text-neutral-600">ระยะเวลา: {pkg.duration}</p>
                      </div>
                      <span className="text-primary-600 font-bold">฿{Number(pkg.price).toLocaleString()}</span>
                    </div>
                    <button
                      className="btn-primary text-sm w-full mt-2"
                      onClick={() => setSelectedPackageId(pkg.id)}
                    >
                      เลือกแพ็คเกจนี้
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Reviews */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">รีวิว (128)</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-neutral-200 pb-4 last:border-0">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-10 h-10 bg-primary-200 rounded-full"></div>
                      <div>
                        <p className="font-semibold">ผู้ใช้ {i}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex text-yellow-400 text-sm">
                            {'★'.repeat(5)}
                          </div>
                          <span className="text-sm text-neutral-600">2 สัปดาห์ที่แล้ว</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-neutral-700">รีวิวที่ดีมาก บริการเป็นมืออาชีพ...</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* FAQ */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">คำถามที่พบบ่อย</h2>
              <div className="space-y-4">
                {[
                  { q: 'ต้องจองล่วงหน้ากี่วัน?', a: 'แนะนำให้จองล่วงหน้าอย่างน้อย 3 วัน' },
                  { q: 'สามารถยกเลิกการจองได้หรือไม่?', a: 'ยกเลิกได้ภายใน 24 ชั่วโมงก่อนวันบริการ' },
                ].map((faq, i) => (
                  <details key={i} className="border-b border-neutral-200 pb-4">
                    <summary className="font-semibold cursor-pointer">{faq.q}</summary>
                    <p className="mt-2 text-neutral-700">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
          
          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h2 className="text-xl font-bold mb-6">จองบริการ</h2>
              
              <form className="space-y-4" onSubmit={handleBook}>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    วันที่
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    จำนวนคน
                  </label>
                  <select
                    className="input"
                    value={people}
                    onChange={(e) => setPeople(Number(e.target.value))}
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} คน
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    แพ็คเกจ
                  </label>
                  <select
                    className="input"
                    value={selectedPackageId || 'default'}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                    required
                  >
                    {(service.packages && service.packages.length > 0
                      ? service.packages
                      : [{ id: 'default', name: 'แพ็คเกจพื้นฐาน', price: service.price, duration: '1 วัน' }]
                    ).map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - ฿{Number(pkg.price).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    ข้อกำหนดพิเศษ (ถ้ามี)
                  </label>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="ระบุข้อกำหนดพิเศษ..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span>ราคา/คน</span>
                    <span className="font-bold">฿{unitPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-600 mb-4">
                    <span>จำนวนคน</span>
                    <span>{people}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-neutral-200 pt-4">
                    <span>ยอดรวม</span>
                    <span className="text-primary-600">฿{total.toLocaleString()}</span>
                  </div>
                </div>
                
                <button type="submit" className="btn-primary w-full">
                  ดำเนินการจอง
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

