'use client'

import { useState } from 'react'
import { MapPin, Clock, Star, Award, Phone, Mail, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function MerchantPublicProfilePage({ params }: { params: { id: string } }) {
  const [merchant] = useState({
    businessName: 'ร้านท่องเที่ยวเชียงใหม่',
    businessNameEn: 'Chiang Mai Travel',
    businessNameZh: '清迈旅游',
    description: 'บริการท่องเที่ยวเชียงใหม่คุณภาพ พร้อมทีมงานมืออาชีพ',
    descriptionEn: 'Quality Chiang Mai travel services with professional team',
    descriptionZh: '清迈优质旅游服务，专业团队',
    address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพมหานคร 10110',
    phone: '0812345678',
    email: 'merchant@example.com',
    emergency: '0812345679',
    rating: 4.5,
    reviewCount: 128,
    images: [1, 2, 3, 4],
    operatingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: false },
    },
    certifications: ['ใบรับรองการท่องเที่ยว', 'รางวัลบริการดีเด่น'],
    awards: ['รางวัลธุรกิจท่องเที่ยวยอดเยี่ยม 2023'],
  })

  const [selectedLanguage, setSelectedLanguage] = useState<'th' | 'en' | 'zh'>('th')

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {/* Language Selector */}
        <div className="flex justify-end mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedLanguage('th')}
              className={`px-3 py-1 rounded text-sm ${
                selectedLanguage === 'th' ? 'bg-primary-600 text-white' : 'bg-white border border-neutral-300'
              }`}
            >
              ไทย
            </button>
            <button
              onClick={() => setSelectedLanguage('en')}
              className={`px-3 py-1 rounded text-sm ${
                selectedLanguage === 'en' ? 'bg-primary-600 text-white' : 'bg-white border border-neutral-300'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setSelectedLanguage('zh')}
              className={`px-3 py-1 rounded text-sm ${
                selectedLanguage === 'zh' ? 'bg-primary-600 text-white' : 'bg-white border border-neutral-300'
              }`}
            >
              中文
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48 h-48 bg-neutral-200 rounded-lg"></div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {selectedLanguage === 'th' ? merchant.businessName :
                 selectedLanguage === 'en' ? merchant.businessNameEn :
                 merchant.businessNameZh}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{merchant.rating}</span>
                  <span className="text-neutral-600">({merchant.reviewCount} รีวิว)</span>
                </div>
              </div>
              <p className="text-neutral-700 mb-4">
                {selectedLanguage === 'th' ? merchant.description :
                 selectedLanguage === 'en' ? merchant.descriptionEn :
                 merchant.descriptionZh}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{merchant.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{merchant.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{merchant.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">แกลเลอรีรูปภาพ</h2>
              <div className="grid grid-cols-2 gap-4">
                {merchant.images.map((img, i) => (
                  <div key={i} className="aspect-video bg-neutral-200 rounded-lg"></div>
                ))}
              </div>
            </div>

            {/* Operating Hours */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                เวลาทำการ
              </h2>
              <div className="space-y-2">
                {Object.entries(merchant.operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                    <span className="font-medium capitalize">
                      {day === 'monday' ? 'จันทร์' :
                       day === 'tuesday' ? 'อังคาร' :
                       day === 'wednesday' ? 'พุธ' :
                       day === 'thursday' ? 'พฤหัสบดี' :
                       day === 'friday' ? 'ศุกร์' :
                       day === 'saturday' ? 'เสาร์' : 'อาทิตย์'}
                    </span>
                    <span className="text-neutral-600">
                      {hours.closed ? 'ปิด' : `${hours.open} - ${hours.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Awards */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                ใบรับรองและรางวัล
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">ใบรับรอง</h3>
                  <ul className="space-y-1">
                    {merchant.certifications.map((cert, i) => (
                      <li key={i} className="flex items-center gap-2 text-neutral-700">
                        <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">รางวัล</h3>
                  <ul className="space-y-1">
                    {merchant.awards.map((award, i) => (
                      <li key={i} className="flex items-center gap-2 text-neutral-700">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        {award}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                ข้อมูลติดต่อฉุกเฉิน
              </h2>
              <p className="text-neutral-700">
                เบอร์โทรศัพท์ฉุกเฉิน: <strong>{merchant.emergency}</strong>
              </p>
            </div>

            {/* Reviews */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">รีวิวจากลูกค้า</h2>
                <div className="flex gap-2">
                  <select className="input w-auto text-sm">
                    <option>ทุกคะแนน</option>
                    <option>5 ดาว</option>
                    <option>4 ดาว</option>
                    <option>3 ดาว</option>
                    <option>2 ดาว</option>
                    <option>1 ดาว</option>
                  </select>
                  <input
                    type="date"
                    className="input w-auto text-sm"
                    placeholder="จากวันที่"
                  />
                  <input
                    type="date"
                    className="input w-auto text-sm"
                    placeholder="ถึงวันที่"
                  />
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="border-b border-neutral-200 pb-4 last:border-0">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-10 h-10 bg-primary-200 rounded-full"></div>
                      <div>
                        <p className="font-semibold">ผู้ใช้ {i}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex text-yellow-400 text-sm">
                            {'★'.repeat(5)}
                          </div>
                          <span className="text-sm text-neutral-600">2 สัปดาห์ที่แล้ว</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-neutral-700">รีวิวที่ดีมาก บริการเป็นมืออาชีพ...</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h3 className="font-semibold mb-4">บริการของเรา</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Link
                    key={i}
                    href={`/services/${i}`}
                    className="block p-3 border border-neutral-200 rounded-lg hover:border-primary-500 transition-colors"
                  >
                    <div className="aspect-video bg-neutral-200 rounded-lg mb-2"></div>
                    <h4 className="font-semibold text-sm mb-1">บริการ {i}</h4>
                    <p className="text-xs text-neutral-600 mb-2">คำอธิบายบริการ...</p>
                    <p className="text-primary-600 font-bold text-sm">฿1,500</p>
                  </Link>
                ))}
              </div>
              <Link
                href={`/services?merchant=${params.id}`}
                className="block text-center text-primary-600 hover:underline mt-4 text-sm"
              >
                ดูบริการทั้งหมด →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


