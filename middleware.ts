import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { get } from '@vercel/edge-config';

// Helper function to add CORS headers to the response
function addCorsHeaders(response: NextResponse, request: NextRequest): NextResponse {
  // Get the origin from the request headers or use a wildcard as fallback
  const origin = request.headers.get('origin') || '*';
  
  // Log the origin for debugging
  console.log(`Setting CORS headers with origin: ${origin}`);
  
  // Add CORS headers to the response
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  return response;
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Log the request for debugging
  console.log(`Middleware handling request: ${request.method} ${pathname}`);

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

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    const response = new NextResponse(null, { status: 204 });
    return addCorsHeaders(response, request);
  }

  // Handle API routes that need CORS headers
  const isApiRoute = pathname.startsWith('/api/');
  const isMatchPointsRoute = pathname.includes('/api/match-points');
  const isScoresRoute = pathname.includes('/api/scores');
  const isMatchesRoute = pathname.startsWith('/matches/');
  
  if (isApiRoute || isMatchesRoute) {
    // For API routes, add CORS headers to the response
    if (isMatchPointsRoute || isScoresRoute) {
      console.log(`Special handling for route: ${pathname}`);
    }
    
    const response = NextResponse.next();
    return addCorsHeaders(response, request);
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

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match all admin routes
    '/admin/:path*',
    // Match all profile routes
    '/profile/:path*',
    // Match all settings routes
    '/settings/:path*',
    // Match all match detail pages
    '/matches/:path*',
    // Match welcome route
    '/welcome',
    // Match WebSocket connections
    '/api/scores/ws/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}