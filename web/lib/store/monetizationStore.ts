'use client'

import { create } from 'zustand'

type CategoryKey = 'ทั้งหมด' | 'ทัวร์' | 'ที่พัก' | 'ร้านอาหาร' | 'กิจกรรม'

interface MonetizationSettings {
  // ค่าธรรมเนียมฝั่งลูกค้า (แสดงในสรุปก่อนชำระเงิน)
  convenienceFeeFlatTHB: number
  // คอมมิชชันฝั่งแพลตฟอร์มต่อหมวด (เดโม ใช้ตัวเลขรวม)
  commissionPercentByCategory: Partial<Record<CategoryKey, number>>
  // รายการบริการที่ติด Sponsored
  sponsoredServiceIds: string[]
  // Subscription สำหรับผู้ประกอบการ (เดโม toggle)
  merchantSubscriptionEnabled: boolean
}

interface MonetizationState extends MonetizationSettings {
  setSettings: (settings: Partial<MonetizationSettings>) => void
  loadFromStorage: () => void
}

const STORAGE_KEY = 'monetization-settings'

const defaultSettings: MonetizationSettings = {
  convenienceFeeFlatTHB: 20,
  commissionPercentByCategory: {
    ทั้งหมด: 10,
    ทัวร์: 12,
    กิจกรรม: 15,
  },
  sponsoredServiceIds: ['doi-suthep', 'elephant-nature-park'],
  merchantSubscriptionEnabled: false,
}

export const useMonetizationStore = create<MonetizationState>((set, get) => ({
  ...defaultSettings,
  setSettings: (partial) => {
    const merged = { ...get(), ...partial }
    set(merged)
    if (typeof window !== 'undefined') {
      const toSave: MonetizationSettings = {
        convenienceFeeFlatTHB: merged.convenienceFeeFlatTHB,
        commissionPercentByCategory: merged.commissionPercentByCategory,
        sponsoredServiceIds: merged.sponsoredServiceIds,
        merchantSubscriptionEnabled: merged.merchantSubscriptionEnabled,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    }
  },
  loadFromStorage: () => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as MonetizationSettings
      set({ ...get(), ...parsed })
    } catch {
      // ignore corrupted storage
    }
  },
}))


