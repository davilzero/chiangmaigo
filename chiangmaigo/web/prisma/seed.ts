import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data (optional - uncomment if needed)
  // await prisma.review.deleteMany()
  // await prisma.booking.deleteMany()
  // await prisma.servicePackage.deleteMany()
  // await prisma.service.deleteMany()
  // await prisma.merchant.deleteMany()
  // await prisma.admin.deleteMany()
  // await prisma.user.deleteMany()
  // await prisma.category.deleteMany()

  // Create categories
  console.log('📁 Creating categories...')
  const tourCategory = await prisma.category.upsert({
    where: { id: 'cat-tours' },
    update: {},
    create: {
      id: 'cat-tours',
      name: 'ทัวร์',
      nameEn: 'Tours',
      nameZh: '旅游',
      order: 1,
    },
  })

  const accommodationCategory = await prisma.category.upsert({
    where: { id: 'cat-accommodation' },
    update: {},
    create: {
      id: 'cat-accommodation',
      name: 'ที่พัก',
      nameEn: 'Accommodation',
      nameZh: '住宿',
      order: 2,
    },
  })

  const restaurantCategory = await prisma.category.upsert({
    where: { id: 'cat-restaurant' },
    update: {},
    create: {
      id: 'cat-restaurant',
      name: 'ร้านอาหาร',
      nameEn: 'Restaurants',
      nameZh: '餐厅',
      order: 3,
    },
  })

  const activityCategory = await prisma.category.upsert({
    where: { id: 'cat-activity' },
    update: {},
    create: {
      id: 'cat-activity',
      name: 'กิจกรรม',
      nameEn: 'Activities',
      nameZh: '活动',
      order: 4,
    },
  })

  // Hash password helper
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10)
  }

  // Create test users
  console.log('👤 Creating test users...')
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      name: 'ลูกค้าทดสอบ',
      phone: '0812345678',
      password: await hashPassword('123456'),
      role: 'CUSTOMER',
    },
  })

  const merchantUser = await prisma.user.upsert({
    where: { email: 'merchant@test.com' },
    update: {},
    create: {
      email: 'merchant@test.com',
      name: 'ผู้ประกอบการทดสอบ',
      phone: '0823456789',
      password: await hashPassword('123456'),
      role: 'MERCHANT',
    },
  })

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'ผู้ดูแลระบบ',
      phone: '0834567890',
      password: await hashPassword('admin123'),
      role: 'ADMIN',
    },
  })

  // Create additional test accounts
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'ผู้ใช้ 1',
      phone: '0845678901',
      password: await hashPassword('123456'),
      role: 'CUSTOMER',
    },
  })

  await prisma.user.upsert({
    where: { email: 'shop@chiangmaigo.com' },
    update: {},
    create: {
      email: 'shop@chiangmaigo.com',
      name: 'ร้านค้าทดสอบ',
      phone: '0856789012',
      password: await hashPassword('123456'),
      role: 'MERCHANT',
    },
  })

  await prisma.user.upsert({
    where: { email: 'admin@chiangmaigo.com' },
    update: {},
    create: {
      email: 'admin@chiangmaigo.com',
      name: 'Admin สำรอง',
      phone: '0867890123',
      password: await hashPassword('admin123'),
      role: 'ADMIN',
    },
  })

  // Create Merchant Profile
  console.log('🏪 Creating merchant profiles...')
  const merchant = await prisma.merchant.upsert({
    where: { userId: merchantUser.id },
    update: {},
    create: {
      userId: merchantUser.id,
      businessName: 'ร้านทัวร์เชียงใหม่',
      businessNameEn: 'Chiang Mai Tours',
      businessNameZh: '清迈旅游',
      description: 'ให้บริการทัวร์และกิจกรรมท่องเที่ยวในเชียงใหม่',
      descriptionEn: 'Tour and travel activities in Chiang Mai',
      descriptionZh: '清迈旅游和活动服务',
      address: '123 ถนนนิมมานเหมินทร์ อำเภอเมืองเชียงใหม่',
      contact: {
        phone: '0823456789',
        email: 'merchant@test.com',
        emergency: '0812345678',
      },
      images: [],
      certifications: ['ใบอนุญาตท่องเที่ยว'],
      awards: [],
      status: 'ACTIVE',
    },
  })

  // Create Admin Profile
  console.log('👨‍💼 Creating admin profiles...')
  await prisma.admin.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      role: 'ADMIN',
    },
  })

  // Create sample advertisements
  console.log('📢 Creating sample advertisements...')
  await prisma.advertisement.create({
    data: {
      merchantId: merchant.id,
      title: 'โฆษณาบริการท่องเที่ยวเชียงใหม่',
      description: 'โปรโมทบริการท่องเที่ยวในเชียงใหม่',
      type: 'BANNER',
      images: ['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200&h=400&fit=crop'],
      link: '/services',
      budget: 5000,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      position: 'HOME_TOP',
      status: 'ACTIVE',
    },
  })

  await prisma.advertisement.create({
    data: {
      merchantId: merchant.id,
      title: 'แคมเปญโปรโมชั่นพิเศษ',
      description: 'โปรโมชั่นพิเศษสำหรับลูกค้าใหม่',
      type: 'SPONSORED',
      images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop'],
      link: '/promotions',
      budget: 10000,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-03-31'),
      position: 'SERVICES_SIDEBAR',
      status: 'PENDING',
    },
  })

  console.log('✅ Seed data created successfully!')
  console.log('\n📋 Test Accounts:')
  console.log('Customer: customer@test.com / 123456')
  console.log('Merchant: merchant@test.com / 123456')
  console.log('Admin: admin@test.com / admin123')
  console.log('\n📢 Sample Advertisements created for merchant')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


