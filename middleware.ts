import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { get } from '@vercel/edge-config';

// This middleware handles both edge config and authentication
export async function middleware(request: NextRequest) {
  // Handle edge config for /welcome route
  if (request.nextUrl.pathname === '/welcome') {
    const greeting = await get('greeting');
    return NextResponse.json(greeting);
  }

  // Allow all API routes without authentication
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  // Skip authentication in development mode
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  // List of protected routes that require authentication
  const protectedRoutes = [
    '/admin',
    '/profile',
    '/settings'
  ]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // If it's not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // For protected routes, check authentication
  const token = request.cookies.get('__Secure-next-auth.session-token')
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  return NextResponse.next()
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    '/welcome',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 