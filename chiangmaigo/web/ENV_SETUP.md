# 🔐 ตั้งค่า Environment Variables

## สำหรับ Local Development

สร้างไฟล์ `.env.local` ในโฟลเดอร์ `web/`:

```env
# Database
# สำหรับ local: ใช้ PostgreSQL ท้องถิ่น หรือ connection string จาก Supabase/Neon
DATABASE_URL="postgresql://user:password@localhost:5432/chiangmaigo?schema=public"

# Authentication
# สร้างด้วย: openssl rand -base64 32
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"
```

## สำหรับ Vercel Production

### วิธีตั้งค่า:

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือกโปรเจ็กต์ของคุณ
3. ไปที่ **Settings** → **Environment Variables**
4. เพิ่มตัวแปรต่อไปนี้:

### ตัวแปรที่จำเป็น:

| Key | Value | Environment | หมายเหตุ |
|-----|-------|-------------|----------|
| `DATABASE_URL` | Connection string จาก database | All | ใช้จาก Vercel Postgres, Supabase, หรือ Neon |
| `JWT_SECRET` | Secret key (32+ characters) | All | สร้างด้วย `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL ของเว็บไซต์ | Production | เช่น `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Secret key อีกตัว | All | สร้างด้วย `openssl rand -base64 32` |

### สำหรับ Vercel Postgres:

ถ้าใช้ Vercel Postgres:
- Vercel จะสร้าง `POSTGRES_URL` อัตโนมัติ
- ตั้งค่า `DATABASE_URL` = `POSTGRES_URL` ใน Environment Variables
- หรือใช้ `POSTGRES_URL` โดยตรง (ต้องแก้ไข Prisma schema)

### สร้าง Secret Keys:

```bash
# สร้าง JWT_SECRET
openssl rand -base64 32

# สร้าง NEXTAUTH_SECRET
openssl rand -base64 32
```

หรือใช้ online tool: https://generate-secret.vercel.app/32

## ตัวอย่าง Connection Strings

### Vercel Postgres:
```
postgres://default:password@host.vercel-storage.com:5432/verceldb
```

### Supabase:
```
postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

### Neon:
```
postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## ⚠️ ข้อควรระวัง

1. **อย่า commit `.env.local` ลง Git!**
2. **ใช้ secret keys ที่แตกต่างกันสำหรับ development และ production**
3. **ตรวจสอบว่า Environment Variables ถูกตั้งค่าใน Vercel แล้วก่อน deploy**
4. **สำหรับ production ใช้ strong secrets (32+ characters)**

