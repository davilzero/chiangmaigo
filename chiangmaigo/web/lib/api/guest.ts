/**
 * Guest Checkout Utilities
 * Functions for handling guest bookings
 */

export interface GuestInfo {
  name: string
  email: string
  phone: string
}

export const saveGuestInfo = (info: GuestInfo): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('guest-info', JSON.stringify(info))
  }
}

export const getGuestInfo = (): GuestInfo | null => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('guest-info')
    if (saved) {
      return JSON.parse(saved)
    }
  }
  return null
}

export const clearGuestInfo = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('guest-info')
  }
}


