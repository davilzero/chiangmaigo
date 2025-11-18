// User Types
export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'customer' | 'merchant' | 'admin'
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

// Service Types
export interface Service {
  id: string
  name: string
  nameEn?: string
  nameZh?: string
  description: string
  descriptionEn?: string
  descriptionZh?: string
  category: string
  price: number
  images: string[]
  location: {
    address: string
    lat: number
    lng: number
  }
  rating: number
  reviewCount: number
  merchantId: string
  status: 'active' | 'pending' | 'suspended'
  packages?: ServicePackage[]
  faqs?: FAQ[]
  createdAt: Date
  updatedAt: Date
}

export interface ServicePackage {
  id: string
  name: string
  nameEn?: string
  nameZh?: string
  price: number
  duration: string
  description?: string
}

// Booking Types
export interface Booking {
  id: string
  serviceId: string
  service?: Service
  userId: string
  user?: User
  packageId?: string
  package?: ServicePackage
  date: Date
  numberOfPeople: number
  specialRequirements?: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  createdAt: Date
  updatedAt: Date
}

// Review Types
export interface Review {
  id: string
  bookingId: string
  serviceId: string
  userId: string
  user?: User
  rating: number
  comment: string
  images?: string[]
  createdAt: Date
  updatedAt: Date
}

// Merchant Types
export interface Merchant {
  id: string
  businessName: string
  businessNameEn?: string
  businessNameZh?: string
  description: string
  descriptionEn?: string
  descriptionZh?: string
  address: string
  contact: {
    phone: string
    email: string
    emergency?: string
  }
  images: string[]
  operatingHours?: OperatingHours
  certifications?: string[]
  awards?: string[]
  rating: number
  reviewCount: number
  userId: string
  status: 'active' | 'pending' | 'suspended'
  createdAt: Date
  updatedAt: Date
}

export interface OperatingHours {
  [key: string]: {
    open: string
    close: string
    closed?: boolean
  }
}

// Promotion Types
export interface Promotion {
  id: string
  merchantId: string
  title: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  startDate: Date
  endDate: Date
  status: 'active' | 'inactive' | 'expired'
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

// FAQ Types
export interface FAQ {
  id: string
  serviceId?: string
  question: string
  questionEn?: string
  questionZh?: string
  answer: string
  answerEn?: string
  answerZh?: string
  category?: string
  language: 'th' | 'en' | 'zh'
  createdAt: Date
  updatedAt: Date
}

// Address Types
export interface Address {
  id: string
  userId: string
  name: string
  address: string
  type: 'billing' | 'shipping'
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

// Payment Method Types
export interface PaymentMethod {
  id: string
  userId: string
  type: 'credit_card' | 'debit_card'
  cardType: string
  last4: string
  expiryDate: string
  cardholderName: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: Date
}

// Message Types
export interface Message {
  id: string
  conversationId: string
  senderId: string
  sender?: User
  content: string
  attachments?: string[]
  read: boolean
  createdAt: Date
}

export interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  createdAt: Date
  updatedAt: Date
}

// Language Types
export type Language = 'th' | 'en' | 'zh'

