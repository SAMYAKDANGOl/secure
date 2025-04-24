import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This is a simplified middleware for route protection
// In a real application, you would verify JWT tokens or session cookies

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token")?.value

  // Check if the user is accessing a protected route
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // If no auth token exists, redirect to sign-in page
    if (!authToken) {
      return NextResponse.redirect(new URL("/signin", request.url))
    }
  }

  // If the user is already authenticated and trying to access auth pages
  if (authToken && (request.nextUrl.pathname.startsWith("/signin") || request.nextUrl.pathname.startsWith("/signup"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
}
