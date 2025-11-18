import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="card max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">ลืมรหัสผ่าน</h1>
        
        <p className="text-neutral-600 mb-6 text-center">
          กรุณากรอกอีเมลที่ใช้สมัครสมาชิก เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้คุณ
        </p>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              อีเมล
            </label>
            <input
              type="email"
              id="email"
              className="input"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <button type="submit" className="btn-primary w-full">
            ส่งลิงก์รีเซ็ตรหัสผ่าน
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-primary-600 hover:underline">
            ← กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  )
}


