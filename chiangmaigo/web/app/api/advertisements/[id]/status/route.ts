import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireRole } from '@/lib/auth/middleware'

// PATCH /api/advertisements/[id]/status - Update advertisement status (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireRole(['ADMIN'])(async (req, user) => {
    try {
      const { status, reason } = await req.json()

      if (!status) {
        return NextResponse.json(
          { error: 'status is required' },
          { status: 400 }
        )
      }

      const validStatuses = ['PENDING', 'ACTIVE', 'REJECTED', 'PAUSED', 'EXPIRED']
      if (!validStatuses.includes(status.toUpperCase())) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        )
      }

      const advertisement = await prisma.advertisement.findUnique({
        where: { id: params.id },
      })

      if (!advertisement) {
        return NextResponse.json(
          { error: 'Advertisement not found' },
          { status: 404 }
        )
      }

      const updated = await prisma.advertisement.update({
        where: { id: params.id },
        data: {
          status: status.toUpperCase(),
        },
        include: {
          merchant: {
            select: {
              id: true,
              businessName: true,
            },
          },
        },
      })

      // TODO: Send notification to merchant about status change
      // if (status === 'ACTIVE' || status === 'REJECTED') {
      //   await sendNotification(updated.merchant.userId, {
      //     title: `โฆษณาของคุณ${status === 'ACTIVE' ? 'ได้รับการอนุมัติ' : 'ถูกปฏิเสธ'}`,
      //     message: `โฆษณา "${updated.title}" ${status === 'ACTIVE' ? 'พร้อมใช้งานแล้ว' : reason || ''}`,
      //   })
      // }

      return NextResponse.json({
        advertisement: {
          id: updated.id,
          merchantId: updated.merchantId,
          merchant: updated.merchant,
          title: updated.title,
          status: updated.status.toLowerCase(),
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        },
      })
    } catch (error: any) {
      console.error('Update advertisement status error:', error)
      
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Advertisement not found' },
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

