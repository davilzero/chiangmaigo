'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, Filter, Check, X, Eye, Image as ImageIcon, Download } from 'lucide-react'
import Link from 'next/link'
import { mockServices } from '@/lib/mock/services'
import { useAuthStore } from '@/lib/store/authStore'
import { logEditHistory } from '@/lib/utils/editHistory'

export default function AdminServicesPage() {
  const { user } = useAuthStore()
  const [services, setServices] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ทุกหมวดหมู่')
  const [statusFilter, setStatusFilter] = useState('ทุกสถานะ')
  const [imageFilter, setImageFilter] = useState('ทุกสถานะรูปภาพ')
  const publishedIds = useMemo(() => new Set(mockServices.map((s) => s.id)), [])

  useEffect(() => {
    const seed = [
      {
        id: 'doi-suthep',
        name: 'ทัวร์ดอยสุเทพ',
        merchant: 'ผู้ประกอบการ 1',
        category: 'ทัวร์',
        status: 'pending',
        imageStatus: 'approved',
        price: 1500,
        createdAt: '2024-01-01',
      },
      {
        id: 'elephant-nature-park',
        name: 'Elephant Nature Park',
        merchant: 'ผู้ประกอบการ 2',
        category: 'กิจกรรม',
        status: 'active',
        imageStatus: 'approved',
        price: 800,
        createdAt: '2024-01-02',
      },
      {
        id: 'wat-phra-singh',
        name: 'วัดพระสิงห์',
        merchant: 'ผู้ประกอบการ 3',
        category: 'ทัวร์',
        status: 'pending',
        imageStatus: 'pending',
        price: 2500,
        createdAt: '2024-01-03',
      },
    ]
    // Load merchant-created pending services for review (demo)
    let created: any[] = []
    if (typeof window !== 'undefined') {
      const list = localStorage.getItem('merchant-services')
      if (list) {
        const parsed = JSON.parse(list)
        created = parsed.map((s: any, idx: number) => ({
          id: s.id || `pending-${idx}`,
          name: s.name || 'บริการใหม่',
          merchant: s.merchantName || 'ผู้ประกอบการ (ใหม่)',
          category: s.category || 'ทัวร์',
          status: 'pending',
          imageStatus: 'pending',
          price: Number(s.price || 0),
          createdAt: s.createdAt || new Date().toISOString().slice(0, 10),
        }))
      }
      // Apply admin overrides if any
      const overrides = localStorage.getItem('admin-services-status')
      const overrideMap: Record<string, any> = overrides ? JSON.parse(overrides) : {}
      const merged = [...created, ...seed].map((svc) => {
        const ov = overrideMap[svc.id]
        return ov ? { ...svc, ...ov } : svc
      })
      setServices(merged)
    } else {
      setServices([...created, ...seed])
    }
  }, [])

  const persistServiceChange = (id: string, changes: Partial<any>, action: string = 'update') => {
    setServices((prev) => {
      const oldService = prev.find(s => s.id === id)
      const next = prev.map((s) => (s.id === id ? { ...s, ...changes } : s))
      // persist overrides
      if (typeof window !== 'undefined') {
        const overrides = localStorage.getItem('admin-services-status')
        const map: Record<string, any> = overrides ? JSON.parse(overrides) : {}
        map[id] = { ...(map[id] || {}), ...changes }
        localStorage.setItem('admin-services-status', JSON.stringify(map))
      }
      
      // Log edit history
      if (user && oldService) {
        const changeEntries = Object.keys(changes).map(key => ({
          field: key,
          oldValue: oldService[key],
          newValue: changes[key],
        }))
        
        logEditHistory({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action: action,
          entityType: 'service',
          entityId: id,
          changes: changeEntries.length > 0 ? changeEntries : undefined,
        })
      }
      
      return next
    })
  }

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchQ =
        query.trim().length === 0 ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.merchant?.toLowerCase().includes(query.toLowerCase())
      const matchCat = categoryFilter === 'ทุกหมวดหมู่' ? true : s.category === categoryFilter
      const matchStatus =
        statusFilter === 'ทุกสถานะ'
          ? true
          : statusFilter === 'ใช้งาน'
          ? s.status === 'active'
          : statusFilter === 'รออนุมัติ'
          ? s.status === 'pending'
          : s.status === 'suspended'
      const matchImage =
        imageFilter === 'ทุกสถานะรูปภาพ'
          ? true
          : imageFilter === 'อนุมัติแล้ว'
          ? s.imageStatus === 'approved'
          : imageFilter === 'รออนุมัติ'
          ? s.imageStatus === 'pending'
          : s.imageStatus === 'rejected'
      return matchQ && matchCat && matchStatus && matchImage
    })
  }, [services, query, categoryFilter, statusFilter, imageFilter])

  const exportServices = () => {
    const data = JSON.stringify(services, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'services-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">จัดการบริการ (Admin Only!)</h1>
          <button onClick={exportServices} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            ส่งออกรายการบริการ
          </button>
        </div>
        
        <div className="card">
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
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
            <select className="input w-auto" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option>ทุกหมวดหมู่</option>
              <option>ทัวร์</option>
              <option>ที่พัก</option>
              <option>ร้านอาหาร</option>
              <option>กิจกรรม</option>
            </select>
            <select className="input w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option>ทุกสถานะ</option>
              <option>ใช้งาน</option>
              <option>รออนุมัติ</option>
              <option>ระงับ</option>
            </select>
            <select className="input w-auto" value={imageFilter} onChange={(e) => setImageFilter(e.target.value)}>
              <option>ทุกสถานะรูปภาพ</option>
              <option>อนุมัติแล้ว</option>
              <option>รออนุมัติ</option>
              <option>ปฏิเสธ</option>
            </select>
          </div>
          
          {/* Services Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold">บริการ</th>
                  <th className="text-left py-3 px-4 font-semibold">ผู้ประกอบการ</th>
                  <th className="text-left py-3 px-4 font-semibold">หมวดหมู่</th>
                  <th className="text-left py-3 px-4 font-semibold">ราคา</th>
                  <th className="text-left py-3 px-4 font-semibold">สถานะ</th>
                  <th className="text-left py-3 px-4 font-semibold">รูปภาพ</th>
                  <th className="text-right py-3 px-4 font-semibold">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((service) => (
                  <tr key={service.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-4">
                      <div className="font-medium">
                        {publishedIds.has(service.id) ? (
                          <Link href={`/services/${service.id}`} className="text-primary-600 hover:underline">
                            {service.name}
                          </Link>
                        ) : (
                          <span>{service.name}</span>
                        )}
                        {!publishedIds.has(service.id) && (
                          <span className="ml-2 text-xs text-neutral-500">(ยังไม่เผยแพร่)</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">{service.merchant}</td>
                    <td className="py-4 px-4">{service.category}</td>
                    <td className="py-4 px-4">฿{service.price.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        service.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : service.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {service.status === 'active' ? 'ใช้งาน' : service.status === 'pending' ? 'รออนุมัติ' : 'ระงับ'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        service.imageStatus === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : service.imageStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {service.imageStatus === 'approved' ? 'อนุมัติแล้ว' : service.imageStatus === 'pending' ? 'รออนุมัติ' : 'ปฏิเสธ'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                          title="ดู"
                          onClick={() => {
                            if (publishedIds.has(service.id)) {
                              window.open(`/services/${service.id}`, '_blank')
                            } else {
                              alert('บริการนี้ยังไม่เผยแพร่/ไม่อยู่ในรายการสาธารณะ')
                            }
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                          title="จัดการรูปภาพ"
                          onClick={() => {
                            const next = service.imageStatus === 'pending' ? 'approved' : service.imageStatus === 'approved' ? 'rejected' : 'pending'
                            persistServiceChange(service.id, { imageStatus: next }, next === 'approved' ? 'approve' : next === 'rejected' ? 'reject' : 'update')
                          }}
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                        {service.status === 'pending' && (
                          <>
                            <button
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="อนุมัติ"
                              onClick={() => persistServiceChange(service.id, { status: 'active' }, 'approve')}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="ปฏิเสธ"
                              onClick={() => persistServiceChange(service.id, { status: 'suspended' }, 'suspend')}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {service.status === 'active' && (
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="ระงับ"
                            onClick={() => persistServiceChange(service.id, { status: 'suspended' }, 'suspend')}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        {service.status === 'suspended' && (
                          <button
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="ปลดระงับ"
                            onClick={() => persistServiceChange(service.id, { status: 'active' }, 'activate')}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

