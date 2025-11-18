'use client'

import { useState } from 'react'
import { Search, Filter, Bell, BellOff } from 'lucide-react'

export default function UserNotificationsPage() {
  const [notifications] = useState([
    {
      id: '1',
      title: 'การจองได้รับการยืนยัน',
      message: 'การจองของคุณ #1001 ได้รับการยืนยันแล้ว',
      type: 'success',
      read: false,
      createdAt: '2024-01-15T10:30:00',
    },
    {
      id: '2',
      title: 'โปรโมชั่นพิเศษ',
      message: 'ส่วนลด 20% สำหรับการจองในเดือนนี้',
      type: 'info',
      read: false,
      createdAt: '2024-01-14T15:20:00',
    },
    {
      id: '3',
      title: 'รีวิวใหม่',
      message: 'มีรีวิวใหม่สำหรับบริการที่คุณจอง',
      type: 'info',
      read: true,
      createdAt: '2024-01-13T09:15:00',
    },
  ])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-700'
      case 'error':
        return 'bg-red-100 text-red-700'
      case 'warning':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-blue-100 text-blue-700'
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">การแจ้งเตือน</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <a href="/user/dashboard" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ภาพรวม
              </a>
              <a href="/user/bookings" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                การจองของฉัน
              </a>
              <a href="/user/notifications" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                การแจ้งเตือน
              </a>
              <a href="/user/messages" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ข้อความ
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
                    placeholder="ค้นหาการแจ้งเตือน..."
                    className="input pl-12"
                  />
                </div>
                <select className="input w-auto">
                  <option>ทั้งหมด</option>
                  <option>ยังไม่ได้อ่าน</option>
                  <option>อ่านแล้ว</option>
                </select>
              </div>
            </div>
            
            {/* Notifications List */}
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`card ${!notification.read ? 'border-l-4 border-l-primary-600' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      {notification.read ? (
                        <BellOff className="w-5 h-5" />
                      ) : (
                        <Bell className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        {!notification.read && (
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                            ใหม่
                          </span>
                        )}
                      </div>
                      <p className="text-neutral-700 mb-2">{notification.message}</p>
                      <p className="text-xs text-neutral-500">
                        {new Date(notification.createdAt).toLocaleString('th-TH')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {notifications.length === 0 && (
              <div className="card text-center py-12">
                <Bell className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600">ยังไม่มีการแจ้งเตือน</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


