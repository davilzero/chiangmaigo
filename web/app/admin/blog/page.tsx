'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, FileText, Download, History, RotateCcw } from 'lucide-react'

export default function AdminBlogPage() {
  const [articles] = useState([
    {
      id: '1',
      title: '10 สถานที่ท่องเที่ยวเชียงใหม่ที่ต้องไป',
      category: 'ท่องเที่ยว',
      author: 'Admin',
      status: 'published',
      publishedAt: '2024-01-15',
      views: 1250,
    },
    {
      id: '2',
      title: 'เคล็ดลับการเดินทางในเชียงใหม่',
      category: 'เคล็ดลับ',
      author: 'Admin',
      status: 'draft',
      publishedAt: null,
      views: 0,
    },
  ])

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">จัดการบล็อก/บทความ (Admin Only!)</h1>
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              ส่งออก
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              สร้างบทความใหม่
            </button>
          </div>
        </div>
        
        <div className="card">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="ค้นหาบทความ..."
                className="input"
              />
            </div>
            <select className="input w-auto">
              <option>ทุกประเภท</option>
              <option>ท่องเที่ยว</option>
              <option>เคล็ดลับ</option>
              <option>ข่าวสาร</option>
            </select>
            <select className="input w-auto">
              <option>ทุกสถานะ</option>
              <option>เผยแพร่แล้ว</option>
              <option>แบบร่าง</option>
            </select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-semibold">หัวข้อ</th>
                  <th className="text-left py-3 px-4 font-semibold">หมวดหมู่</th>
                  <th className="text-left py-3 px-4 font-semibold">ผู้เขียน</th>
                  <th className="text-left py-3 px-4 font-semibold">สถานะ</th>
                  <th className="text-left py-3 px-4 font-semibold">วันที่เผยแพร่</th>
                  <th className="text-left py-3 px-4 font-semibold">ยอดดู</th>
                  <th className="text-right py-3 px-4 font-semibold">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-4">
                      <div className="font-medium">{article.title}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {article.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">{article.author}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {article.status === 'published' ? 'เผยแพร่แล้ว' : 'แบบร่าง'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-600">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('th-TH') : '-'}
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-600">{article.views.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" title="ดูตัวอย่าง">
                          <Eye className="w-4 h-4" />
                        </button>
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

