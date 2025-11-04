import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Example of role-based access control
    // Add your protected paths and required roles/conditions here
    type UserRole = "user" | "admin";

    type PathConfig = {
      requireAuth: boolean;
      role?: UserRole;
    };

    const protectedPaths: Record<string, PathConfig> = {
      "/profile": { requireAuth: true },
      "/admin": { requireAuth: true, role: "admin" },
      "/intel/submit": { requireAuth: true }, // Allow any authenticated user to submit intel
      // Add more protected paths and their requirements
    };

    const pathConfig = protectedPaths[path];
    if (!pathConfig) return NextResponse.next();

    // Check if path requires authentication
    if (pathConfig.requireAuth && !token) {
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }

    // Check for specific role requirements
    if (
      pathConfig.role &&
      (token?.role as string | undefined) !== pathConfig.role
    ) {
      return NextResponse.redirect(new URL("/access-denied", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

// Add paths that should be protected by the middleware
export const config = {
  matcher: ["/profile", "/admin", "/intel/submit"],
};
