import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { requireAuth, requireRole } from '@/lib/auth/middleware'

// GET /api/advertisements/[id] - Get advertisement details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const advertisement = await prisma.advertisement.findUnique({
      where: { id: params.id },
      include: {
        merchant: {
          select: {
            id: true,
            businessName: true,
            businessNameEn: true,
            businessNameZh: true,
          },
        },
      },
    })

    if (!advertisement) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      )
    }

    // Increment impressions
    await prisma.advertisement.update({
      where: { id: params.id },
      data: { impressions: { increment: 1 } },
    })

    return NextResponse.json({
      advertisement: {
        id: advertisement.id,
        merchantId: advertisement.merchantId,
        merchant: advertisement.merchant,
        title: advertisement.title,
        description: advertisement.description,
        type: advertisement.type.toLowerCase(),
        images: advertisement.images,
        link: advertisement.link,
        budget: advertisement.budget,
        startDate: advertisement.startDate,
        endDate: advertisement.endDate,
        targetAudience: advertisement.targetAudience,
        position: advertisement.position,
        status: advertisement.status.toLowerCase(),
        clicks: advertisement.clicks,
        impressions: advertisement.impressions + 1,
        createdAt: advertisement.createdAt,
        updatedAt: advertisement.updatedAt,
      },
    })
  } catch (error) {
    console.error('Get advertisement error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/advertisements/[id] - Update advertisement
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(async (req, user) => {
    try {
      const data = await req.json()
      
      // Check if advertisement exists
      const existing = await prisma.advertisement.findUnique({
        where: { id: params.id },
        include: {
          merchant: true,
        },
      })

      if (!existing) {
        return NextResponse.json(
          { error: 'Advertisement not found' },
          { status: 404 }
        )
      }

      // Check permissions
      const isAdmin = user.role === 'ADMIN'
      const isOwner = existing.merchant.userId === user.userId

      if (!isAdmin && !isOwner) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      // Build update data
      const updateData: any = {}

      if (data.title !== undefined) updateData.title = data.title
      if (data.description !== undefined) updateData.description = data.description
      if (data.type !== undefined) updateData.type = data.type.toUpperCase()
      if (data.images !== undefined) updateData.images = data.images
      if (data.link !== undefined) updateData.link = data.link
      if (data.budget !== undefined) updateData.budget = parseFloat(data.budget)
      if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate)
      if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate)
      if (data.targetAudience !== undefined) updateData.targetAudience = data.targetAudience
      if (data.position !== undefined) updateData.position = data.position.toUpperCase()
      
      // Only admin can change status
      if (data.status !== undefined && isAdmin) {
        const validStatuses = ['PENDING', 'ACTIVE', 'REJECTED', 'PAUSED', 'EXPIRED']
        if (!validStatuses.includes(data.status.toUpperCase())) {
          return NextResponse.json(
            { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
            { status: 400 }
          )
        }
        updateData.status = data.status.toUpperCase()
      }

      const updated = await prisma.advertisement.update({
        where: { id: params.id },
        data: updateData,
        include: {
          merchant: {
            select: {
              id: true,
              businessName: true,
            },
          },
        },
      })

      return NextResponse.json({
        advertisement: {
          id: updated.id,
          merchantId: updated.merchantId,
          merchant: updated.merchant,
          title: updated.title,
          description: updated.description,
          type: updated.type.toLowerCase(),
          images: updated.images,
          link: updated.link,
          budget: updated.budget,
          startDate: updated.startDate,
          endDate: updated.endDate,
          targetAudience: updated.targetAudience,
          position: updated.position,
          status: updated.status.toLowerCase(),
          clicks: updated.clicks,
          impressions: updated.impressions,
          createdAt: updated.createdAt,
          updatedAt: updated.updatedAt,
        },
      })
    } catch (error: any) {
      console.error('Update advertisement error:', error)
      
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

// DELETE /api/advertisements/[id] - Delete advertisement
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(async (req, user) => {
    try {
      const existing = await prisma.advertisement.findUnique({
        where: { id: params.id },
        include: {
          merchant: true,
        },
      })

      if (!existing) {
        return NextResponse.json(
          { error: 'Advertisement not found' },
          { status: 404 }
        )
      }

      // Check permissions
      const isAdmin = user.role === 'ADMIN'
      const isOwner = existing.merchant.userId === user.userId

      if (!isAdmin && !isOwner) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      await prisma.advertisement.delete({
        where: { id: params.id },
      })

      return NextResponse.json({ message: 'Advertisement deleted successfully' })
    } catch (error: any) {
      console.error('Delete advertisement error:', error)
      
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

