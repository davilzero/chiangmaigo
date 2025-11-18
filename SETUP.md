# คู่มือการติดตั้งและตั้งค่าโปรเจ็กต์

## ความต้องการของระบบ

- Node.js 18+ 
- npm หรือ yarn
- PostgreSQL (สำหรับ Database)
- Git

## ขั้นตอนการติดตั้ง

### 1. Clone โปรเจ็กต์

```bash
git clone <repository-url>
cd chiangmaigo
```

### 2. ติดตั้ง Dependencies

```bash
# ติดตั้ง dependencies สำหรับ root
npm install

# ติดตั้ง dependencies สำหรับ Web App
cd web
npm install

# ติดตั้ง dependencies สำหรับ Mobile App
cd ../mobile
npm install
```

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์ `web/`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/chiangmaigo?schema=public"

# Authentication
JWT_SECRET="your-secret-key-here"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Payment Gateway
STRIPE_API_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
OMISE_PUBLIC_KEY="pkey_test_..."
OMISE_SECRET_KEY="skey_test_..."

# Email Service
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-password"

# File Upload
UPLOAD_MAX_SIZE=10485760
UPLOAD_ALLOWED_TYPES="image/jpeg,image/png,image/webp"

# Third-party Services
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
SENDGRID_API_KEY="your-sendgrid-api-key"

# App Configuration
APP_NAME="แพลตฟอร์มบริการท่องเที่ยวเชียงใหม่"
APP_URL="http://localhost:3000"
DEFAULT_LANGUAGE="th"
```

### 4. ตั้งค่า Database

```bash
cd web

# Generate Prisma Client
npm run db:generate

# Push schema to database (สำหรับ development)
npm run db:push

# หรือใช้ Migration (สำหรับ production)
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

### 5. รันโปรเจ็กต์

#### Web App
```bash
cd web
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:3000`

#### Mobile App
```bash
cd mobile
npm run ios  # สำหรับ iOS
npm run android  # สำหรับ Android
```

## การใช้งาน Prisma Studio

เพื่อดูและจัดการข้อมูลใน Database:

```bash
cd web
npm run db:studio
```

เปิดเบราว์เซอร์ที่ `http://localhost:5555`

## โครงสร้างโปรเจ็กต์

```
chiangmaigo/
├── web/                 # Next.js Web Application
│   ├── app/            # App Router pages
│   ├── components/     # React components
│   ├── lib/            # Utilities, API clients, stores
│   ├── prisma/         # Prisma schema and migrations
│   └── public/         # Static files
├── mobile/             # React Native Mobile App
│   ├── app/            # Expo Router pages
│   └── components/     # React Native components
└── shared/             # Shared code (if any)
```

## Troubleshooting

### ปัญหา Database Connection

1. ตรวจสอบว่า PostgreSQL กำลังทำงานอยู่
2. ตรวจสอบ `DATABASE_URL` ในไฟล์ `.env`
3. ตรวจสอบสิทธิ์การเข้าถึง Database

### ปัญหา Prisma

```bash
# ลบ node_modules และ .next
rm -rf node_modules .next

# ติดตั้งใหม่
npm install

# Generate Prisma Client ใหม่
npm run db:generate
```

### ปัญหา Port ถูกใช้งาน

เปลี่ยน port ใน `package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3001"
  }
}
```

## ขั้นตอนต่อไป

1. ตั้งค่า Database และรัน Migrations
2. ตั้งค่า Payment Gateway (Stripe/Omise)
3. ตั้งค่า Email Service (SendGrid/SMTP)
4. ตั้งค่า Google Maps API
5. เริ่มพัฒนาและทดสอบฟีเจอร์

## หมายเหตุ

- โค้ดปัจจุบันใช้ Mock Data สำหรับการทดสอบ
- ต้องเชื่อมต่อ Database และ API จริงก่อนใช้งานจริง
- ต้องตั้งค่า Environment Variables ทั้งหมดก่อนรันโปรเจ็กต์

