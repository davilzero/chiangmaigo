'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useMonetizationStore } from '@/lib/store/monetizationStore'
import { useAuthStore } from '@/lib/store/authStore'
import { logEditHistory } from '@/lib/utils/editHistory'
import { ExternalLink } from 'lucide-react'

export default function AdminMonetizationSettingsPage() {
  const { user } = useAuthStore()
  const {
    convenienceFeeFlatTHB,
    commissionPercentByCategory,
    sponsoredServiceIds,
    merchantSubscriptionEnabled,
    setSettings,
    loadFromStorage,
  } = useMonetizationStore()

  const handleSave = (settingsToSave: any, entityId: string) => {
    setSettings(settingsToSave)
    if (user) {
      logEditHistory({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: 'update',
        entityType: 'monetization',
        entityId: entityId,
      })
    }
  }

  const [localSponsored, setLocalSponsored] = useState(sponsoredServiceIds.join(','))
  const [localFee, setLocalFee] = useState<number>(convenienceFeeFlatTHB)
  const [localSubEnabled, setLocalSubEnabled] = useState<boolean>(merchantSubscriptionEnabled)
  const [localCommissionAll, setLocalCommissionAll] = useState<number>(commissionPercentByCategory['ทั้งหมด'] ?? 10)
  const [localCommissionTour, setLocalCommissionTour] = useState<number>(commissionPercentByCategory['ทัวร์'] ?? 12)
  const [localCommissionActivity, setLocalCommissionActivity] = useState<number>(commissionPercentByCategory['กิจกรรม'] ?? 15)

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  useEffect(() => {
    setLocalSponsored(sponsoredServiceIds.join(','))
    setLocalFee(convenienceFeeFlatTHB)
    setLocalSubEnabled(merchantSubscriptionEnabled)
    setLocalCommissionAll(commissionPercentByCategory['ทั้งหมด'] ?? 10)
    setLocalCommissionTour(commissionPercentByCategory['ทัวร์'] ?? 12)
    setLocalCommissionActivity(commissionPercentByCategory['กิจกรรม'] ?? 15)
  }, [
    sponsoredServiceIds,
    convenienceFeeFlatTHB,
    merchantSubscriptionEnabled,
    commissionPercentByCategory,
  ])

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ตั้งค่า Monetization</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Convenience Fee (ลูกค้า)</h2>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm text-neutral-700">ค่าธรรมเนียมคงที่ (บาท)</span>
                <input
                  type="number"
                  className="input mt-1"
                  value={localFee}
                  onChange={(e) => setLocalFee(Number(e.target.value || 0))}
                  min={0}
                />
              </label>
              <button
                onClick={() => handleSave({ convenienceFeeFlatTHB: Math.max(0, Number(localFee || 0)) }, 'convenience-fee')}
                className="btn-primary"
              >
                บันทึกค่าธรรมเนียม
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">คอมมิชชัน (แพลตฟอร์ม)</h2>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm text-neutral-700">ทั้งหมด (%)</span>
                <input
                  type="number"
                  className="input mt-1"
                  value={localCommissionAll}
                  onChange={(e) => setLocalCommissionAll(Number(e.target.value || 0))}
                  min={0}
                  max={100}
                />
              </label>
              <label className="block">
                <span className="text-sm text-neutral-700">ทัวร์ (%)</span>
                <input
                  type="number"
                  className="input mt-1"
                  value={localCommissionTour}
                  onChange={(e) => setLocalCommissionTour(Number(e.target.value || 0))}
                  min={0}
                  max={100}
                />
              </label>
              <label className="block">
                <span className="text-sm text-neutral-700">กิจกรรม (%)</span>
                <input
                  type="number"
                  className="input mt-1"
                  value={localCommissionActivity}
                  onChange={(e) => setLocalCommissionActivity(Number(e.target.value || 0))}
                  min={0}
                  max={100}
                />
              </label>
              <button
                onClick={() =>
                  handleSave({
                    commissionPercentByCategory: {
                      ...commissionPercentByCategory,
                      ทั้งหมด: Math.max(0, Math.min(100, Number(localCommissionAll || 0))),
                      ทัวร์: Math.max(0, Math.min(100, Number(localCommissionTour || 0))),
                      กิจกรรม: Math.max(0, Math.min(100, Number(localCommissionActivity || 0))),
                    },
                  }, 'commission')
                }
                className="btn-primary"
              >
                บันทึกคอมมิชชัน
              </button>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">บริการยอดนิยม / สปอนเซอร์</h2>
              <Link
                href="/admin/settings/sponsored"
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                จัดการบริการสปอนเซอร์
              </Link>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>ปัจจุบันมีบริการสปอนเซอร์:</strong> {sponsoredServiceIds.length} รายการ
                </p>
                {sponsoredServiceIds.length > 0 && (
                  <div className="text-xs text-blue-700">
                    <strong>Service IDs:</strong> {sponsoredServiceIds.join(', ')}
                  </div>
                )}
              </div>
              <p className="text-sm text-neutral-600">
                ใช้หน้าจัดการบริการสปอนเซอร์เพื่อเลือกบริการที่จะแสดงเป็นบริการยอดนิยม
              </p>
              <div className="pt-2 border-t border-neutral-200">
                <label className="block mb-2">
                  <span className="text-sm text-neutral-700">แก้ไขด้วย Service IDs (คั่นด้วยเครื่องหมายจุลภาค)</span>
                  <input
                    type="text"
                    className="input mt-1"
                    placeholder="เช่น doi-suthep,elephant-nature-park"
                    value={localSponsored}
                    onChange={(e) => setLocalSponsored(e.target.value)}
                  />
                </label>
                <button
                  onClick={() =>
                    setSettings({
                      sponsoredServiceIds: localSponsored
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="btn-primary text-sm"
                >
                  บันทึก Sponsored
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Subscription ผู้ประกอบการ</h2>
            <div className="space-y-3">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localSubEnabled}
                  onChange={(e) => setLocalSubEnabled(e.target.checked)}
                />
                <span>เปิดใช้งานแพ็กเกจ Subscription</span>
              </label>
              <button
                onClick={() => handleSave({ merchantSubscriptionEnabled: !!localSubEnabled }, 'subscription')}
                className="btn-primary"
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


