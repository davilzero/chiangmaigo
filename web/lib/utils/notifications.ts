/**
 * ระบบการแจ้งเตือน แยกตามผู้ใช้
 */

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  link?: string // Optional link to navigate when clicked
}

const STORAGE_KEY = 'user-notifications'

/**
 * ดึงการแจ้งเตือนทั้งหมดของผู้ใช้
 */
export function getNotifications(userId: string): Notification[] {
  if (typeof window === 'undefined') return []
  
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  
  try {
    const allNotifications: Notification[] = JSON.parse(raw)
    return allNotifications.filter(n => n.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  } catch {
    return []
  }
}

/**
 * ดึงการแจ้งเตือนที่ยังไม่ได้อ่าน
 */
export function getUnreadNotifications(userId: string): Notification[] {
  return getNotifications(userId).filter(n => !n.read)
}

/**
 * นับจำนวนการแจ้งเตือนที่ยังไม่ได้อ่าน
 */
export function getUnreadCount(userId: string): number {
  return getUnreadNotifications(userId).length
}

/**
 * เพิ่มการแจ้งเตือนใหม่
 */
export function addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) {
  if (typeof window === 'undefined') return
  
  const raw = localStorage.getItem(STORAGE_KEY)
  const allNotifications: Notification[] = raw ? JSON.parse(raw) : []
  
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    read: false,
    createdAt: new Date().toISOString(),
  }
  
  allNotifications.push(newNotification)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allNotifications))
}

/**
 * ทำเครื่องหมายว่าอ่านแล้ว
 */
export function markAsRead(notificationId: string, userId: string) {
  if (typeof window === 'undefined') return
  
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return
  
  try {
    const allNotifications: Notification[] = JSON.parse(raw)
    const updated = allNotifications.map(n => 
      n.id === notificationId && n.userId === userId
        ? { ...n, read: true }
        : n
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // ignore errors
  }
}

/**
 * ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว
 */
export function markAllAsRead(userId: string) {
  if (typeof window === 'undefined') return
  
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return
  
  try {
    const allNotifications: Notification[] = JSON.parse(raw)
    const updated = allNotifications.map(n => 
      n.userId === userId && !n.read
        ? { ...n, read: true }
        : n
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // ignore errors
  }
}

/**
 * ลบการแจ้งเตือน
 */
export function deleteNotification(notificationId: string, userId: string) {
  if (typeof window === 'undefined') return
  
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return
  
  try {
    const allNotifications: Notification[] = JSON.parse(raw)
    const filtered = allNotifications.filter(n => 
      !(n.id === notificationId && n.userId === userId)
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch {
    // ignore errors
  }
}

/**
 * ลบการแจ้งเตือนทั้งหมดของผู้ใช้
 */
export function clearAllNotifications(userId: string) {
  if (typeof window === 'undefined') return
  
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return
  
  try {
    const allNotifications: Notification[] = JSON.parse(raw)
    const filtered = allNotifications.filter(n => n.userId !== userId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch {
    // ignore errors
  }
}

