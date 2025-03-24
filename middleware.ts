import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { get } from '@vercel/edge-config';

// This middleware handles both edge config and authentication
export async function middleware(request: NextRequest) {
  // Handle WebSocket upgrade requests
  if (request.nextUrl.pathname.startsWith('/api/scores/ws')) {
    const upgrade = request.headers.get('upgrade')
    if (upgrade?.toLowerCase() === 'websocket') {
      return NextResponse.next({
        headers: {
          'Upgrade': 'websocket',
          'Connection': 'Upgrade',
        }
      })
    }
  }

  // Handle edge config for /welcome route
  if (request.nextUrl.pathname === '/welcome') {
    const greeting = await get('greeting');
    return NextResponse.json(greeting);
  }

  // Get the origin for CORS
  const origin = request.headers.get('origin') || '*';
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  // Allow all API routes without authentication but with proper CORS headers
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Add CORS headers to all API responses
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    // Special handling for match-points and scores endpoints
    if (request.nextUrl.pathname.includes('/api/match-points') || 
        request.nextUrl.pathname.includes('/api/scores')) {
      console.log(`CORS headers set for ${request.nextUrl.pathname} with origin: ${origin}`);
    }
    
    return response;
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
    '/admin/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/api/:path*', 
    '/api/scores/ws/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}