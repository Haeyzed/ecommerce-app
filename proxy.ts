import { NextResponse } from 'next/server'
import { auth } from '@/auth'

const publicAuthRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/lock',
]

export const proxy = auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth')
  const isPublicAuthRoute = publicAuthRoutes.includes(nextUrl.pathname)
  const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard')

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  if (isPublicAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
    return NextResponse.next()
  }

  if (isDashboardRoute) {
    if (!isLoggedIn) {
      let callbackUrl = nextUrl.pathname
      if (nextUrl.search) {
        callbackUrl += nextUrl.search
      }
      const encodedCallbackUrl = encodeURIComponent(callbackUrl)
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
      )
    }
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
