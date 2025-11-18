import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const status = searchParams.get('status') || 'ACTIVE'
    
    // Build where clause
    const where: any = {
      status: status as any,
    }

    if (category) {
      where.category = {
        name: category,
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameZh: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Fetch services from database
    const services = await prisma.service.findMany({
      where,
      include: {
        category: true,
        merchant: {
          select: {
            id: true,
            businessName: true,
            businessNameEn: true,
            businessNameZh: true,
          },
        },
        packages: true,
        _count: {
          select: {
            reviews: true,
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Transform to match frontend format
    const formattedServices = services.map(service => ({
      id: service.id,
      name: service.name,
      nameEn: service.nameEn,
      nameZh: service.nameZh,
      description: service.description,
      descriptionEn: service.descriptionEn,
      descriptionZh: service.descriptionZh,
      category: service.category.name,
      price: service.price,
      images: service.images,
      location: service.location as any,
      rating: service.rating,
      reviewCount: service._count.reviews,
      merchantId: service.merchantId,
      status: service.status.toLowerCase(),
      packages: service.packages.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        nameEn: pkg.nameEn,
        nameZh: pkg.nameZh,
        price: pkg.price,
        duration: pkg.duration,
        description: pkg.description,
      })),
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }))

    return NextResponse.json({ services: formattedServices })
  } catch (error) {
    console.error('Get services error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

