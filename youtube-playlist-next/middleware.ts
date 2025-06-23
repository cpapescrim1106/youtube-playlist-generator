import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = await auth()
  
  // Protect API routes that require authentication
  if (request.nextUrl.pathname.startsWith('/api/playlists') && request.method === 'POST') {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  
  // Protect stats page
  if (request.nextUrl.pathname.startsWith('/stats')) {
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/playlists/:path*',
    '/stats/:path*',
    // Skip auth for public API endpoints and auth routes
    '/((?!api/auth|api/videos/validate|api/telegram|_next/static|_next/image|favicon.ico).*)',
  ],
}