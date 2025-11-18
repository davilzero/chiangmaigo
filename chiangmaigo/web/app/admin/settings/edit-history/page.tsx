'use client'

import { useState, useEffect, useMemo } from 'react'
import { History, Search, Filter, User, Calendar, FileText, Trash2 } from 'lucide-react'
import { getEditHistory, clearEditHistory, EditHistoryEntry } from '@/lib/utils/editHistory'

export default function EditHistoryPage() {
  const [history, setHistory] = useState<EditHistoryEntry[]>([])
  const [query, setQuery] = useState('')
  const [entityFilter, setEntityFilter] = useState<string>('all')
  const [userFilter, setUserFilter] = useState<string>('all')
  const [actionFilter, setActionFilter] = useState<string>('all')

  useEffect(() => {
    setHistory(getEditHistory())
  }, [])

  const filtered = useMemo(() => {
    return history.filter((entry) => {
      const matchQuery = 
        !query ||
        entry.userName.toLowerCase().includes(query.toLowerCase()) ||
        entry.entityType.toLowerCase().includes(query.toLowerCase()) ||
        entry.entityId.toLowerCase().includes(query.toLowerCase()) ||
        entry.action.toLowerCase().includes(query.toLowerCase())
      
      const matchEntity = entityFilter === 'all' || entry.entityType === entityFilter
      const matchUser = userFilter === 'all' || entry.userId === userFilter
      const matchAction = actionFilter === 'all' || entry.action === actionFilter
      
      return matchQuery && matchEntity && matchUser && matchAction
    })
  }, [history, query, entityFilter, userFilter, actionFilter])

  const uniqueEntities = useMemo(() => {
    const entities = new Set(history.map(h => h.entityType))
    return Array.from(entities).sort()
  }, [history])

  const uniqueUsers = useMemo(() => {
    const users = new Map<string, { id: string; name: string; role: string }>()
    history.forEach(h => {
      if (!users.has(h.userId)) {
        users.set(h.userId, { id: h.userId, name: h.userName, role: h.userRole })
      }
    })
    return Array.from(users.values())
  }, [history])

  const getActionText = (action: string) => {
    const actions: Record<string, string> = {
      create: 'สร้าง',
      update: 'แก้ไข',
      delete: 'ลบ',
      approve: 'อนุมัติ',
      reject: 'ปฏิเสธ',
      suspend: 'ระงับ',
      activate: 'เปิดใช้งาน',
      deactivate: 'ปิดใช้งาน',
    }
    return actions[action] || action
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-700'
      case 'update':
        return 'bg-blue-100 text-blue-700'
      case 'delete':
        return 'bg-red-100 text-red-700'
      case 'approve':
        return 'bg-green-100 text-green-700'
      case 'reject':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-neutral-100 text-neutral-700'
    }
  }

  const handleClear = () => {
    if (confirm('คุณต้องการลบประวัติการแก้ไขทั้งหมดใช่หรือไม่?')) {
      clearEditHistory()
      setHistory([])
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">ประวัติการแก้ไข</h1>
            <p className="text-neutral-600">
              ดูประวัติการแก้ไขทั้งหมดในระบบ พร้อมข้อมูลผู้แก้ไขและเวลา
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="btn-secondary text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              ล้างประวัติทั้งหมด
            </button>
          )}
        </div>

        {/* Summary */}
        <div className="card mb-6 bg-primary-50 border-primary-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-primary-800 mb-1">ประวัติทั้งหมด</p>
              <p className="text-2xl font-bold text-primary-700">{history.length}</p>
            </div>
            <div>
              <p className="text-sm text-primary-800 mb-1">ผู้แก้ไข</p>
              <p className="text-2xl font-bold text-primary-700">{uniqueUsers.length}</p>
            </div>
            <div>
              <p className="text-sm text-primary-800 mb-1">ประเภทข้อมูล</p>
              <p className="text-2xl font-bold text-primary-700">{uniqueEntities.length}</p>
            </div>
            <div>
              <p className="text-sm text-primary-800 mb-1">ผลลัพธ์ที่กรอง</p>
              <p className="text-2xl font-bold text-primary-700">{filtered.length}</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="ค้นหา (ชื่อผู้ใช้, ประเภท, การกระทำ)..."
                className="input pl-12"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">ประเภทข้อมูล</label>
              <select
                className="input w-full"
                value={entityFilter}
                onChange={(e) => setEntityFilter(e.target.value)}
              >
                <option value="all">ทั้งหมด</option>
                {uniqueEntities.map((entity) => (
                  <option key={entity} value={entity}>{entity}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">ผู้แก้ไข</label>
              <select
                className="input w-full"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              >
                <option value="all">ทั้งหมด</option>
                {uniqueUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">การกระทำ</label>
              <select
                className="input w-full"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="all">ทั้งหมด</option>
                <option value="create">สร้าง</option>
                <option value="update">แก้ไข</option>
                <option value="delete">ลบ</option>
                <option value="approve">อนุมัติ</option>
                <option value="reject">ปฏิเสธ</option>
                <option value="suspend">ระงับ</option>
                <option value="activate">เปิดใช้งาน</option>
                <option value="deactivate">ปิดใช้งาน</option>
              </select>
            </div>
          </div>
        </div>

        {/* History List */}
        {filtered.length === 0 ? (
          <div className="card text-center py-12">
            <History className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600 text-lg mb-2">ไม่พบประวัติการแก้ไข</p>
            <p className="text-neutral-500 text-sm">
              {query || entityFilter !== 'all' || userFilter !== 'all' || actionFilter !== 'all'
                ? 'ลองเปลี่ยนตัวกรอง'
                : 'ยังไม่มีประวัติการแก้ไข'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((entry) => (
              <div key={entry.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`px-3 py-1 rounded text-sm font-semibold ${getActionColor(entry.action)}`}>
                        {getActionText(entry.action)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">{entry.entityType}</span>
                        <span className="text-neutral-400">•</span>
                        <span className="font-mono text-xs">{entry.entityId}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{entry.userName}</span>
                        <span className="text-xs px-2 py-0.5 bg-neutral-100 rounded">
                          {entry.userRole}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(entry.timestamp).toLocaleString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>

                    {entry.changes && entry.changes.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-neutral-200">
                        <p className="text-sm font-medium text-neutral-700 mb-2">การเปลี่ยนแปลง:</p>
                        <div className="space-y-1">
                          {entry.changes.map((change, idx) => (
                            <div key={idx} className="text-sm text-neutral-600">
                              <span className="font-medium">{change.field}:</span>{' '}
                              <span className="line-through text-red-600">{String(change.oldValue)}</span>
                              {' → '}
                              <span className="text-green-600 font-medium">{String(change.newValue)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


