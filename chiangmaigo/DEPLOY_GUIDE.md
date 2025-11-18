# 🚀 คู่มือการ Deploy ไป Vercel พร้อม Database จริง

คู่มือนี้จะช่วยคุณ deploy เว็บไซต์ไป Vercel และเชื่อมต่อกับ database จริง

---

## 📋 สารบัญ

1. [เตรียมความพร้อม](#1-เตรียมความพร้อม)
2. [ตั้งค่า Database](#2-ตั้งค่า-database)
3. [ตั้งค่า Environment Variables](#3-ตั้งค่า-environment-variables)
4. [Deploy ไป Vercel](#4-deploy-ไป-vercel)
5. [รัน Migration และ Seed](#5-รัน-migration-และ-seed)
6. [ตรวจสอบการทำงาน](#6-ตรวจสอบการทำงาน)

---

## 1. เตรียมความพร้อม

### 1.1 ตรวจสอบไฟล์ที่จำเป็น

✅ ไฟล์ที่ควรมี:
- `web/.env.example` - ตัวอย่าง environment variables
- `web/prisma/schema.prisma` - Database schema
- `web/vercel.json` - Vercel configuration
- `web/package.json` - มี scripts สำหรับ database

### 1.2 ติดตั้ง Dependencies

```bash
cd web
npm install
```

---

## 2. ตั้งค่า Database

### ตัวเลือกที่แนะนำ:

#### ตัวเลือก 1: Vercel Postgres (แนะนำ - ง่ายที่สุด) ⭐

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือกโปรเจ็กต์ของคุณ
3. ไปที่แท็บ **Storage**
4. คลิก **Create Database** → เลือก **Postgres**
5. ตั้งชื่อ database (เช่น `chiangmaigo-db`)
6. เลือก region (แนะนำ: `Singapore (sin1)`)
7. คลิก **Create**
8. Vercel จะสร้าง connection string ให้อัตโนมัติ

**ข้อดี:**
- ✅ ฟรี (Hobby plan)
- ✅ เชื่อมต่อง่าย ไม่ต้องตั้งค่าเอง
- ✅ Auto-scaling
- ✅ Backup อัตโนมัติ

#### ตัวเลือก 2: Supabase (แนะนำ - ฟรีและมี features มาก)

1. ไปที่ [Supabase](https://supabase.com)
2. สร้างโปรเจ็กต์ใหม่
3. ไปที่ **Settings** → **Database**
4. คัดลอก **Connection String** (URI format)
5. ใช้ connection string นี้ใน Vercel

**ข้อดี:**
- ✅ ฟรี 500MB
- ✅ มี Dashboard ดี
- ✅ Real-time features
- ✅ Storage สำหรับไฟล์

#### ตัวเลือก 3: Neon (แนะนำ - Serverless PostgreSQL)

1. ไปที่ [Neon](https://neon.tech)
2. สร้างโปรเจ็กต์ใหม่
3. คัดลอก connection string
4. ใช้ใน Vercel

**ข้อดี:**
- ✅ ฟรี 0.5GB
- ✅ Serverless (auto-sleep)
- ✅ Branching (เหมือน Git)

---

## 3. ตั้งค่า Environment Variables

### 3.1 สร้างไฟล์ `.env.local` (สำหรับ local development)

```bash
cd web
cp .env.example .env.local
```

แก้ไขไฟล์ `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/chiangmaigo?schema=public"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"
```

**⚠️ สำคัญ:** อย่า commit ไฟล์ `.env.local` ลง Git!

### 3.2 สร้าง JWT Secret

```bash
# สร้าง secret key ที่ปลอดภัย
openssl rand -base64 32
```

หรือใช้ online tool: https://generate-secret.vercel.app/32

### 3.3 ตั้งค่า Environment Variables ใน Vercel

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือกโปรเจ็กต์ของคุณ
3. ไปที่ **Settings** → **Environment Variables**
4. เพิ่มตัวแปรต่อไปนี้:

| Key | Value | Environment |
|-----|-------|-------------|
| `DATABASE_URL` | Connection string จาก database | Production, Preview, Development |
| `JWT_SECRET` | Secret key ที่สร้างไว้ | Production, Preview, Development |
| `NEXTAUTH_URL` | URL ของเว็บไซต์ (เช่น `https://your-app.vercel.app`) | Production |
| `NEXTAUTH_SECRET` | Secret key อีกตัว (ใช้ openssl rand -base64 32) | Production, Preview, Development |

**สำหรับ Vercel Postgres:**
- Vercel จะสร้าง `POSTGRES_URL` อัตโนมัติ
- ใช้ `POSTGRES_URL` แทน `DATABASE_URL` หรือ
- ตั้งค่า `DATABASE_URL` = `POSTGRES_URL` ใน Environment Variables

---

## 4. Deploy ไป Vercel

### 4.1 วิธีที่ 1: Deploy ผ่าน GitHub (แนะนำ)

1. **Push code ไป GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **เชื่อมต่อ Vercel กับ GitHub:**
   - ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
   - คลิก **Add New Project**
   - เลือก repository จาก GitHub
   - ตั้งค่า:
     - **Framework Preset:** Next.js
     - **Root Directory:** `web`
     - **Build Command:** `npm run build`
     - **Output Directory:** `.next`
     - **Install Command:** `npm install`

3. **Deploy:**
   - Vercel จะ deploy อัตโนมัติ
   - รอให้ build เสร็จ

### 4.2 วิธีที่ 2: Deploy ผ่าน Vercel CLI

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd web
vercel

# Deploy to production
vercel --prod
```

---

## 5. รัน Migration และ Seed

### 5.1 สร้าง Migration

```bash
cd web

# Generate Prisma Client
npm run db:generate

# Create migration
npm run db:migrate
```

### 5.2 Seed Database (สำหรับข้อมูลทดสอบ)

**วิธีที่ 1: รันผ่าน Vercel CLI (แนะนำ)**

```bash
# ตั้งค่า DATABASE_URL ใน local
export DATABASE_URL="your-production-database-url"

# รัน seed
npm run db:seed
```

**วิธีที่ 2: รันผ่าน Vercel Dashboard**

1. ไปที่ Vercel Dashboard
2. เลือกโปรเจ็กต์
3. ไปที่ **Settings** → **Functions**
4. สร้าง API route ชั่วคราวสำหรับ seed:

สร้างไฟล์ `web/app/api/admin/seed/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: Request) {
  // ตรวจสอบ authentication (ควรเพิ่ม)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.SEED_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // รัน seed script
    const { stdout, stderr } = await execAsync('npm run db:seed')
    return NextResponse.json({ 
      success: true, 
      output: stdout,
      error: stderr 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      output: error.stdout,
      stderr: error.stderr
    }, { status: 500 })
  }
}
```

**⚠️ วิธีนี้ไม่แนะนำสำหรับ production - ควรรัน seed ผ่าน CLI หรือ script**

**วิธีที่ 3: ใช้ Vercel Postgres Studio**

1. ไปที่ Vercel Dashboard
2. เลือกโปรเจ็กต์ → **Storage** → **Postgres**
3. คลิก **Open Studio**
4. รัน SQL queries หรือใช้ Prisma Studio

### 5.3 รัน Seed ผ่าน Script

สร้างไฟล์ `web/scripts/seed-production.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // ... seed code จาก prisma/seed.ts
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

รัน:
```bash
DATABASE_URL="your-production-url" npx tsx scripts/seed-production.ts
```

---

## 6. ตรวจสอบการทำงาน

### 6.1 ตรวจสอบ Database Connection

1. ไปที่ Vercel Dashboard
2. ดู **Functions** logs
3. ตรวจสอบว่ามี error เกี่ยวกับ database หรือไม่

### 6.2 ทดสอบ API Endpoints

```bash
# ทดสอบ login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@test.com","password":"123456"}'

# ทดสอบ services
curl https://your-app.vercel.app/api/services
```

### 6.3 ตรวจสอบ Frontend

1. เปิดเว็บไซต์: `https://your-app.vercel.app`
2. ทดสอบ login
3. ทดสอบการดู services
4. ทดสอบการจอง

---

## 🔧 Troubleshooting

### ปัญหา: Database connection error

**แก้ไข:**
1. ตรวจสอบ `DATABASE_URL` ใน Environment Variables
2. ตรวจสอบว่า database เปิดใช้งานอยู่
3. ตรวจสอบ network/firewall settings

### ปัญหา: Prisma Client not generated

**แก้ไข:**
```bash
cd web
npm run db:generate
```

### ปัญหา: Migration failed

**แก้ไข:**
```bash
# ตรวจสอบ schema
npx prisma validate

# Reset database (⚠️ จะลบข้อมูลทั้งหมด)
npx prisma migrate reset

# สร้าง migration ใหม่
npx prisma migrate dev
```

### ปัญหา: Build failed on Vercel

**แก้ไข:**
1. ตรวจสอบ logs ใน Vercel Dashboard
2. ตรวจสอบว่า `DATABASE_URL` ถูกตั้งค่าแล้ว
3. ตรวจสอบว่า Prisma Client ถูก generate แล้ว

เพิ่มใน `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

---

## 📝 Checklist ก่อน Deploy

- [ ] ตั้งค่า Database (Vercel Postgres / Supabase / Neon)
- [ ] ตั้งค่า Environment Variables ใน Vercel
- [ ] สร้าง JWT_SECRET ที่ปลอดภัย
- [ ] Push code ไป GitHub
- [ ] เชื่อมต่อ Vercel กับ GitHub repository
- [ ] Deploy ไป Vercel
- [ ] รัน Migration
- [ ] รัน Seed (ถ้าต้องการ)
- [ ] ทดสอบ API endpoints
- [ ] ทดสอบ Frontend
- [ ] ตรวจสอบ Logs

---

## 🎉 เสร็จสิ้น!

ตอนนี้เว็บไซต์ของคุณควรทำงานกับ database จริงแล้ว!

**Next Steps:**
- เพิ่ม Payment Gateway (Stripe/Omise)
- เพิ่ม File Upload (Cloudinary/AWS S3)
- เพิ่ม Email Service (SendGrid/Resend)
- เพิ่ม Monitoring (Sentry/Vercel Analytics)

---

## 📚 เอกสารเพิ่มเติม

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase Documentation](https://supabase.com/docs)

---

**คำถามหรือปัญหา?** เปิด issue ใน GitHub repository!

