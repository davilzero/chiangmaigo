'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, Filter, Edit, Trash2, UserX, UserCheck, History, X, Save, Mail, Shield } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store/authStore'
import { logEditHistory, getEditHistoryByEntity } from '@/lib/utils/editHistory'

export default function AdminUsersPage() {
  const { user: currentUser } = useAuthStore()
  const [users, setUsers] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ทุกบทบาท')
  const [statusFilter, setStatusFilter] = useState('ทุกสถานะ')
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [editDraft, setEditDraft] = useState<any | null>(null)
  const [confirmState, setConfirmState] = useState<{ open: boolean; message: string; onYes?: () => void }>(
    { open: false, message: '' }
  )

  useEffect(() => {
    const seed = [
      {
        id: '1',
        name: 'ผู้ใช้ 1',
        email: 'user1@example.com',
        role: 'customer',
        status: 'active',
        createdAt: '2024-01-01',
      },
      {
        id: '2',
        name: 'ผู้ประกอบการ 1',
        email: 'merchant1@example.com',
        role: 'merchant',
        status: 'active',
        createdAt: '2024-01-02',
      },
      {
        id: '3',
        name: 'ผู้ใช้ 2',
        email: 'user2@example.com',
        role: 'customer',
        status: 'suspended',
        createdAt: '2024-01-03',
      },
    ]
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin-users')
      setUsers(saved ? JSON.parse(saved) : seed)
    } else {
      setUsers(seed)
    }
  }, [])

  const persist = (list: any[]) => {
    setUsers(list)
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin-users', JSON.stringify(list))
    }
  }

  const updateUser = (id: string, changes: Partial<any>) => {
    const oldUser = users.find(u => u.id === id)
    persist(users.map((u) => (u.id === id ? { ...u, ...changes } : u)))
    
    // Log edit history
    if (currentUser && oldUser) {
      const changeEntries = Object.keys(changes).map(key => ({
        field: key,
        oldValue: oldUser[key],
        newValue: changes[key],
      }))
      
      logEditHistory({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'update',
        entityType: 'user',
        entityId: id,
        changes: changeEntries,
      })
    }
  }

  const deleteUser = (id: string) => {
    if (!confirm('ยืนยันการลบผู้ใช้นี้?')) return
    
    // Log edit history
    if (currentUser) {
      logEditHistory({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'delete',
        entityType: 'user',
        entityId: id,
      })
    }
    
    persist(users.filter((u) => u.id !== id))
  }

  const handleSuspend = (id: string) => {
    const targetUser = users.find(u => u.id === id)
    const newStatus = targetUser?.status === 'active' ? 'suspended' : 'active'
    updateUser(id, { status: newStatus })
    
    // Log edit history
    if (currentUser) {
      logEditHistory({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: newStatus === 'suspended' ? 'suspend' : 'activate',
        entityType: 'user',
        entityId: id,
      })
    }
  }

  const showUserHistory = (userId: string) => {
    const history = getEditHistoryByEntity('user', userId)
    if (history.length === 0) {
      alert('ยังไม่มีประวัติการแก้ไขสำหรับผู้ใช้นี้')
    } else {
      const historyText = history.map(h => 
        `${new Date(h.timestamp).toLocaleString('th-TH')} - ${h.userName} (${h.userRole}): ${h.action}`
      ).join('\n')
      alert(`ประวัติการแก้ไข:\n\n${historyText}`)
    }
  }

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = query.trim().toLowerCase()
      const matchQ =
        q.length === 0 ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      const matchRole =
        roleFilter === 'ทุกบทบาท'
          ? true
          : roleFilter === 'ลูกค้า'
          ? u.role === 'customer'
          : roleFilter === 'ผู้ประกอบการ'
          ? u.role === 'merchant'
          : u.role === 'admin'
      const matchStatus =
        statusFilter === 'ทุกสถานะ'
          ? true
          : statusFilter === 'ใช้งาน'
          ? u.status === 'active'
          : u.status === 'suspended'
      return matchQ && matchRole && matchStatus
    })
  }, [users, query, roleFilter, statusFilter])

  const openPanel = (user: any) => {
    setSelectedUser(user)
    setEditDraft({ ...user })
    setPanelOpen(true)
  }
  const closePanel = () => {
    setPanelOpen(false)
    setSelectedUser(null)
    setEditDraft(null)
  }
  const saveDraft = () => {
    if (!editDraft) return
    persist(users.map((u) => (u.id === editDraft.id ? { ...u, ...editDraft } : u)))
    setSelectedUser(editDraft)
  }
  const askConfirm = (message: string, onYes: () => void) => {
    setConfirmState({ open: true, message, onYes })
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">จัดการผู้ใช้ (Admin Only!)</h1>
          <Link href="/admin/users/new" className="btn-primary">
            เพิ่มผู้ใช้ใหม่
          </Link>
        </div>
        
        <div className="card">
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="ค้นหาผู้ใช้..."
                className="input pl-12"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select
              className="input w-auto"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option>ทุกบทบาท</option>
              <option>ลูกค้า</option>
              <option>ผู้ประกอบการ</option>
              <option>Admin</option>
            </select>
            <select
              className="input w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>ทุกสถานะ</option>
              <option>ใช้งาน</option>
              <option>ระงับ</option>
            </select>
          </div>
          
          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold">ชื่อ</th>
                  <th className="text-left py-3 px-4 font-semibold">อีเมล</th>
                  <th className="text-left py-3 px-4 font-semibold">บทบาท</th>
                  <th className="text-left py-3 px-4 font-semibold">สถานะ</th>
                  <th className="text-left py-3 px-4 font-semibold">วันที่สมัคร</th>
                  <th className="text-right py-3 px-4 font-semibold">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-4">
                      <div className="font-medium">
                        <button
                          className="hover:underline text-left"
                          onClick={() => openPanel(user)}
                        >
                          {user.name}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === 'merchant'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : user.role === 'merchant' ? 'ผู้ประกอบการ' : 'ลูกค้า'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status === 'active' ? 'ใช้งาน' : 'ระงับ'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-600">
                      {new Date(user.createdAt).toLocaleDateString('th-TH')}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                          title="ประวัติการแก้ไข"
                          onClick={() => showUserHistory(user.id)}
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                          title="แก้ไข"
                          onClick={() => openPanel(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="ระงับ"
                            onClick={() =>
                              askConfirm('ยืนยันการระงับผู้ใช้นี้?', () => handleSuspend(user.id))
                            }
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="เปิดใช้งาน"
                            onClick={() =>
                              askConfirm('ยืนยันการเปิดใช้งานผู้ใช้นี้?', () => handleSuspend(user.id))
                            }
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="ลบ"
                          onClick={() => askConfirm('ยืนยันการลบผู้ใช้นี้?', () => deleteUser(user.id))}
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
      
      {/* Drawer Panel */}
      {panelOpen && editDraft && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={closePanel}
            aria-hidden="true"
          />
          <aside className="fixed right-0 top-0 h-full w-full md:w-[420px] bg-white z-50 shadow-xl border-l border-neutral-200 flex flex-col">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold">จัดการผู้ใช้</h2>
              <button className="p-2 hover:bg-neutral-100 rounded-lg" onClick={closePanel}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-auto">
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อ</label>
                <input
                  className="input"
                  value={editDraft.name}
                  onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">อีเมล</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-neutral-500" />
                  <input
                    className="input flex-1"
                    value={editDraft.email}
                    onChange={(e) => setEditDraft({ ...editDraft, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">บทบาท</label>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-neutral-500" />
                    <select
                      className="input flex-1"
                      value={editDraft.role}
                      onChange={(e) => setEditDraft({ ...editDraft, role: e.target.value })}
                    >
                      <option value="customer">ลูกค้า</option>
                      <option value="merchant">ผู้ประกอบการ</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">สถานะ</label>
                  <select
                    className="input"
                    value={editDraft.status}
                    onChange={(e) => setEditDraft({ ...editDraft, status: e.target.value })}
                  >
                    <option value="active">ใช้งาน</option>
                    <option value="suspended">ระงับ</option>
                  </select>
                </div>
              </div>

              <div className="border rounded-lg p-3 bg-neutral-50">
                <p className="text-sm text-neutral-600">
                  ลงทะเบียนเมื่อ: {new Date(editDraft.createdAt).toLocaleDateString('th-TH')}
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-neutral-200 flex items-center justify-between">
              <div className="flex gap-2">
                {editDraft.status === 'active' ? (
                  <button
                    className="px-3 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"
                    onClick={() =>
                      askConfirm('ยืนยันการระงับผู้ใช้นี้?', () => {
                        setEditDraft({ ...editDraft, status: 'suspended' })
                        updateUser(editDraft.id, { status: 'suspended' })
                      })
                    }
                  >
                    ระงับ
                  </button>
                ) : (
                  <button
                    className="px-3 py-2 rounded-lg border border-green-300 text-green-700 hover:bg-green-50"
                    onClick={() =>
                      askConfirm('ยืนยันการเปิดใช้งานผู้ใช้นี้?', () => {
                        setEditDraft({ ...editDraft, status: 'active' })
                        updateUser(editDraft.id, { status: 'active' })
                      })
                    }
                  >
                    เปิดใช้งาน
                  </button>
                )}
                <button
                  className="px-3 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => askConfirm('ยืนยันการลบผู้ใช้นี้?', () => { deleteUser(editDraft.id); closePanel() })}
                >
                  ลบผู้ใช้
                </button>
              </div>
              <button
                className="btn-primary flex items-center gap-2"
                onClick={saveDraft}
              >
                <Save className="w-4 h-4" />
                บันทึก
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Confirm Modal */}
      {confirmState.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setConfirmState({ open: false, message: '' })} />
          <div className="relative bg-white w-[92%] max-w-sm rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-2">ยืนยันการดำเนินการ</h3>
            <p className="text-neutral-700 mb-6">{confirmState.message}</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-50"
                onClick={() => setConfirmState({ open: false, message: '' })}
              >
                ยกเลิก
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
                onClick={() => {
                  const fn = confirmState.onYes
                  setConfirmState({ open: false, message: '' })
                  fn && fn()
                }}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

