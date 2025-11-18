import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest } from './jwt'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string
    email: string
    role: string
  }
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ user: any; error: null } | { user: null; error: NextResponse }> {
  const token = getTokenFromRequest(request)

  if (!token) {
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
    }
  }

  const payload = verifyToken(token)
  if (!payload) {
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      ),
    }
  }

  return { user: payload, error: null }
}

export function requireAuth(handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const authResult = await authenticateRequest(req)
    if (authResult.error) {
      return authResult.error
    }
    return handler(req, authResult.user)
  }
}

export function requireRole(allowedRoles: string[]) {
  return (handler: (req: NextRequest, user: any) => Promise<NextResponse>) => {
    return async (req: NextRequest) => {
      const authResult = await authenticateRequest(req)
      if (authResult.error) {
        return authResult.error
      }

      const userRole = authResult.user.role.toUpperCase()
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      return handler(req, authResult.user)
    }
  }
}

