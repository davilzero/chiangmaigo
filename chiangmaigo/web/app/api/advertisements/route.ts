import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { authenticateRequest, requireAuth, requireRole } from '@/lib/auth/middleware'

// GET /api/advertisements - List advertisements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const merchantId = searchParams.get('merchantId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    // Authenticate (optional for public ads)
    const authResult = await authenticateRequest(request)
    const isAdmin = authResult.user?.role === 'ADMIN'
    const isMerchant = authResult.user?.role === 'MERCHANT'

    // Build where clause
    const where: any = {}

    // Merchants can only see their own ads
    if (isMerchant && !isAdmin) {
      // Get merchant ID from user
      const user = await prisma.user.findUnique({
        where: { id: authResult.user?.userId },
        include: { merchantProfile: true },
      })
      if (user?.merchantProfile) {
        where.merchantId = user.merchantProfile.id
      } else {
        return NextResponse.json({ advertisements: [] })
      }
    } else if (merchantId) {
      where.merchantId = merchantId
    }

    if (status) {
      where.status = status.toUpperCase()
    } else if (!isAdmin) {
      // Non-admins only see active ads
      where.status = 'ACTIVE'
    }

    if (type) {
      where.type = type.toUpperCase()
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Only show active ads that are within date range (for public)
    if (!isAdmin && !isMerchant) {
      const now = new Date()
      where.startDate = { lte: now }
      where.endDate = { gte: now }
    }

    const advertisements = await prisma.advertisement.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    const formatted = advertisements.map(ad => ({
      id: ad.id,
      merchantId: ad.merchantId,
      merchant: ad.merchant,
      title: ad.title,
      description: ad.description,
      type: ad.type.toLowerCase(),
      images: ad.images,
      link: ad.link,
      budget: ad.budget,
      startDate: ad.startDate,
      endDate: ad.endDate,
      targetAudience: ad.targetAudience,
      position: ad.position,
      status: ad.status.toLowerCase(),
      clicks: ad.clicks,
      impressions: ad.impressions,
      createdAt: ad.createdAt,
      updatedAt: ad.updatedAt,
    }))

    return NextResponse.json({ advertisements: formatted })
  } catch (error) {
    console.error('Get advertisements error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/advertisements - Create advertisement (Merchant only)
export async function POST(request: NextRequest) {
  return requireRole(['MERCHANT', 'ADMIN'])(async (req, user) => {
    try {
      const data = await req.json()
      const {
        title,
        description,
        type,
        images,
        link,
        budget,
        startDate,
        endDate,
        targetAudience,
        position,
      } = data

      // Validate required fields
      if (!title || !type || !budget || !startDate || !endDate || !position) {
        return NextResponse.json(
          { error: 'Missing required fields: title, type, budget, startDate, endDate, position' },
          { status: 400 }
        )
      }

      // Get merchant ID
      let merchantId: string
      if (user.role === 'ADMIN') {
        // Admin can create ads for any merchant
        if (!data.merchantId) {
          return NextResponse.json(
            { error: 'merchantId required for admin' },
            { status: 400 }
          )
        }
        merchantId = data.merchantId
      } else {
        // Merchant can only create ads for themselves
        const merchant = await prisma.merchant.findUnique({
          where: { userId: user.userId },
        })
        if (!merchant) {
          return NextResponse.json(
            { error: 'Merchant profile not found' },
            { status: 404 }
          )
        }
        merchantId = merchant.id
      }

      // Validate dates
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (start >= end) {
        return NextResponse.json(
          { error: 'endDate must be after startDate' },
          { status: 400 }
        )
      }

      // Validate budget
      if (budget <= 0) {
        return NextResponse.json(
          { error: 'Budget must be greater than 0' },
          { status: 400 }
        )
      }

      // Create advertisement
      const advertisement = await prisma.advertisement.create({
        data: {
          merchantId,
          title,
          description: description || null,
          type: type.toUpperCase(),
          images: images || [],
          link: link || null,
          budget: parseFloat(budget),
          startDate: start,
          endDate: end,
          targetAudience: targetAudience || null,
          position: position.toUpperCase(),
          status: 'PENDING', // New ads need admin approval
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

      return NextResponse.json({
        message: 'Advertisement created successfully',
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
          impressions: advertisement.impressions,
          createdAt: advertisement.createdAt,
          updatedAt: advertisement.updatedAt,
        },
      }, { status: 201 })
    } catch (error: any) {
      console.error('Create advertisement error:', error)
      
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Advertisement already exists' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })(request)
}

