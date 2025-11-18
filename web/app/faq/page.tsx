'use client'

import { useState } from 'react'
import { Search, HelpCircle } from 'lucide-react'

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['ทั้งหมด', 'การจอง', 'การชำระเงิน', 'การยกเลิก', 'บัญชีผู้ใช้']
  
  const faqs = [
    {
      id: '1',
      category: 'การจอง',
      question: 'ต้องจองล่วงหน้ากี่วัน?',
      answer: 'แนะนำให้จองล่วงหน้าอย่างน้อย 3 วัน เพื่อให้แน่ใจว่ามีที่ว่างและสามารถเตรียมการได้',
    },
    {
      id: '2',
      category: 'การชำระเงิน',
      question: 'สามารถชำระเงินด้วยวิธีใดได้บ้าง?',
      answer: 'คุณสามารถชำระเงินด้วยบัตรเครดิต/เดบิต โอนเงินผ่านธนาคาร หรือพร้อมเพย์',
    },
    {
      id: '3',
      category: 'การยกเลิก',
      question: 'สามารถยกเลิกการจองได้หรือไม่?',
      answer: 'ยกเลิกได้ภายใน 24 ชั่วโมงก่อนวันบริการ โดยจะได้รับเงินคืนเต็มจำนวน',
    },
    {
      id: '4',
      category: 'บัญชีผู้ใช้',
      question: 'ลืมรหัสผ่านทำอย่างไร?',
      answer: 'คุณสามารถกดปุ่ม "ลืมรหัสผ่าน" ที่หน้าเข้าสู่ระบบ และเราจะส่งลิงก์รีเซ็ตรหัสผ่านไปให้ทางอีเมล',
    },
  ]

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">คำถามที่พบบ่อย</h1>
            <p className="text-neutral-600">ค้นหาคำตอบสำหรับคำถามที่คุณสงสัย</p>
          </div>
          
          {/* Search */}
          <div className="card mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="ค้นหาคำถาม..."
                className="input pl-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === 'ทั้งหมด' ? 'all' : category)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  (selectedCategory === 'all' && category === 'ทั้งหมด') ||
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <details key={faq.id} className="card">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    <span>{faq.question}</span>
                    <span className="text-xs text-primary-600">{faq.category}</span>
                  </summary>
                  <p className="mt-4 text-neutral-700 leading-relaxed">{faq.answer}</p>
                </details>
              ))
            ) : (
              <div className="card text-center py-12">
                <p className="text-neutral-600">ไม่พบคำถามที่ตรงกับการค้นหา</p>
              </div>
            )}
          </div>
          
          {/* Contact Support */}
          <div className="card mt-8 bg-primary-50 border-primary-200">
            <h3 className="font-semibold mb-2">ยังไม่พบคำตอบที่ต้องการ?</h3>
            <p className="text-sm text-neutral-700 mb-4">
              ติดต่อฝ่ายสนับสนุนของเรา เราพร้อมช่วยคุณ
            </p>
            <div className="flex gap-4">
              <a href="/support" className="btn-primary text-sm">
                ติดต่อฝ่ายสนับสนุน
              </a>
              <a href="/user/messages" className="btn-secondary text-sm">
                ส่งข้อความ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


