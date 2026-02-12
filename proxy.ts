import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import { Env } from './shared/constants/environments'
import { AuthPayload } from './shared/utils/auth'

export default function proxy(req: NextRequest) {
  if (req.nextUrl.pathname === '/') {
    return NextResponse.next()
  }

  const tokenCookie = req.cookies.get(Env.TOKEN_NAME)?.value
  if (!tokenCookie) {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  let verifiedToken: AuthPayload
  try {
    verifiedToken = jwt.verify(tokenCookie, Env.JWT_SECRET) as AuthPayload
  } catch {
    const res = NextResponse.redirect(
      new URL(
        '/login?state=revalidation&redirect=' + req.nextUrl.pathname,
        req.url,
      ),
    )
    res.cookies.delete(Env.TOKEN_NAME)
    return res
  }

  const accessibleRoutes = verifiedToken.perms ?? []
  const isAccessible = accessibleRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route),
  )
  if (!isAccessible) {
    return NextResponse.redirect(new URL('/forbidden', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|register|faq|support|shop|unauthorized|forbidden|not-found|callback).*)',
  ],
}
