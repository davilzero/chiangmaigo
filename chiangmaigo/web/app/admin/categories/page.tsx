'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Languages, ArrowUp, ArrowDown } from 'lucide-react'

export default function AdminCategoriesPage() {
  const [categories] = useState([
    { id: '1', name: 'ทัวร์', nameEn: 'Tours', nameZh: '旅游', order: 1 },
    { id: '2', name: 'ที่พัก', nameEn: 'Accommodation', nameZh: '住宿', order: 2 },
    { id: '3', name: 'ร้านอาหาร', nameEn: 'Restaurants', nameZh: '餐厅', order: 3 },
    { id: '4', name: 'กิจกรรม', nameEn: 'Activities', nameZh: '活动', order: 4 },
  ])

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">จัดการหมวดหมู่บริการ (Admin Only!)</h1>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            เพิ่มหมวดหมู่ใหม่
          </button>
        </div>
        
        <div className="card">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-primary-600" />
              <span className="font-semibold">ตัวเลือกการจัดการภาษา</span>
            </div>
            <select className="input w-auto">
              <option>เรียงตามตัวอักษร</option>
              <option>เรียงตามลำดับ</option>
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold">ลำดับ</th>
                  <th className="text-left py-3 px-4 font-semibold">ชื่อ (ไทย)</th>
                  <th className="text-left py-3 px-4 font-semibold">ชื่อ (อังกฤษ)</th>
                  <th className="text-left py-3 px-4 font-semibold">ชื่อ (จีน)</th>
                  <th className="text-right py-3 px-4 font-semibold">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{category.order}</span>
                        <div className="flex flex-col">
                          <button className="p-1 hover:bg-neutral-100 rounded">
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button className="p-1 hover:bg-neutral-100 rounded">
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium">{category.name}</td>
                    <td className="py-4 px-4 text-neutral-600">{category.nameEn}</td>
                    <td className="py-4 px-4 text-neutral-600">{category.nameZh}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button className="btn-secondary flex items-center gap-2">
              ส่งออกรายการหมวดหมู่
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


