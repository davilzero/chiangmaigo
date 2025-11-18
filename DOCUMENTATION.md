# เอกสารประกอบโปรเจ็กต์

## โครงสร้างโปรเจ็กต์

### Web Application (`/web`)
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Form Handling**: React Hook Form + Zod

### Mobile Application (`/mobile`)
- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: React Query

## ฟีเจอร์หลัก

### สำหรับลูกค้า (Customer)
- ✅ หน้าแรกพร้อม Hero Section และการค้นหา
- ✅ หน้ารายการบริการพร้อมตัวกรอง
- ✅ หน้ารายละเอียดบริการ
- ✅ ระบบ Authentication (Login, Register, Forgot Password)
- ✅ Dashboard ผู้ใช้
- ✅ จัดการข้อมูลส่วนตัว
- ✅ จัดการที่อยู่
- ✅ จัดการวิธีการชำระเงิน

### สำหรับผู้ประกอบการ (Merchant)
- ✅ Dashboard ผู้ประกอบการ
- ✅ จัดการบริการ
- ⏳ จัดการการจอง
- ⏳ จัดการโปรโมชั่น
- ⏳ จัดการโฆษณา

### สำหรับ Admin
- ✅ Dashboard Admin
- ⏳ จัดการผู้ใช้
- ⏳ จัดการบริการ
- ⏳ จัดการหมวดหมู่
- ⏳ จัดการแบนเนอร์
- ⏳ ตั้งค่าระบบ

## การติดตั้งและรันโปรเจ็กต์

### Web App
```bash
cd web
npm install
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:3000`

### Mobile App
```bash
cd mobile
npm install
npm run ios  # สำหรับ iOS
npm run android  # สำหรับ Android
```

## Design System

### สีหลัก (Primary Colors)
- Primary 50-950: โทนสีเขียวธรรมชาติ
- Neutral 50-950: โทนสีเทาสำหรับ UI

### Typography
- Font Family: Inter (Latin), Noto Sans Thai (Thai)
- Responsive font sizes

### Components
- Button (Primary, Secondary, Outline, Ghost)
- Card
- Input
- และอื่นๆ ใน `/web/components/ui`

## API Routes

### Services
- `GET /api/services` - ดึงรายการบริการ
- `GET /api/services/[id]` - ดึงรายละเอียดบริการ

## ฟีเจอร์ที่ยังต้องพัฒนา

1. **ระบบชำระเงิน**
   - Integration กับ Payment Gateway
   - หน้าชำระเงิน
   - การจัดการการชำระเงิน

2. **ระบบจอง**
   - หน้าจองบริการ
   - การจัดการการจอง
   - การยืนยันการจอง

3. **ระบบรีวิว**
   - หน้าฟอร์มรีวิว
   - การแสดงรีวิว
   - การจัดการรีวิว

4. **Multi-language Support**
   - ระบบเปลี่ยนภาษา (ไทย, อังกฤษ, จีน)
   - การแปลเนื้อหา

5. **ระบบแจ้งเตือน**
   - Real-time notifications
   - Email notifications
   - Push notifications (Mobile)

6. **ระบบแชท**
   - กล่องข้อความ
   - การส่งข้อความ
   - แนบไฟล์

7. **ระบบแผนที่**
   - แสดงตำแหน่งบริการ
   - ขอเส้นทาง
   - แบ่งปันตำแหน่ง

8. **Database Integration**
   - เชื่อมต่อ Database (PostgreSQL/MySQL)
   - ORM (Prisma/Drizzle)
   - Migrations

9. **Authentication & Authorization**
   - JWT Authentication
   - Role-based Access Control
   - Session Management

10. **File Upload**
    - Image upload
    - File management
    - CDN integration

## สิ่งที่ต้องทำต่อ

1. ✅ สร้างโครงสร้างโปรเจ็กต์พื้นฐาน
2. ✅ ตั้งค่า Design System
3. ✅ สร้างหน้าหลักสำหรับลูกค้า
4. ✅ สร้างหน้าจัดการสำหรับผู้ประกอบการ
5. ✅ สร้างหน้าจัดการสำหรับ Admin
6. ⏳ เชื่อมต่อ Database
7. ⏳ สร้างระบบ Authentication
8. ⏳ สร้างระบบ Payment
9. ⏳ เพิ่ม Multi-language Support
10. ⏳ สร้าง Mobile App ครบถ้วน

## หมายเหตุ

- โค้ดปัจจุบันใช้ Mock Data สำหรับการทดสอบ
- ต้องเชื่อมต่อ Database และ API จริงในอนาคต
- ต้องเพิ่ม Error Handling และ Loading States
- ต้องเพิ่ม Unit Tests และ Integration Tests

