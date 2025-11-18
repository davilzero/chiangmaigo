'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function MerchantServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all')

  const loadServices = () => {
    // seed list
    const seed = [
      { id: '1', name: 'ทัวร์ดอยสุเทพ', status: 'active', bookings: 45, rating: 4.5 },
      { id: '2', name: 'กิจกรรมทำอาหาร', status: 'active', bookings: 32, rating: 4.8 },
      { id: '3', name: 'ที่พักรีสอร์ท', status: 'pending', bookings: 0, rating: 0 },
    ]
    // load user-created services (demo) from localStorage
    let created: any[] = []
    if (typeof window !== 'undefined') {
      const list = localStorage.getItem('merchant-services')
      if (list) {
        const parsed = JSON.parse(list)
        created = parsed.map((s: any, idx: number) => ({
          id: s.id || `local-${idx}-${s.createdAt || Date.now()}`,
          name: s.name || 'บริการใหม่',
          status: s.status || 'pending',
          bookings: s.bookings || 0,
          rating: s.rating || 0,
          ...s, // Keep all original data
        }))
      } else {
        // backward compatibility for previous single save key
        const one = localStorage.getItem('merchant-new-service')
        if (one) {
          const s = JSON.parse(one)
          created = [
            {
              id: `local-${Date.now()}`,
              name: s.name || 'บริการใหม่',
              status: 'pending',
              bookings: 0,
              rating: 0,
              ...s,
            },
          ]
        }
      }
    }
    setServices([...created, ...seed])
  }

  useEffect(() => {
    loadServices()
  }, [])

  const handleDelete = (serviceId: string) => {
    if (!confirm('คุณต้องการลบบริการนี้ใช่หรือไม่?')) return
    
    // Remove from localStorage if it's a local service
    if (typeof window !== 'undefined' && String(serviceId).startsWith('local-')) {
      const list = localStorage.getItem('merchant-services')
      if (list) {
        const parsed = JSON.parse(list)
        const filtered = parsed.filter((s: any, idx: number) => {
          const id = s.id || `local-${idx}-${s.createdAt || Date.now()}`
          return id !== serviceId
        })
        localStorage.setItem('merchant-services', JSON.stringify(filtered))
      }
    }
    
    // Reload services
    loadServices()
  }

  const handleEdit = (serviceId: string) => {
    router.push(`/merchant/services/${serviceId}/edit`)
  }

  const getServiceUrl = (service: any) => {
    // For seed services, try to find matching service in mock data
    if (!String(service.id).startsWith('local-')) {
      // Try to match with mock services by name
      const mockServices = [
        { id: 'doi-suthep', name: 'ทัวร์ดอยสุเทพ' },
        { id: 'cooking-class', name: 'กิจกรรมทำอาหาร' },
        { id: 'resort', name: 'ที่พักรีสอร์ท' },
      ]
      const matched = mockServices.find(m => m.name === service.name)
      if (matched) return `/services/${matched.id}`
    }
    // For local services or if no match, show alert
    return '#'
  }

  const handleView = (service: any) => {
    const url = getServiceUrl(service)
    if (url === '#') {
      alert('บริการนี้ยังไม่ได้รับการอนุมัติ จึงยังไม่สามารถดูได้')
    } else {
      window.open(url, '_blank')
    }
  }

  const filtered = services.filter((s) => {
    const matchQ = s.name.toLowerCase().includes(query.toLowerCase())
    const matchStatus = statusFilter === 'all' ? true : s.status === statusFilter
    return matchQ && matchStatus
  })

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">จัดการบริการ</h1>
          <Link href="/merchant/services/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            เพิ่มบริการใหม่
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <Link href="/merchant/dashboard" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ภาพรวม
              </Link>
              <Link href="/merchant/services" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                จัดการบริการ
              </Link>
              <Link href="/merchant/bookings" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                การจอง
              </Link>
              <Link href="/merchant/promotions" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                โปรโมชั่น
              </Link>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filter */}
            <div className="card">
              <div className="flex gap-4">
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
                <select
                  className="input w-auto"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="active">ใช้งาน</option>
                  <option value="pending">รออนุมัติ</option>
                  <option value="suspended">ระงับ</option>
                </select>
              </div>
            </div>
            
            {/* Services Table */}
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-3 px-4 font-semibold">บริการ</th>
                      <th className="text-left py-3 px-4 font-semibold">สถานะ</th>
                      <th className="text-left py-3 px-4 font-semibold">การจอง</th>
                      <th className="text-left py-3 px-4 font-semibold">คะแนน</th>
                      <th className="text-right py-3 px-4 font-semibold">การดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((service) => (
                      <tr key={service.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-4 px-4">
                          <div className="font-semibold">{service.name}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            service.status === 'active' 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {service.status === 'active' ? 'ใช้งาน' : service.status === 'pending' ? 'รออนุมัติ' : 'ระงับ'}
                          </span>
                        </td>
                        <td className="py-4 px-4">{service.bookings}</td>
                        <td className="py-4 px-4">
                          {service.rating > 0 ? `${service.rating} ⭐` : '-'}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(service)}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="ดูบริการ"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(service.id)}
                              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="แก้ไข"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="ลบ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
      </div>
    </div>
  )
}

