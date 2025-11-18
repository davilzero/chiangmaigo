import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// POST /api/advertisements/[id]/click - Track advertisement click
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const advertisement = await prisma.advertisement.findUnique({
      where: { id: params.id },
    })

    if (!advertisement) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      )
    }

    // Only track clicks for active ads
    if (advertisement.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Advertisement is not active' },
        { status: 400 }
      )
    }

    // Check if ad is within date range
    const now = new Date()
    if (now < advertisement.startDate || now > advertisement.endDate) {
      return NextResponse.json(
        { error: 'Advertisement is not active' },
        { status: 400 }
      )
    }

    // Increment clicks
    const updated = await prisma.advertisement.update({
      where: { id: params.id },
      data: { clicks: { increment: 1 } },
    })

    return NextResponse.json({
      success: true,
      clicks: updated.clicks,
      link: updated.link,
    })
  } catch (error) {
    console.error('Track click error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

