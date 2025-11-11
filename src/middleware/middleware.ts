import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { fail } from "@/lib/response";
import { ApiError } from "@/lib/ApiError";


export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/api/public") ||
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/"
    ) {
        return NextResponse.next();
    }

    const cookieToken = req.cookies.get("token")?.value;
    const authHeader = req.headers.get("authorization");
    const bearerToken =
        authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : undefined;

    const token = cookieToken || bearerToken;

    if (!token) {
        if (!pathname.startsWith("/api")) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        return fail("Unauthorized", 401);
    }

    try {
        const payload = verifyToken(token);

        if (!payload) throw new ApiError("Invalid token payload", 401);

        const response = NextResponse.next();
        response.headers.set("x-user-id", payload.userId);
        response.headers.set("x-user-role", payload.role);

        if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
            console.warn(`Access denied for non-admin user: ${payload.userId}`);
            if (pathname.startsWith("/api")) {
                return fail("Forbidden: Admins only", 403);
            }
            return NextResponse.redirect(new URL("/", req.url));
        }

        return response;
    } catch (err) {
        if (err instanceof ApiError) {
            if (!pathname.startsWith("/api")) {
                return NextResponse.redirect(new URL("/login", req.url));
            }
            return fail(err.message, err.status, err.details);
        }

        console.error("Middleware error:", err);
        if (!pathname.startsWith("/api")) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        return fail("Invalid or expired token", 401);
    }
}

export const config = {
    matcher: [
        "/api/:path*",
        "/dashboard/:path*",
        "/orders/:path*",
        "/admin/:path*",
        "/profile/:path*",
        "/cart/:path*",
    ],
};