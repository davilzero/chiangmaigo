/**
 * ระบบบันทึกประวัติการแก้ไข
 * บันทึกว่าใครเป็นผู้แก้ไข และเมื่อไหร่
 */

export interface EditHistoryEntry {
  id: string
  userId: string
  userName: string
  userRole: string
  action: string // 'create' | 'update' | 'delete' | 'approve' | 'reject' | etc.
  entityType: string // 'service' | 'user' | 'promotion' | 'settings' | etc.
  entityId: string
  changes?: {
    field: string
    oldValue: any
    newValue: any
  }[]
  timestamp: string
  ipAddress?: string
  userAgent?: string
}

const STORAGE_KEY = 'edit-history'

/**
 * บันทึกประวัติการแก้ไข
 */
export function logEditHistory(entry: Omit<EditHistoryEntry, 'id' | 'timestamp'>) {
  if (typeof window === 'undefined') return

  const history = getEditHistory()
  const newEntry: EditHistoryEntry = {
    ...entry,
    id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    ipAddress: 'N/A', // ใน production จะดึงจาก request
    userAgent: navigator.userAgent,
  }

  const updated = [newEntry, ...history].slice(0, 1000) // เก็บแค่ 1000 รายการล่าสุด
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

/**
 * ดึงประวัติการแก้ไขทั้งหมด
 */
export function getEditHistory(): EditHistoryEntry[] {
  if (typeof window === 'undefined') return []
  
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

/**
 * ดึงประวัติการแก้ไขตาม entity
 */
export function getEditHistoryByEntity(entityType: string, entityId: string): EditHistoryEntry[] {
  return getEditHistory().filter(
    h => h.entityType === entityType && h.entityId === entityId
  )
}

/**
 * ดึงประวัติการแก้ไขตามผู้ใช้
 */
export function getEditHistoryByUser(userId: string): EditHistoryEntry[] {
  return getEditHistory().filter(h => h.userId === userId)
}

/**
 * ล้างประวัติการแก้ไข
 */
export function clearEditHistory() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

