'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Bell, BellOff, CheckCheck, Trash2, X } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  Notification,
} from '@/lib/utils/notifications'

export default function UserNotificationsPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    if (user) {
      let all = getNotifications(user.id)
      
      // If no notifications, create some seed data for demo
      if (all.length === 0 && typeof window !== 'undefined') {
        const seedNotifications: Notification[] = [
          {
            id: `seed-1-${user.id}`,
            userId: user.id,
            title: 'ยินดีต้อนรับสู่ ChiangMaiGo',
            message: 'ขอบคุณที่สมัครสมาชิกกับเรา! เริ่มต้นการจองบริการท่องเที่ยวในเชียงใหม่ได้เลย',
            type: 'info',
            read: false,
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
          {
            id: `seed-2-${user.id}`,
            userId: user.id,
            title: 'โปรโมชั่นพิเศษ',
            message: 'ส่วนลด 20% สำหรับการจองในเดือนนี้ ใช้โค้ด: SAVE20',
            type: 'info',
            read: false,
            createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
          },
        ]
        
        // Save seed notifications
        const raw = localStorage.getItem('user-notifications')
        const existing: Notification[] = raw ? JSON.parse(raw) : []
        localStorage.setItem('user-notifications', JSON.stringify([...existing, ...seedNotifications]))
        all = seedNotifications
      }
      
      setNotifications(all)
    } else {
      setNotifications([])
    }
  }, [user])

  const filtered = useMemo(() => {
    let result = notifications

    // Filter by read status
    if (filter === 'unread') {
      result = result.filter(n => !n.read)
    } else if (filter === 'read') {
      result = result.filter(n => n.read)
    }

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q)
      )
    }

    return result
  }, [notifications, filter, query])

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length
  }, [notifications])

  const handleMarkAsRead = (id: string) => {
    if (!user) return
    markAsRead(id, user.id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAllAsRead = () => {
    if (!user) return
    markAllAsRead(user.id)
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleDelete = (id: string) => {
    if (!user) return
    if (!confirm('ลบการแจ้งเตือนนี้?')) return
    deleteNotification(id, user.id)
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleClearAll = () => {
    if (!user) return
    if (!confirm('ลบการแจ้งเตือนทั้งหมด?')) return
    clearAllNotifications(user.id)
    setNotifications([])
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id)
    }
    if (notification.link) {
      router.push(notification.link)
    }
  }

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

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 text-lg mb-4">กรุณาเข้าสู่ระบบเพื่อดูการแจ้งเตือน</p>
          <a href="/login" className="btn-primary">
            เข้าสู่ระบบ
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">การแจ้งเตือน</h1>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <CheckCheck className="w-4 h-4" />
                ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="btn-secondary text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                ลบทั้งหมด
              </button>
            )}
          </div>
        </div>
        
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
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
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
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <select
                  className="input w-auto"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                >
                  <option value="all">ทั้งหมด ({notifications.length})</option>
                  <option value="unread">ยังไม่ได้อ่าน ({unreadCount})</option>
                  <option value="read">อ่านแล้ว ({notifications.length - unreadCount})</option>
                </select>
              </div>
              <div className="text-sm text-neutral-600">
                พบ {filtered.length} รายการ
              </div>
            </div>
            
            {/* Notifications List */}
            {filtered.length === 0 ? (
              <div className="card text-center py-12">
                <Bell className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600 text-lg mb-2">ไม่พบการแจ้งเตือน</p>
                <p className="text-neutral-500 text-sm">
                  {query || filter !== 'all' ? 'ลองเปลี่ยนตัวกรอง' : 'ยังไม่มีการแจ้งเตือน'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((notification) => (
                  <div
                    key={notification.id}
                    className={`card cursor-pointer hover:shadow-md transition-shadow ${
                      !notification.read ? 'border-l-4 border-l-primary-600 bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${getTypeColor(notification.type)}`}>
                        {notification.read ? (
                          <BellOff className="w-5 h-5" />
                        ) : (
                          <Bell className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-semibold ${!notification.read ? 'font-bold' : ''}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                                ใหม่
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(notification.id)
                              }}
                              className="p-1 text-neutral-400 hover:text-red-600 rounded"
                              title="ลบ"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-neutral-700 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-neutral-500">
                            {new Date(notification.createdAt).toLocaleString('th-TH', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMarkAsRead(notification.id)
                              }}
                              className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                            >
                              <CheckCheck className="w-3 h-3" />
                              ทำเครื่องหมายว่าอ่านแล้ว
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
