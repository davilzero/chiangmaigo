# 📢 Advertisement API Documentation

## Overview

ระบบโฆษณาสำหรับผู้ประกอบการและ Admin เพื่อจัดการแคมเปญโฆษณา

---

## API Endpoints

### 1. GET /api/advertisements

**Description:** ดึงรายการโฆษณา

**Query Parameters:**
- `merchantId` (optional) - กรองตาม merchant ID
- `status` (optional) - กรองตามสถานะ (pending, active, rejected, paused, expired)
- `type` (optional) - กรองตามประเภท (banner, sponsored, popup, sidebar)
- `search` (optional) - ค้นหาจากชื่อหรือคำอธิบาย

**Authentication:** Optional (public ads only for non-authenticated users)

**Response:**
```json
{
  "advertisements": [
    {
      "id": "string",
      "merchantId": "string",
      "merchant": {
        "id": "string",
        "businessName": "string"
      },
      "title": "string",
      "description": "string",
      "type": "banner",
      "images": ["string"],
      "link": "string",
      "budget": 5000,
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-12-31T23:59:59Z",
      "targetAudience": {},
      "position": "home_top",
      "status": "active",
      "clicks": 0,
      "impressions": 0,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 2. POST /api/advertisements

**Description:** สร้างโฆษณาใหม่ (Merchant/Admin only)

**Authentication:** Required (MERCHANT or ADMIN role)

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "type": "banner|sponsored|popup|sidebar (required)",
  "images": ["string"] (optional),
  "link": "string (optional)",
  "budget": 5000 (required),
  "startDate": "2024-01-01T00:00:00Z" (required),
  "endDate": "2024-12-31T23:59:59Z" (required),
  "targetAudience": {} (optional),
  "position": "home_top|home_bottom|services_sidebar|services_top|detail_sidebar|detail_bottom" (required),
  "merchantId": "string" (optional, required for admin)
}
```

**Response:** 201 Created
```json
{
  "message": "Advertisement created successfully",
  "advertisement": { ... }
}
```

---

### 3. GET /api/advertisements/[id]

**Description:** ดึงรายละเอียดโฆษณา (เพิ่ม impressions อัตโนมัติ)

**Authentication:** Not required

**Response:**
```json
{
  "advertisement": { ... }
}
```

---

### 4. PATCH /api/advertisements/[id]

**Description:** อัปเดตโฆษณา

**Authentication:** Required (Owner or Admin)

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "type": "string (optional)",
  "images": ["string"] (optional),
  "link": "string (optional)",
  "budget": 5000 (optional),
  "startDate": "2024-01-01T00:00:00Z" (optional),
  "endDate": "2024-12-31T23:59:59Z" (optional),
  "targetAudience": {} (optional),
  "position": "string (optional)",
  "status": "string (optional, admin only)"
}
```

**Response:**
```json
{
  "advertisement": { ... }
}
```

---

### 5. DELETE /api/advertisements/[id]

**Description:** ลบโฆษณา

**Authentication:** Required (Owner or Admin)

**Response:**
```json
{
  "message": "Advertisement deleted successfully"
}
```

---

### 6. PATCH /api/advertisements/[id]/status

**Description:** อัปเดตสถานะโฆษณา (Admin only)

**Authentication:** Required (ADMIN role)

**Request Body:**
```json
{
  "status": "pending|active|rejected|paused|expired",
  "reason": "string (optional)"
}
```

**Response:**
```json
{
  "advertisement": { ... }
}
```

---

### 7. POST /api/advertisements/[id]/click

**Description:** บันทึกการคลิกโฆษณา (เพิ่ม clicks อัตโนมัติ)

**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "clicks": 1,
  "link": "string"
}
```

---

## Advertisement Types

- `BANNER` - แบนเนอร์โฆษณา
- `SPONSORED` - โฆษณาแบบสนับสนุน
- `POPUP` - ป๊อปอัพ
- `SIDEBAR` - แถบข้าง

## Advertisement Positions

- `HOME_TOP` - หน้าแรกด้านบน
- `HOME_BOTTOM` - หน้าแรกด้านล่าง
- `SERVICES_SIDEBAR` - หน้าบริการแถบข้าง
- `SERVICES_TOP` - หน้าบริการด้านบน
- `DETAIL_SIDEBAR` - หน้ารายละเอียดแถบข้าง
- `DETAIL_BOTTOM` - หน้ารายละเอียดด้านล่าง

## Advertisement Status

- `PENDING` - รออนุมัติ
- `ACTIVE` - ใช้งาน
- `REJECTED` - ปฏิเสธ
- `PAUSED` - หยุดชั่วคราว
- `EXPIRED` - หมดอายุ

---

## Permissions

- **Public:** สามารถดูโฆษณาที่ active และอยู่ในช่วงวันที่
- **Merchant:** สามารถสร้างและจัดการโฆษณาของตัวเอง
- **Admin:** สามารถจัดการโฆษณาทั้งหมดและอนุมัติ/ปฏิเสธ

---

## Notes

1. โฆษณาใหม่จะเริ่มต้นด้วยสถานะ `PENDING` และต้องรอ Admin อนุมัติ
2. Admin เท่านั้นที่สามารถเปลี่ยนสถานะได้
3. การคลิกและแสดงผลจะถูกบันทึกอัตโนมัติ
4. โฆษณาจะแสดงเฉพาะที่อยู่ในช่วงวันที่และมีสถานะ `ACTIVE`

