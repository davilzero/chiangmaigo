import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAuth } from '@/lib/auth/middleware'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(async (req, user) => {
    try {
      const { status, paymentStatus } = await req.json()
      
      if (!status && !paymentStatus) {
        return NextResponse.json(
          { error: 'status or paymentStatus required' },
          { status: 400 }
        )
      }

      // Check if booking exists
      const booking = await prisma.booking.findUnique({
        where: { id: params.id },
        include: {
          user: true,
        },
      })

      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }

      // Check permissions: user can only update their own bookings, or admin/merchant can update any
      const isOwner = booking.userId === user.userId
      const isAdmin = user.role === 'ADMIN'
      const isMerchant = user.role === 'MERCHANT'

      if (!isOwner && !isAdmin && !isMerchant) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      // Build update data
      const updateData: any = {}
      
      if (status) {
        const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
        if (!validStatuses.includes(status.toUpperCase())) {
          return NextResponse.json(
            { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
            { status: 400 }
          )
        }
        updateData.status = status.toUpperCase()
      }

      if (paymentStatus) {
        const validPaymentStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED']
        if (!validPaymentStatuses.includes(paymentStatus.toUpperCase())) {
          return NextResponse.json(
            { error: `Invalid paymentStatus. Must be one of: ${validPaymentStatuses.join(', ')}` },
            { status: 400 }
          )
        }
        updateData.paymentStatus = paymentStatus.toUpperCase()
      }

      // Update booking in database
      const updated = await prisma.booking.update({
        where: { id: params.id },
        data: updateData,
        include: {
          service: {
            select: {
              id: true,
              name: true,
              nameEn: true,
              nameZh: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          package: {
            select: {
              id: true,
              name: true,
              nameEn: true,
              nameZh: true,
            },
          },
        },
      })

      return NextResponse.json({
        booking: {
          id: updated.id,
          serviceId: updated.serviceId,
          service: updated.service,
          userId: updated.userId,
          user: updated.user,
          packageId: updated.packageId,
          package: updated.package,
          date: updated.date,
          numberOfPeople: updated.numberOfPeople,
          specialRequirements: updated.specialRequirements,
          totalPrice: updated.totalPrice,
          status: updated.status.toLowerCase(),
          paymentStatus: updated.paymentStatus.toLowerCase(),
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        },
      })
    } catch (error: any) {
      console.error('Update booking status error:', error)
      
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })(request)
}



