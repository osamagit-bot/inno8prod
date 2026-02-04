import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin route protection
  if (pathname.startsWith('/admin') && pathname !== '/login') {
    const token = request.cookies.get('access_token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Skip maintenance check for admin routes, login, and maintenance page
  if (pathname.startsWith('/admin') || pathname === '/maintenance' || pathname === '/login') {
    return NextResponse.next()
  }

  // Check maintenance mode
  try {
    const response = await fetch('http://127.0.0.1:8000/api/maintenance-status/')
    const data = await response.json()

    if (data.maintenance_mode) {
      return NextResponse.redirect(new URL('/maintenance/', request.url))
    }
  } catch (error) {
    // If API is down, continue normally
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/((?!api).*)',
    '/((?!api|_next/static|_next/image|favicon.ico|maintenance|login).*)',
  ],
}

