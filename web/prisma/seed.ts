import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const tourCategory = await prisma.category.create({
    data: {
      name: 'ทัวร์',
      nameEn: 'Tours',
      nameZh: '旅游',
      order: 1,
    },
  })

  const accommodationCategory = await prisma.category.create({
    data: {
      name: 'ที่พัก',
      nameEn: 'Accommodation',
      nameZh: '住宿',
      order: 2,
    },
  })

  // Create sample user
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'ผู้ใช้ตัวอย่าง',
      phone: '0812345678',
      password: 'hashed_password_here', // Should be hashed with bcrypt
      role: 'CUSTOMER',
    },
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

