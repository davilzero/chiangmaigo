'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Edit, Trash2, Eye, Send, X, Save, MessageSquare } from 'lucide-react'

type SmsTemplate = {
  id: string
  name: string
  body: string
  updatedAt: string
}

export default function AdminSmsTemplatesPage() {
  const [templates, setTemplates] = useState<SmsTemplate[]>([])
  const [query, setQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [draft, setDraft] = useState<SmsTemplate | null>(null)
  const STORAGE_KEY = 'admin-sms-templates'

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setTemplates(JSON.parse(saved))
      } else {
        const seed: SmsTemplate[] = [
          {
            id: 'otp',
            name: 'OTP',
            body: 'รหัส OTP ของคุณคือ {{otp}} (หมดอายุใน 5 นาที)',
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'booking-reminder',
            name: 'เตือนนัดหมาย/การจอง',
            body: 'เตือนการจอง {{serviceName}} วันที่ {{date}} เวลา {{time}} กรุณาไปถึงก่อน 10 นาที',
            updatedAt: new Date().toISOString(),
          },
        ]
        setTemplates(seed)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
      }
    }
  }, [])

  const persist = (list: SmsTemplate[]) => {
    setTemplates(list)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return templates.filter(
      (t) => q.length === 0 || t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
    )
  }, [templates, query])

  const openCreate = () => {
    setDraft({
      id: '',
      name: '',
      body: '',
      updatedAt: new Date().toISOString(),
    })
    setDrawerOpen(true)
  }

  const openEdit = (t: SmsTemplate) => {
    setDraft({ ...t })
    setDrawerOpen(true)
  }

  const saveDraft = () => {
    if (!draft) return
    if (!draft.id || !draft.name) {
      alert('กรุณากรอก Template ID และชื่อ')
      return
    }
    const exists = templates.find((t) => t.id === draft.id)
    const updated = { ...draft, updatedAt: new Date().toISOString() }
    if (exists) {
      persist(templates.map((t) => (t.id === draft.id ? updated : t)))
    } else {
      persist([updated, ...templates])
    }
    setDrawerOpen(false)
    setDraft(null)
  }

  const remove = (id: string) => {
    if (!confirm('ยืนยันการลบแม่แบบนี้?')) return
    persist(templates.filter((t) => t.id !== id))
  }

  const preview = (t: SmsTemplate) => {
    const sample = t.body
      .replaceAll('{{otp}}', '123456')
      .replaceAll('{{serviceName}}', 'ทัวร์ดอยสุเทพ')
      .replaceAll('{{date}}', '2025-12-01')
      .replaceAll('{{time}}', '09:00')
    alert(`ตัวอย่าง SMS:\n\n${sample}`)
  }

  const sendTest = (t: SmsTemplate) => {
    const phone = prompt('กรอกเบอร์โทรศัพท์สำหรับทดสอบ', '0812345678')
    if (!phone) return
    alert(`ส่งทดสอบแม่แบบ "${t.name}" ไปยัง ${phone} (เดโม)`)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">แม่แบบ SMS</h1>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            เพิ่มแม่แบบ
          </button>
        </div>

        <div className="card mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                className="input"
                placeholder="ค้นหาแม่แบบ (ชื่อหรือ ID)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold">Template ID</th>
                  <th className="text-left py-3 px-4 font-semibold">ชื่อ</th>
                  <th className="text-left py-3 px-4 font-semibold">อัปเดตล่าสุด</th>
                  <th className="text-right py-3 px-4 font-semibold">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-3 px-4 font-mono text-sm">{t.id}</td>
                    <td className="py-3 px-4">{t.name}</td>
                    <td className="py-3 px-4 text-sm text-neutral-600">
                      {new Date(t.updatedAt).toLocaleString('th-TH')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg" onClick={() => preview(t)} title="ดูตัวอย่าง">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" onClick={() => openEdit(t)} title="แก้ไข">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" onClick={() => sendTest(t)} title="ส่งทดสอบ">
                          <Send className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => remove(t.id)} title="ลบ">
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

      {/* Drawer */}
      {drawerOpen && draft && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setDrawerOpen(false)} />
          <aside className="fixed right-0 top-0 h-full w-full md:w-[520px] bg-white z-50 shadow-xl border-l border-neutral-200 flex flex-col">
            <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold">แก้ไขแม่แบบ SMS</h2>
              <button className="p-2 hover:bg-neutral-100 rounded-lg" onClick={() => setDrawerOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-auto">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Template ID</label>
                  <input
                    className="input font-mono"
                    placeholder="เช่น otp"
                    value={draft.id}
                    onChange={(e) => setDraft({ ...draft, id: e.target.value.trim() })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ชื่อ</label>
                  <input
                    className="input"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">เนื้อหา (รองรับตัวแปร)</label>
                  <textarea
                    className="input"
                    rows={8}
                    value={draft.body}
                    onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                    placeholder="ใช้ {{otp}}, {{serviceName}}, {{date}}, {{time}}"
                  />
                </div>
                <div className="text-xs text-neutral-600">
                  ตัวแปรที่รองรับ: {'{{otp}}'}, {'{{serviceName}}'}, {'{{date}}'}, {'{{time}}'}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-neutral-200 flex items-center justify-between">
              <button className="px-3 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-50" onClick={() => draft && preview(draft)}>
                ตัวอย่าง
              </button>
              <button className="btn-primary flex items-center gap-2" onClick={saveDraft}>
                <Save className="w-4 h-4" />
                บันทึก
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}



