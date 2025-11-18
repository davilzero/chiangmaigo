'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Send, Clock, History } from 'lucide-react'

export default function AdminAnnouncementsPage() {
  const [announcements] = useState([
    {
      id: '1',
      title: 'ประกาศระบบอัปเดต',
      message: 'ระบบจะปิดปรับปรุงในวันที่ 20 มกราคม',
      status: 'sent',
      scheduledAt: '2024-01-15T10:00:00',
      sentAt: '2024-01-15T10:00:00',
      recipients: 'all',
    },
    {
      id: '2',
      title: 'โปรโมชั่นพิเศษ',
      message: 'ส่วนลด 20% สำหรับการจองในเดือนนี้',
      status: 'scheduled',
      scheduledAt: '2024-02-01T09:00:00',
      sentAt: null,
      recipients: 'customers',
    },
  ])

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">ส่งประกาศระบบ (Admin Only!)</h1>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            สร้างประกาศใหม่
          </button>
        </div>
        
        <div className="card">
          <div className="mb-6">
            <button className="text-sm text-primary-600 hover:underline flex items-center gap-2">
              <History className="w-4 h-4" />
              ดูประวัติประกาศที่เคยส่ง
            </button>
          </div>
          
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{announcement.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        announcement.status === 'sent'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {announcement.status === 'sent' ? 'ส่งแล้ว' : 'กำหนดเวลา'}
                      </span>
                    </div>
                    <p className="text-neutral-700 mb-3">{announcement.message}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600">
                      <div>
                        <span className="font-medium">ผู้รับ:</span>{' '}
                        {announcement.recipients === 'all' ? 'ผู้ใช้ทั้งหมด' :
                         announcement.recipients === 'customers' ? 'ลูกค้าเท่านั้น' :
                         announcement.recipients === 'merchants' ? 'ผู้ประกอบการเท่านั้น' :
                         'กำหนดเอง'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {announcement.status === 'sent' 
                            ? `ส่งเมื่อ: ${new Date(announcement.sentAt!).toLocaleString('th-TH')}`
                            : `กำหนดส่ง: ${new Date(announcement.scheduledAt).toLocaleString('th-TH')}`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {announcement.status === 'scheduled' && (
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="ส่งทันที">
                        <Send className="w-4 h-4" />
                      </button>
                    )}
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
  )
}

