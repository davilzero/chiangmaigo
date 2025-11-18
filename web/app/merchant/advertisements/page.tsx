'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Edit, Trash2, History, RotateCcw } from 'lucide-react'

export default function MerchantAdvertisementsPage() {
  const [campaigns] = useState([
    {
      id: '1',
      title: 'แคมเปญโฆษณาเดือนมกราคม',
      type: 'banner',
      budget: 5000,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      targetAudience: 'ทุกคน',
      position: 'หน้าแรก - ด้านบน',
    },
    {
      id: '2',
      title: 'แคมเปญโปรโมชั่น',
      type: 'sponsored',
      budget: 10000,
      status: 'pending',
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      targetAudience: 'ผู้ใช้ที่สนใจทัวร์',
      position: 'หน้าบริการ - ด้านข้าง',
    },
  ])

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">จัดการแคมเปญโฆษณา</h1>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            สร้างแคมเปญใหม่
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <a href="/merchant/dashboard" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ภาพรวม
              </a>
              <a href="/merchant/services" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                จัดการบริการ
              </a>
              <a href="/merchant/promotions" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                โปรโมชั่น
              </a>
              <a href="/merchant/advertisements" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                โฆษณา
              </a>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filter */}
            <div className="card">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาแคมเปญ..."
                    className="input pl-12"
                  />
                </div>
                <select className="input w-auto">
                  <option>ทุกสถานะ</option>
                  <option>ใช้งาน</option>
                  <option>รออนุมัติ</option>
                  <option>ไม่ใช้งาน</option>
                </select>
                <select className="input w-auto">
                  <option>เรียงตาม: ล่าสุด</option>
                  <option>เรียงตาม: งบประมาณ</option>
                  <option>เรียงตาม: ชื่อ</option>
                </select>
              </div>
            </div>
            
            {/* Campaigns List */}
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{campaign.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          campaign.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : campaign.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {campaign.status === 'active' ? 'ใช้งาน' : campaign.status === 'pending' ? 'รออนุมัติ' : 'ไม่ใช้งาน'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600 mb-3">
                        <div>
                          <span className="font-medium">ประเภท:</span> {campaign.type}
                        </div>
                        <div>
                          <span className="font-medium">งบประมาณ:</span> ฿{campaign.budget.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">กลุ่มเป้าหมาย:</span> {campaign.targetAudience}
                        </div>
                        <div>
                          <span className="font-medium">ตำแหน่ง:</span> {campaign.position}
                        </div>
                        <div>
                          <span className="font-medium">วันที่เริ่ม:</span> {new Date(campaign.startDate).toLocaleDateString('th-TH')}
                        </div>
                        <div>
                          <span className="font-medium">วันที่สิ้นสุด:</span> {new Date(campaign.endDate).toLocaleDateString('th-TH')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" title="ประวัติการแก้ไข">
                        <History className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" title="กู้คืนเวอร์ชัน">
                        <RotateCcw className="w-4 h-4" />
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

