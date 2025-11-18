import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Mock user data - เดโม: ตรวจแค่อีเมลว่ามีอยู่
const mockUsers = [
  { id: '1', email: 'user@example.com', name: 'ผู้ใช้ 1', role: 'customer' },
  { id: '2', email: 'merchant@example.com', name: 'ผู้ประกอบการ 1', role: 'merchant' },
  { id: '3', email: 'admin@example.com', name: 'ผู้ดูแลระบบ', role: 'admin' },
]

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // เดโม: ตรงอีเมลก็ถือว่าใช้ได้ รหัสผ่านไม่ตรวจจริง
    const user = mockUsers.find(u => u.email === email)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: (user as any).role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: (user as any).name,
        role: (user as any).role,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

