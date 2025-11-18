import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { authenticateRequest } from '@/lib/auth/middleware'
import { createBookingSuccessNotification } from '@/lib/utils/notifications'

export async function GET(request: NextRequest) {
  try {
    // Authenticate user (optional - for guest bookings)
    const authResult = await authenticateRequest(request)
    const userId = authResult.user?.userId || null

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')

    // Build where clause
    const where: any = {}
    
    if (userId) {
      where.userId = userId
    } else {
      // If not authenticated, only return guest bookings (should be filtered by guest email/phone in production)
      where.isGuest = true
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus.toUpperCase()
    }

    // Fetch bookings from database
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            nameZh: true,
            images: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        package: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            nameZh: true,
            price: true,
            duration: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform to match frontend format
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      serviceId: booking.serviceId,
      service: booking.service,
      userId: booking.userId,
      user: booking.user,
      packageId: booking.packageId,
      package: booking.package,
      date: booking.date,
      numberOfPeople: booking.numberOfPeople,
      specialRequirements: booking.specialRequirements,
      totalPrice: booking.totalPrice,
      status: booking.status.toLowerCase(),
      paymentStatus: booking.paymentStatus.toLowerCase(),
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      isGuest: booking.isGuest,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }))

    return NextResponse.json({ bookings: formattedBookings })
  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      serviceId,
      packageId,
      date,
      numberOfPeople,
      specialRequirements,
      totalPrice,
      // Guest information (optional)
      guestName,
      guestEmail,
      guestPhone,
    } = data

    // Validate required fields
    if (!serviceId || !date || !numberOfPeople || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required fields: serviceId, date, numberOfPeople, totalPrice' },
        { status: 400 }
      )
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Check if package exists (if provided)
    if (packageId) {
      const packageExists = await prisma.servicePackage.findUnique({
        where: { id: packageId },
      })

      if (!packageExists) {
        return NextResponse.json(
          { error: 'Package not found' },
          { status: 404 }
        )
      }
    }

    // Authenticate user (optional - for guest checkout)
    const authResult = await authenticateRequest(request)
    const userId = authResult.user?.userId || null
    const isGuest = !userId

    // Validate guest information if guest checkout
    if (isGuest) {
      if (!guestName || !guestEmail || !guestPhone) {
        return NextResponse.json(
          { error: 'Guest information required: guestName, guestEmail, guestPhone' },
          { status: 400 }
        )
      }
    }

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        userId: userId || null,
        packageId: packageId || null,
        date: new Date(date),
        numberOfPeople: parseInt(numberOfPeople),
        specialRequirements: specialRequirements || null,
        totalPrice: parseFloat(totalPrice),
        status: 'PENDING',
        paymentStatus: 'PENDING',
        isGuest,
        guestName: isGuest ? guestName : null,
        guestEmail: isGuest ? guestEmail : null,
        guestPhone: isGuest ? guestPhone : null,
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            nameZh: true,
            images: true,
          },
        },
        package: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            nameZh: true,
            price: true,
            duration: true,
          },
        },
      },
    })

    // Create notification for registered users (not guests)
    if (userId && !isGuest) {
      try {
        await createBookingSuccessNotification(
          userId,
          booking.id,
          booking.service.name
        )
      } catch (error) {
        // Don't fail the booking if notification fails
        console.error('Failed to create notification:', error)
      }
    }

    return NextResponse.json({
      message: 'Booking created successfully',
      booking: {
        id: booking.id,
        serviceId: booking.serviceId,
        service: booking.service,
        userId: booking.userId,
        packageId: booking.packageId,
        package: booking.package,
        date: booking.date,
        numberOfPeople: booking.numberOfPeople,
        specialRequirements: booking.specialRequirements,
        totalPrice: booking.totalPrice,
        status: booking.status.toLowerCase(),
        paymentStatus: booking.paymentStatus.toLowerCase(),
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        guestPhone: booking.guestPhone,
        isGuest: booking.isGuest,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      },
    }, { status: 201 })
  } catch (error: any) {
    console.error('Create booking error:', error)
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Booking already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


