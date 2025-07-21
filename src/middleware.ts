import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // If the user is trying to access an admin route
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      // Check if the user has the ADMIN role
      if (!token || token.role !== "ADMIN") {
        // Respond with an error for API routes
        if (pathname.startsWith("/api/admin")) {
          return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
          );
        }
        // Redirect to a "not found" or "unauthorized" page for UI routes
        return NextResponse.rewrite(new URL("/404", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (for login, register, etc.)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the home page, assuming it's public)
     * - /products (public product listing)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|products|login|register|$).*)",
    "/admin/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/api/checkout/:path*",
    "/api/orders/:path*",
    "/api/users/me",
  ],
};
