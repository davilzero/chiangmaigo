import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        merchant: {
          select: {
            id: true,
            businessName: true,
            businessNameEn: true,
            businessNameZh: true,
            description: true,
            descriptionEn: true,
            descriptionZh: true,
            address: true,
            contact: true,
            images: true,
            operatingHours: true,
            certifications: true,
            awards: true,
            rating: true,
            reviewCount: true,
          },
        },
        packages: true,
        faqs: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            reviews: true,
            bookings: true,
          },
        },
      },
    })

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    // Transform to match frontend format
    const formattedService = {
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
      merchant: service.merchant,
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
      faqs: service.faqs.map(faq => ({
        id: faq.id,
        question: faq.question,
        questionEn: faq.questionEn,
        questionZh: faq.questionZh,
        answer: faq.answer,
        answerEn: faq.answerEn,
        answerZh: faq.answerZh,
        category: faq.category,
      })),
      reviews: service.reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        images: review.images,
        user: review.user,
        createdAt: review.createdAt,
      })),
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }

    return NextResponse.json({ service: formattedService })
  } catch (error) {
    console.error('Get service error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

