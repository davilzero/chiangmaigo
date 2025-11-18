import { NextResponse } from 'next/server'
import { mockServices } from '@/lib/mock/services'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const service = mockServices.find(s => s.id === params.id)
  if (!service) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ service })
}

