/**
 * Validation utilities
 */

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  // Thai phone number format: 0X-XXXX-XXXX or 0XXXXXXXXX
  const phoneRegex = /^0[0-9]{9}$/
  return phoneRegex.test(phone.replace(/[-\s]/g, ''))
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' }
  }
  return { valid: true }
}

export function validateRequired(value: any, fieldName: string): { valid: boolean; error?: string } {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, error: `${fieldName} is required` }
  }
  return { valid: true }
}

export function validateNumber(value: any, fieldName: string, min?: number, max?: number): { valid: boolean; error?: string } {
  const num = typeof value === 'number' ? value : parseFloat(value)
  
  if (isNaN(num)) {
    return { valid: false, error: `${fieldName} must be a number` }
  }
  
  if (min !== undefined && num < min) {
    return { valid: false, error: `${fieldName} must be at least ${min}` }
  }
  
  if (max !== undefined && num > max) {
    return { valid: false, error: `${fieldName} must be at most ${max}` }
  }
  
  return { valid: true }
}

export function validateDate(date: any, fieldName: string = 'Date'): { valid: boolean; error?: string; date?: Date } {
  if (!date) {
    return { valid: false, error: `${fieldName} is required` }
  }
  
  const dateObj = date instanceof Date ? date : new Date(date)
  
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: `${fieldName} is invalid` }
  }
  
  // Check if date is in the future (for booking dates)
  if (dateObj < new Date()) {
    return { valid: false, error: `${fieldName} must be in the future` }
  }
  
  return { valid: true, date: dateObj }
}

