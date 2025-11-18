import { NextResponse } from 'next/server'
import { mockServices } from '@/lib/mock/services'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  
  let services = mockServices
  
  if (category) {
    services = services.filter(s => s.category === category)
  }
  
  if (search) {
    services = services.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  return NextResponse.json({ services })
}

