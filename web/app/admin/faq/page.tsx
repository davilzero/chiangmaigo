'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Search, Languages, Upload, Download, Eye } from 'lucide-react'

export default function AdminFAQPage() {
  const [faqs] = useState([
    {
      id: '1',
      question: 'ต้องจองล่วงหน้ากี่วัน?',
      questionEn: 'How many days in advance should I book?',
      questionZh: '应该提前多少天预订？',
      answer: 'แนะนำให้จองล่วงหน้าอย่างน้อย 3 วัน',
      answerEn: 'We recommend booking at least 3 days in advance',
      answerZh: '我们建议至少提前3天预订',
      category: 'การจอง',
      language: 'th',
    },
    {
      id: '2',
      question: 'สามารถยกเลิกการจองได้หรือไม่?',
      questionEn: 'Can I cancel my booking?',
      questionZh: '可以取消预订吗？',
      answer: 'ยกเลิกได้ภายใน 24 ชั่วโมงก่อนวันบริการ',
      answerEn: 'You can cancel within 24 hours before the service date',
      answerZh: '您可以在服务日期前24小时内取消',
      category: 'การยกเลิก',
      language: 'th',
    },
  ])

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">จัดการ FAQ (Admin Only!)</h1>
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2">
              <Upload className="w-4 h-4" />
              นำเข้า
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              ส่งออก
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              เพิ่ม FAQ ใหม่
            </button>
          </div>
        </div>
        
        <div className="card">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="ค้นหา FAQ..."
                className="input pl-12"
              />
            </div>
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-primary-600" />
              <select className="input w-auto">
                <option>ทุกภาษา</option>
                <option>ไทย</option>
                <option>English</option>
                <option>中文</option>
              </select>
            </div>
            <select className="input w-auto">
              <option>ทุกหมวดหมู่</option>
              <option>การจอง</option>
              <option>การยกเลิก</option>
              <option>การชำระเงิน</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{faq.question}</h3>
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                        {faq.category}
                      </span>
                      <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded">
                        {faq.language === 'th' ? 'ไทย' : faq.language === 'en' ? 'English' : '中文'}
                      </span>
                    </div>
                    <p className="text-neutral-700 mb-2">{faq.answer}</p>
                    <div className="text-sm text-neutral-600 space-y-1">
                      <p><strong>EN:</strong> {faq.questionEn} - {faq.answerEn}</p>
                      <p><strong>ZH:</strong> {faq.questionZh} - {faq.answerZh}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" title="ดูตัวอย่าง">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" title="แก้ไข">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="ลบ">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-neutral-500">
                  SEO Settings: Meta Title, Meta Description, Keywords
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


