
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/login' || path === '/signup';

  const token = request.cookies.get('auth-storage')?.value;
  let isAuthenticated = false;
  if (token) {
      try {
          const authState = JSON.parse(token);
          if (authState?.state?.isAuthenticated) {
              isAuthenticated = true;
          }
      } catch (e) {
        // ignore error
      }
  }

  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/login',
    '/signup',
    '/bids',
    '/passbook',
    '/wallet',
    '/predictions',
    '/charts',
    '/results',
    '/rules',
    '/rates',
    '/privacy-policy',
    '/terms-and-conditions',
    '/responsible-gambling',
    '/play/:path*',
  ],
}
