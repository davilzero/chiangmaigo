# 🚀 Quick Start Guide - Deploy to Vercel with Real Database

## ขั้นตอนด่วน (5 นาที)

### 1. ตั้งค่า Database (เลือก 1 ตัวเลือก)

#### ตัวเลือก A: Vercel Postgres (ง่ายที่สุด) ⭐
1. ไปที่ Vercel Dashboard → Storage → Create Database → Postgres
2. คัดลอก connection string

#### ตัวเลือก B: Supabase (ฟรี 500MB)
1. ไปที่ [supabase.com](https://supabase.com) → สร้างโปรเจ็กต์
2. Settings → Database → คัดลอก connection string

#### ตัวเลือก C: Neon (Serverless)
1. ไปที่ [neon.tech](https://neon.tech) → สร้างโปรเจ็กต์
2. คัดลอก connection string

### 2. ตั้งค่า Environment Variables ใน Vercel

ไปที่ Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL = "postgresql://..." (จากขั้นตอนที่ 1)
JWT_SECRET = "สร้างด้วย: openssl rand -base64 32"
NEXTAUTH_URL = "https://your-app.vercel.app"
NEXTAUTH_SECRET = "สร้างด้วย: openssl rand -base64 32"
```

### 3. Deploy

```bash
# Push ไป GitHub
git add .
git commit -m "Ready for production"
git push

# Vercel จะ deploy อัตโนมัติ
```

### 4. รัน Migration และ Seed

```bash
# ตั้งค่า DATABASE_URL
export DATABASE_URL="your-production-connection-string"

# รัน migration
cd web
npm run db:migrate

# รัน seed (สำหรับข้อมูลทดสอบ)
npm run db:seed
```

### 5. ทดสอบ

เปิดเว็บไซต์: `https://your-app.vercel.app`

**บัญชีทดสอบ:**
- Customer: `customer@test.com` / `123456`
- Merchant: `merchant@test.com` / `123456`
- Admin: `admin@test.com` / `admin123`

---

## 📚 เอกสารเพิ่มเติม

- **คู่มือ Deploy แบบละเอียด:** [`DEPLOY_GUIDE.md`](./DEPLOY_GUIDE.md)
- **ตั้งค่า Environment Variables:** [`web/ENV_SETUP.md`](./web/ENV_SETUP.md)

---

## ✅ Checklist

- [ ] ตั้งค่า Database
- [ ] ตั้งค่า Environment Variables ใน Vercel
- [ ] Push code ไป GitHub
- [ ] Deploy บน Vercel
- [ ] รัน Migration
- [ ] รัน Seed
- [ ] ทดสอบเว็บไซต์

---

## 🆘 ปัญหาที่พบบ่อย

**Q: Database connection error?**  
A: ตรวจสอบ `DATABASE_URL` ใน Environment Variables

**Q: Build failed?**  
A: ตรวจสอบว่า `DATABASE_URL` และ `JWT_SECRET` ถูกตั้งค่าแล้ว

**Q: Prisma Client not found?**  
A: รัน `npm run db:generate` หรือ `npm install` (มี postinstall script)

---

**พร้อมแล้ว! 🎉**

