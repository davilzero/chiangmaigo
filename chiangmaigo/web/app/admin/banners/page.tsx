'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, Calendar, History } from 'lucide-react'

export default function AdminBannersPage() {
  const [banners] = useState([
    {
      id: '1',
      title: 'โปรโมชั่นปีใหม่',
      image: '',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      order: 1,
    },
    {
      id: '2',
      title: 'แบนเนอร์หลัก',
      image: '',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      order: 2,
    },
    {
      id: '3',
      title: 'แบนเนอร์รอง',
      image: '',
      status: 'inactive',
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      order: 3,
    },
  ])

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">จัดการแบนเนอร์ (Admin Only!)</h1>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            สร้างแบนเนอร์ใหม่
          </button>
        </div>
        
        <div className="card">
          <div className="mb-6">
            <select className="input w-auto">
              <option>ทุกสถานะ</option>
              <option>ใช้งาน</option>
              <option>ไม่ใช้งาน</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {banners.map((banner) => (
              <div key={banner.id} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="w-32 h-20 bg-neutral-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{banner.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          banner.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {banner.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                        </span>
                        <span className="text-sm text-neutral-600">ลำดับ: {banner.order}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(banner.startDate).toLocaleDateString('th-TH')} - {new Date(banner.endDate).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" title="ดูตัวอย่าง">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" title="ประวัติการแก้ไข">
                        <History className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" title="แก้ไข">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="ลบ">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


