'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMonetizationStore } from '@/lib/store/monetizationStore'
import { DollarSign, BarChart3 } from 'lucide-react'

export default function AdminRevenuePage() {
  const { convenienceFeeFlatTHB, commissionPercentByCategory, loadFromStorage } = useMonetizationStore()
  const [bookings, setBookings] = useState<Array<any>>([])

  useEffect(() => {
    loadFromStorage()
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('user-bookings')
        setBookings(raw ? JSON.parse(raw) : [])
      } catch {
        setBookings([])
      }
    }
  }, [loadFromStorage])

  const revenue = useMemo(() => {
    let totalGross = 0
    let totalConvenience = 0
    let totalCommission = 0
    const byCategory: Record<string, { gross: number; commission: number; count: number }> = {}
    const byDate: Record<string, number> = {}

    bookings.forEach((b) => {
      const totalPrice = Number(b.totalPrice || 0)
      const category = (b.category || 'ทั้งหมด') as keyof typeof commissionPercentByCategory
      const fee = Math.max(0, Math.min(convenienceFeeFlatTHB, totalPrice))
      const base = Math.max(0, totalPrice - fee)
      const percent =
        (commissionPercentByCategory[category] ??
          commissionPercentByCategory['ทั้งหมด'] ??
          0) / 100
      const commission = base * percent

      totalGross += totalPrice
      totalConvenience += fee
      totalCommission += commission

      const dateKey = b.date ? new Date(b.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
      byDate[dateKey] = (byDate[dateKey] || 0) + totalPrice

      const cat = (category as string) || 'ทั้งหมด'
      byCategory[cat] = byCategory[cat] || { gross: 0, commission: 0, count: 0 }
      byCategory[cat].gross += totalPrice
      byCategory[cat].commission += commission
      byCategory[cat].count += 1
    })

    return { totalGross, totalConvenience, totalCommission, byCategory, byDate }
  }, [bookings, convenienceFeeFlatTHB, commissionPercentByCategory])

  const dates = Object.keys(revenue.byDate).sort()

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">สรุปรายได้แพลตฟอร์ม</h1>
          <p className="text-neutral-600">แสดงรายได้จาก Convenience Fee และ Commission (เดโม)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">ยอดขายรวม (Gross)</p>
                <p className="text-3xl font-bold">฿{Math.round(revenue.totalGross).toLocaleString()}</p>
              </div>
              <DollarSign className="w-12 h-12 text-primary-600 opacity-50" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Convenience Fee</p>
                <p className="text-3xl font-bold">฿{Math.round(revenue.totalConvenience).toLocaleString()}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-primary-600 opacity-50" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Commission</p>
                <p className="text-3xl font-bold">฿{Math.round(revenue.totalCommission).toLocaleString()}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-primary-600 opacity-50" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">รายได้ตามหมวด</h2>
            <div className="space-y-2">
              {Object.entries(revenue.byCategory).length === 0 && <p className="text-neutral-600">ยังไม่มีข้อมูลการจอง</p>}
              {Object.entries(revenue.byCategory).map(([cat, val]) => (
                <div key={cat} className="flex items-center justify-between p-2 border border-neutral-200 rounded-lg">
                  <div>
                    <p className="font-medium">{cat}</p>
                    <p className="text-xs text-neutral-600">
                      จำนวน {val.count} | Gross ฿{Math.round(val.gross).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Commission ฿{Math.round(val.commission).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">รายได้ตามวัน</h2>
            <div className="space-y-2">
              {dates.length === 0 && <p className="text-neutral-600">ยังไม่มีข้อมูลการจอง</p>}
              {dates.map((d) => (
                <div key={d} className="flex items-center justify-between p-2 border border-neutral-200 rounded-lg">
                  <span>{d}</span>
                  <span>฿{Math.round(revenue.byDate[d]).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



