import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authjs.session-token') || 
                request.cookies.get('__Secure-authjs.session-token')
  
  const isAuth = !!token
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/registro')
  const isPublic = request.nextUrl.pathname === '/'

  if (isPublic) return NextResponse.next()
  if (isAuthPage && isAuth) return NextResponse.redirect(new URL('/dashboard', request.url))
  if (!isAuthPage && !isAuth) return NextResponse.redirect(new URL('/login', request.url))
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}