import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password, name, phone } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // TODO: Check if user already exists
    // const existingUser = await prisma.user.findUnique({ where: { email } })
    // if (existingUser) {
    //   return NextResponse.json(
    //     { error: 'User already exists' },
    //     { status: 400 }
    //   )
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // TODO: Create user in database
    // const user = await prisma.user.create({
    //   data: {
    //     email,
    //     password: hashedPassword,
    //     name,
    //     phone,
    //     role: 'CUSTOMER',
    //   },
    // })

    return NextResponse.json({
      message: 'User created successfully',
      // user: {
      //   id: user.id,
      //   email: user.email,
      //   name: user.name,
      //   role: user.role,
      // },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

