'use client'

import { useEffect, useState } from 'react'
import { Save, MapPin, Clock, Award, Phone, Mail, AlertCircle, Languages } from 'lucide-react'

export default function MerchantProfilePage() {
  const [profile, setProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('merchant-profile')
      if (saved) return JSON.parse(saved)
    }
    return {
      businessName: 'ร้านท่องเที่ยวเชียงใหม่',
      businessNameEn: 'Chiang Mai Travel',
      businessNameZh: '清迈旅游',
      description: 'บริการท่องเที่ยวเชียงใหม่คุณภาพ',
      descriptionEn: 'Quality Chiang Mai travel services',
      descriptionZh: '清迈优质旅游服务',
      address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพมหานคร 10110',
      phone: '0812345678',
      email: 'merchant@example.com',
      emergency: '0812345679',
      operatingHours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '10:00', close: '16:00', closed: false },
        sunday: { open: '10:00', close: '16:00', closed: false },
      },
      images: [] as string[],
      certifications: [] as string[],
      awards: [] as string[],
    }
  })
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  useEffect(() => {
    // sync to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('merchant-profile', JSON.stringify(profile))
    }
  }, [profile])

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">โปรไฟล์ผู้ประกอบการ</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <a href="/merchant/dashboard" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ภาพรวม
              </a>
              <a href="/merchant/services" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                จัดการบริการ
              </a>
              <a href="/merchant/profile" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                โปรไฟล์ธุรกิจ
              </a>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Business Information */}
            <div className="card">
              <div className="flex items-center gap-2 mb-6">
                <Languages className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-bold">ข้อมูลธุรกิจ (หลายภาษา)</h2>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ชื่อธุรกิจ (ไทย) *</label>
                  <input
                    type="text"
                    className="input"
                    value={profile.businessName}
                    onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">ชื่อธุรกิจ (อังกฤษ)</label>
                  <input
                    type="text"
                    className="input"
                    value={profile.businessNameEn}
                    onChange={(e) => setProfile({ ...profile, businessNameEn: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">ชื่อธุรกิจ (จีน)</label>
                  <input
                    type="text"
                    className="input"
                    value={profile.businessNameZh}
                    onChange={(e) => setProfile({ ...profile, businessNameZh: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">คำอธิบาย (ไทย) *</label>
                  <textarea
                    rows={4}
                    className="input"
                    value={profile.description}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">คำอธิบาย (อังกฤษ)</label>
                  <textarea
                    rows={4}
                    className="input"
                    value={profile.descriptionEn}
                    onChange={(e) => setProfile({ ...profile, descriptionEn: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">คำอธิบาย (จีน)</label>
                  <textarea
                    rows={4}
                    className="input"
                    value={profile.descriptionZh}
                    onChange={(e) => setProfile({ ...profile, descriptionZh: e.target.value })}
                  />
                </div>
              </form>
            </div>
            
            {/* Contact Information */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">ข้อมูลติดต่อ</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    ที่อยู่
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      เบอร์โทรศัพท์
                    </label>
                    <input
                      type="tel"
                      className="input"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      อีเมล
                    </label>
                    <input
                      type="email"
                      className="input"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    ข้อมูลติดต่อฉุกเฉิน
                  </label>
                  <input
                    type="tel"
                    className="input"
                    value={profile.emergency}
                    onChange={(e) => setProfile({ ...profile, emergency: e.target.value })}
                    placeholder="เบอร์โทรศัพท์ฉุกเฉิน"
                  />
                </div>
              </div>
            </div>
            
            {/* Operating Hours */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                เวลาทำการ
              </h2>
              <div className="space-y-3">
                {Object.entries(profile.operatingHours as Record<string, { open: string; close: string; closed?: boolean }>).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium capitalize">
                      {day === 'monday' ? 'จันทร์' :
                       day === 'tuesday' ? 'อังคาร' :
                       day === 'wednesday' ? 'พุธ' :
                       day === 'thursday' ? 'พฤหัสบดี' :
                       day === 'friday' ? 'ศุกร์' :
                       day === 'saturday' ? 'เสาร์' : 'อาทิตย์'}
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!hours.closed}
                        onChange={(e) => setProfile({
                          ...profile,
                          operatingHours: {
                            ...profile.operatingHours,
                            [day]: { ...hours, closed: !e.target.checked }
                          }
                        })}
                        className="rounded"
                      />
                      <span className="text-sm">เปิด</span>
                    </label>
                    {!hours.closed && (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          className="input w-32"
                          value={hours.open}
                          onChange={(e) => setProfile({
                            ...profile,
                            operatingHours: {
                              ...profile.operatingHours,
                              [day]: { ...hours, open: e.target.value }
                            }
                          })}
                        />
                        <span>ถึง</span>
                        <input
                          type="time"
                          className="input w-32"
                          value={hours.close}
                          onChange={(e) => setProfile({
                            ...profile,
                            operatingHours: {
                              ...profile.operatingHours,
                              [day]: { ...hours, close: e.target.value }
                            }
                          })}
                        />
                      </div>
                    )}
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
                  <label className="block text-sm font-medium mb-2">อัปโหลดใบรับรอง</label>
                  <input
                    type="file"
                    multiple
                    className="input"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const files = e.target.files
                      if (!files) return
                      const urls: string[] = []
                      Array.from(files).forEach((f) => {
                        if (f.type.startsWith('image/')) {
                          urls.push(URL.createObjectURL(f))
                        }
                      })
                      if (urls.length) {
                        setProfile((p: any) => ({ ...p, certifications: [...urls, ...(p.certifications || [])] }))
                      }
                    }}
                  />
                  {profile.certifications?.length ? (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {profile.certifications.map((src: string, i: number) => (
                        <div key={i} className="relative aspect-square rounded overflow-hidden bg-neutral-200">
                          <img src={src} alt={`cert-${i}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">อัปโหลดรางวัล</label>
                  <input
                    type="file"
                    multiple
                    className="input"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const files = e.target.files
                      if (!files) return
                      const urls: string[] = []
                      Array.from(files).forEach((f) => {
                        if (f.type.startsWith('image/')) {
                          urls.push(URL.createObjectURL(f))
                        }
                      })
                      if (urls.length) {
                        setProfile((p: any) => ({ ...p, awards: [...urls, ...(p.awards || [])] }))
                      }
                    }}
                  />
                  {profile.awards?.length ? (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {profile.awards.map((src: string, i: number) => (
                        <div key={i} className="relative aspect-square rounded overflow-hidden bg-neutral-200">
                          <img src={src} alt={`award-${i}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            
            {/* Gallery */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">แกลเลอรีรูปภาพ</h2>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {profile.images?.length
                  ? profile.images.map((src: string, i: number) => (
                      <div key={i} className="aspect-square bg-neutral-200 rounded-lg overflow-hidden relative">
                        <img src={src} alt={`img-${i}`} className="w-full h-full object-cover" />
                      </div>
                    ))
                  : null}
              </div>
              <label className="btn-secondary inline-block cursor-pointer">
                เพิ่มรูปภาพ
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files
                    if (!files) return
                    const urls: string[] = []
                    Array.from(files).forEach((f) => {
                      urls.push(URL.createObjectURL(f))
                    })
                    setProfile((p: any) => ({ ...p, images: [...urls, ...(p.images || [])] }))
                  }}
                />
              </label>
            </div>
            
            {/* Reviews Section */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">รีวิวจากลูกค้า</h2>
              <div className="flex gap-4 mb-4">
                <select className="input w-auto">
                  <option>ทุกคะแนน</option>
                  <option>5 ดาว</option>
                  <option>4 ดาว</option>
                  <option>3 ดาว</option>
                  <option>2 ดาว</option>
                  <option>1 ดาว</option>
                </select>
                <input
                  type="date"
                  className="input w-auto"
                  placeholder="จากวันที่"
                />
                <input
                  type="date"
                  className="input w-auto"
                  placeholder="ถึงวันที่"
                />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
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
            
            <button
              className="btn-primary w-full flex items-center justify-center gap-2"
              onClick={() => {
                localStorage.setItem('merchant-profile', JSON.stringify(profile))
                setSavedMsg('บันทึกแล้ว')
                setTimeout(() => setSavedMsg(null), 1500)
              }}
            >
              <Save className="w-4 h-4" />
              บันทึกการเปลี่ยนแปลง
            </button>
            {savedMsg && <p className="text-sm text-green-600 mt-2">{savedMsg}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

