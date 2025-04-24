import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token")?.value
  const { pathname } = request.nextUrl

  // Skip middleware redirect for the root path to let the page component handle it
  if (pathname === "/") {
    return NextResponse.next()
  }

  // Check if the user is accessing a protected route
  if (pathname.startsWith("/dashboard")) {
    // If no auth token exists, redirect to sign-in page
    if (!authToken) {
      return NextResponse.redirect(new URL("/signin", request.url))
    }
  }

  // If the user is already authenticated and trying to access auth pages
  if (authToken && (pathname.startsWith("/signin") || pathname.startsWith("/signup"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
