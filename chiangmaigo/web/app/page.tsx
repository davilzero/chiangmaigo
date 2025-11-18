import Link from 'next/link'
import { Search, MapPin, Star, TrendingUp } from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-accent-500 to-secondary-600 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              ค้นหาบริการท่องเที่ยวเชียงใหม่
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              ศูนย์กลางสำหรับค้นหา จอง และจัดการบริการท่องเที่ยวท้องถิ่น
            </p>
            
            {/* Search Bar */}
            <div className="bg-white/95 rounded-lg p-2 shadow-lg flex gap-2 backdrop-blur">
              <div className="flex-1 flex items-center gap-2 px-4">
                <Search className="w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="ค้นหาบริการท่องเที่ยว..."
                  className="flex-1 outline-none text-neutral-900"
                />
              </div>
              <button className="px-8 rounded-lg font-medium bg-secondary-500 hover:bg-secondary-600 text-white transition-colors">
                ค้นหา
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">หมวดหมู่บริการ</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'ทัวร์', icon: MapPin },
            { name: 'ที่พัก', icon: Star },
            { name: 'ร้านอาหาร', icon: TrendingUp },
            { name: 'กิจกรรม', icon: Star },
          ].map((category) => (
            <Link
              key={category.name}
              href={`/services?category=${category.name}`}
              className="card text-center hover:shadow-md transition-shadow"
            >
              <category.icon className="w-12 h-12 mx-auto mb-4 text-primary-600" />
              <h3 className="font-semibold">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Services */}
      <section className="bg-neutral-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">บริการยอดนิยม</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 'doi-suthep',
                name: 'วัดพระธาตุดอยสุเทพ',
                price: 300,
                img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&h=800&fit=crop&q=80',
              },
              {
                id: 'doi-inthanon',
                name: 'ดอยอินทนนท์',
                price: 500,
                img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&q=80',
              },
              {
                id: 'wat-phra-singh',
                name: 'วัดพระสิงห์',
                price: 100,
                img: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&h=800&fit=crop&q=80',
              },
            ].map((s) => (
              <div key={s.id} className="card">
                <div className="aspect-video bg-neutral-200 rounded-lg mb-4 overflow-hidden relative">
                  <Image src={s.img} alt={s.name} fill className="object-cover" unoptimized />
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-primary-600 font-bold">฿{s.price.toLocaleString()}</span>
                  <Link href={`/services/${s.id}`} className="btn-primary text-sm">
                    ดูรายละเอียด
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

