import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware ensures that the mock data is initialized for each request
export function middleware(request: NextRequest) {
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

  // Allow all API requests without authentication
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next()
    // Add headers to bypass Vercel's authentication
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }

  // For all other routes, just pass through the request
  return NextResponse.next()
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match all page routes
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 