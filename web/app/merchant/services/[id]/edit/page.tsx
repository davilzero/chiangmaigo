'use client'

import { useState, useEffect } from 'react'
import { Save, X, Languages, Upload } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams()
  const serviceId = params.id as string
  const [loading, setLoading] = useState(true)
  const [service, setService] = useState({
    id: '',
    name: '',
    nameEn: '',
    nameZh: '',
    description: '',
    descriptionEn: '',
    descriptionZh: '',
    category: '',
    price: 0,
    images: [] as string[],
    packages: [] as Array<{ name: string; price: number; duration: string }>,
  })

  useEffect(() => {
    // Load service data
    if (typeof window !== 'undefined') {
      // Try to load from localStorage
      const list = localStorage.getItem('merchant-services')
      if (list) {
        const parsed = JSON.parse(list)
        const found = parsed.find((s: any, idx: number) => {
          const id = s.id || `local-${idx}-${s.createdAt || Date.now()}`
          return id === serviceId
        })
        
        if (found) {
          setService({
            id: found.id || serviceId,
            name: found.name || '',
            nameEn: found.nameEn || '',
            nameZh: found.nameZh || '',
            description: found.description || '',
            descriptionEn: found.descriptionEn || '',
            descriptionZh: found.descriptionZh || '',
            category: found.category || '',
            price: found.price || 0,
            images: found.images || [],
            packages: found.packages || [],
          })
        }
      }
      
      // If not found in localStorage, try seed data
      if (loading) {
        const seedServices: any = {
          '1': { name: 'ทัวร์ดอยสุเทพ', category: 'tours', price: 1500 },
          '2': { name: 'กิจกรรมทำอาหาร', category: 'activities', price: 800 },
          '3': { name: 'ที่พักรีสอร์ท', category: 'accommodation', price: 2500 },
        }
        const seed = seedServices[serviceId]
        if (seed) {
          setService({
            id: serviceId,
            name: seed.name,
            nameEn: '',
            nameZh: '',
            description: '',
            descriptionEn: '',
            descriptionZh: '',
            category: seed.category,
            price: seed.price,
            images: [],
            packages: [],
          })
        }
      }
      
      setLoading(false)
    }
  }, [serviceId, loading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Update in localStorage
    if (typeof window !== 'undefined' && String(serviceId).startsWith('local-')) {
      const list = localStorage.getItem('merchant-services')
      if (list) {
        const parsed = JSON.parse(list)
        const updated = parsed.map((s: any, idx: number) => {
          const id = s.id || `local-${idx}-${s.createdAt || Date.now()}`
          if (id === serviceId) {
            return {
              ...s,
              name: service.name,
              nameEn: service.nameEn,
              nameZh: service.nameZh,
              description: service.description,
              descriptionEn: service.descriptionEn,
              descriptionZh: service.descriptionZh,
              category: service.category,
              price: service.price,
              images: service.images,
              packages: service.packages,
              updatedAt: new Date().toISOString(),
            }
          }
          return s
        })
        localStorage.setItem('merchant-services', JSON.stringify(updated))
      }
    }
    
    router.push('/merchant/services')
  }

  const handleImagesAdd = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const urls: string[] = []
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      urls.push(url)
    })
    setService((prev) => ({ ...prev, images: [...urls, ...prev.images] }))
  }

  const handleImageRemove = (index: number) => {
    setService((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">แก้ไขบริการ</h1>
          <button
            onClick={() => router.back()}
            className="btn-secondary"
          >
            ยกเลิก
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          {/* Basic Information */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <Languages className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold">ข้อมูลพื้นฐาน (หลายภาษา)</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">ชื่อบริการ (ไทย) *</label>
                <input
                  type="text"
                  className="input"
                  value={service.name}
                  onChange={(e) => setService({ ...service, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">ชื่อบริการ (อังกฤษ)</label>
                <input
                  type="text"
                  className="input"
                  value={service.nameEn}
                  onChange={(e) => setService({ ...service, nameEn: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">ชื่อบริการ (จีน)</label>
                <input
                  type="text"
                  className="input"
                  value={service.nameZh}
                  onChange={(e) => setService({ ...service, nameZh: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">คำอธิบาย (ไทย) *</label>
                <textarea
                  rows={6}
                  className="input"
                  value={service.description}
                  onChange={(e) => setService({ ...service, description: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">คำอธิบาย (อังกฤษ)</label>
                <textarea
                  rows={6}
                  className="input"
                  value={service.descriptionEn}
                  onChange={(e) => setService({ ...service, descriptionEn: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">คำอธิบาย (จีน)</label>
                <textarea
                  rows={6}
                  className="input"
                  value={service.descriptionZh}
                  onChange={(e) => setService({ ...service, descriptionZh: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">หมวดหมู่ *</label>
                  <select
                    className="input"
                    value={service.category}
                    onChange={(e) => setService({ ...service, category: e.target.value })}
                    required
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    <option value="tours">ทัวร์</option>
                    <option value="accommodation">ที่พัก</option>
                    <option value="restaurants">ร้านอาหาร</option>
                    <option value="activities">กิจกรรม</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">ราคาเริ่มต้น (฿) *</label>
                  <input
                    type="number"
                    className="input"
                    value={service.price}
                    onChange={(e) => setService({ ...service, price: parseFloat(e.target.value) })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Images */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">รูปภาพบริการ</h2>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {service.images.length > 0 &&
                service.images.map((img, i) => (
                  <div key={i} className="aspect-square bg-neutral-200 rounded-lg relative overflow-hidden">
                    <img src={img} alt={`service-${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(i)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              <div className="col-span-4 text-center py-12 border-2 border-dashed border-neutral-300 rounded-lg">
                <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm text-neutral-600 mb-2">อัปโหลดรูปภาพบริการ</p>
                <label className="btn-secondary inline-block cursor-pointer">
                  เลือกไฟล์
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImagesAdd(e.target.files)}
                  />
                </label>
              </div>
            </div>
            {service.images.length > 0 && <p className="text-sm text-neutral-600">รูปที่เพิ่มจะอยู่เฉพาะบนเครื่องสำหรับเดโม</p>}
          </div>
          
          {/* Packages */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">แพ็คเกจบริการ</h2>
            <div className="space-y-4">
              {service.packages.map((pkg, i) => (
                <div key={i} className="border border-neutral-200 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">ชื่อแพ็คเกจ</label>
                      <input
                        type="text"
                        className="input"
                        value={pkg.name}
                        onChange={(e) => {
                          const newPackages = [...service.packages]
                          newPackages[i].name = e.target.value
                          setService({ ...service, packages: newPackages })
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">ราคา (฿)</label>
                      <input
                        type="number"
                        className="input"
                        value={pkg.price}
                        onChange={(e) => {
                          const newPackages = [...service.packages]
                          newPackages[i].price = parseFloat(e.target.value)
                          setService({ ...service, packages: newPackages })
                        }}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">ระยะเวลา</label>
                      <input
                        type="text"
                        className="input"
                        value={pkg.duration}
                        onChange={(e) => {
                          const newPackages = [...service.packages]
                          newPackages[i].duration = e.target.value
                          setService({ ...service, packages: newPackages })
                        }}
                        placeholder="เช่น 1 วัน"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setService({ ...service, packages: service.packages.filter((_, idx) => idx !== i) })}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    ลบแพ็คเกจ
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setService({ ...service, packages: [...service.packages, { name: '', price: 0, duration: '' }] })}
                className="btn-secondary"
              >
                เพิ่มแพ็คเกจ
              </button>
            </div>
          </div>
          
          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary flex-1"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


