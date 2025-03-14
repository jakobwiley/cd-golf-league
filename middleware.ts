import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware ensures that the mock data is initialized for each request
export function middleware(request: NextRequest) {
  // Just pass through the request, the import of prisma.ts in API routes
  // will trigger the initialization of mock data
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