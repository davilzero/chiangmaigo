'use client'

import { useState } from 'react'
import { MapPin, Navigation, Share2 } from 'lucide-react'

export default function ServiceMapPage({ params }: { params: { id: string } }) {
  const [location] = useState({
    address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพมหานคร 10110',
    lat: 18.7883,
    lng: 98.9853,
  })

  const handleGetDirections = () => {
    // Open maps app with directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`
    window.open(url, '_blank')
  }

  const handleShareLocation = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ตำแหน่งบริการ',
          text: location.address,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('คัดลอกลิงก์ไปยังคลิปบอร์ดแล้ว')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">แผนที่และตำแหน่ง</h1>
          
          {/* Map Container */}
          <div className="card mb-6">
            <div className="aspect-video bg-neutral-200 rounded-lg mb-4 relative">
              {/* Placeholder for map - ในอนาคตจะใช้ Google Maps */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary-600 mx-auto mb-2" />
                  <p className="text-neutral-600">แผนที่จะแสดงที่นี่</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    {location.lat}, {location.lng}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">จุดนัดพบ/สถานที่ให้บริการ</h3>
                <p className="text-neutral-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {location.address}
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleGetDirections}
              className="card hover:shadow-md transition-shadow text-left p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Navigation className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">ขอเส้นทาง</h3>
                  <p className="text-sm text-neutral-600">
                    เปิดแอปแผนที่หรือแสดงเส้นทางในแพลตฟอร์ม
                  </p>
                </div>
              </div>
            </button>
            
            <button
              onClick={handleShareLocation}
              className="card hover:shadow-md transition-shadow text-left p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Share2 className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">แบ่งปันตำแหน่ง</h3>
                  <p className="text-sm text-neutral-600">
                    แชร์ตำแหน่งนี้กับเพื่อนหรือครอบครัว
                  </p>
                </div>
              </div>
            </button>
          </div>
          
          {/* Additional Information */}
          <div className="card mt-6">
            <h3 className="font-semibold mb-4">ข้อมูลเพิ่มเติม</h3>
            <div className="space-y-2 text-sm text-neutral-700">
              <p>• จุดนัดพบ: หน้าสถานที่บริการ</p>
              <p>• เวลานัดพบ: ตามเวลาที่จอง</p>
              <p>• การเดินทาง: สามารถเดินทางด้วยรถยนต์หรือรถสาธารณะ</p>
              <p>• ที่จอดรถ: มีที่จอดรถให้บริการ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


