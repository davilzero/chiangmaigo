'use client'

import { useState } from 'react'
import { Search, Filter, Eye, Check, X, Download, History } from 'lucide-react'

export default function AdminAdvertisementsPage() {
  const [advertisements] = useState([
    {
      id: '1',
      merchant: 'ผู้ประกอบการ 1',
      title: 'โฆษณาบริการท่องเที่ยว',
      type: 'banner',
      status: 'pending',
      budget: 5000,
      startDate: '2024-02-01',
      endDate: '2024-02-29',
    },
    {
      id: '2',
      merchant: 'ผู้ประกอบการ 2',
      title: 'โฆษณาโปรโมชั่น',
      type: 'sponsored',
      status: 'active',
      budget: 10000,
      startDate: '2024-01-15',
      endDate: '2024-03-15',
    },
  ])

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">จัดการโฆษณา (Admin Only!)</h1>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            ส่งออกรายงานโฆษณา
          </button>
        </div>
        
        <div className="card">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="ค้นหาโฆษณา..."
                className="input pl-12"
              />
            </div>
            <select className="input w-auto">
              <option>ทุกผู้ประกอบการ</option>
              <option>ผู้ประกอบการ 1</option>
              <option>ผู้ประกอบการ 2</option>
            </select>
            <select className="input w-auto">
              <option>ทุกประเภท</option>
              <option>Banner</option>
              <option>Sponsored</option>
            </select>
            <select className="input w-auto">
              <option>ทุกสถานะ</option>
              <option>รออนุมัติ</option>
              <option>ใช้งาน</option>
              <option>ปฏิเสธ</option>
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold">ผู้ประกอบการ</th>
                  <th className="text-left py-3 px-4 font-semibold">หัวข้อ</th>
                  <th className="text-left py-3 px-4 font-semibold">ประเภท</th>
                  <th className="text-left py-3 px-4 font-semibold">งบประมาณ</th>
                  <th className="text-left py-3 px-4 font-semibold">ระยะเวลา</th>
                  <th className="text-left py-3 px-4 font-semibold">สถานะ</th>
                  <th className="text-right py-3 px-4 font-semibold">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {advertisements.map((ad) => (
                  <tr key={ad.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-4">{ad.merchant}</td>
                    <td className="py-4 px-4 font-medium">{ad.title}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {ad.type}
                      </span>
                    </td>
                    <td className="py-4 px-4">฿{ad.budget.toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-neutral-600">
                      {new Date(ad.startDate).toLocaleDateString('th-TH')} - {new Date(ad.endDate).toLocaleDateString('th-TH')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        ad.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : ad.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {ad.status === 'active' ? 'ใช้งาน' : ad.status === 'pending' ? 'รออนุมัติ' : 'ปฏิเสธ'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" title="ดูตัวอย่าง">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" title="ประวัติการแก้ไข">
                          <History className="w-4 h-4" />
                        </button>
                        {ad.status === 'pending' && (
                          <>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="อนุมัติ">
                              <Check className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="ปฏิเสธ">
                              <X className="w-4 h-4" />
                            </button>
                          </>
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

