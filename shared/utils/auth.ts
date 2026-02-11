import { Env } from '@/shared/constants/environments'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import { Role } from '../enums/role'
import { generateErrorResponse } from '../helpers/api-response'

export type AuthPayload = JwtPayload & {
  sub: number
  name: string
  username: string
  email: string
  attrs: {
    role: string
  }
  perms: string[]
}

export function requireAuth(req: NextRequest): AuthPayload | NextResponse {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) {
    return NextResponse.json(generateErrorResponse('Unauthorized'), {
      status: 401,
    })
  }

  const [type, token] = authHeader.split(' ')
  if (type !== 'Bearer' || !token) {
    return NextResponse.json(generateErrorResponse('Unauthorized'), {
      status: 401,
    })
  }

  try {
    const decoded = jwt.verify(token, Env.JWT_SECRET) as AuthPayload
    return decoded
  } catch {
    return NextResponse.json(
      generateErrorResponse('Invalid or expired token'),
      { status: 401 },
    )
  }
}

export function isAuthFailed(
  res: AuthPayload | NextResponse,
): res is NextResponse {
  return res instanceof NextResponse
}

export function requireAdmin(req: NextRequest): AuthPayload | NextResponse {
  const auth = requireAuth(req)
  if (isAuthFailed(auth)) return auth
  if (auth.attrs?.role.toLowerCase() !== Role.ADMINISTRATOR) {
    return NextResponse.json(
      generateErrorResponse('Forbidden: administrator only'),
      { status: 403 },
    )
  }
  return auth
}
