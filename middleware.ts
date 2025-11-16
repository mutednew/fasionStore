import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

const ADMIN_API = [
    "/api/products",
    "/api/categories",
    "/api/orders",
    "/api/upload"
];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get("token")?.value;

    if (pathname.startsWith("/admin")) {
        if (!token) return NextResponse.redirect(new URL("/login", req.url));

        try {
            const user = verifyToken(token);
            if (!user || user.role !== "ADMIN") return NextResponse.redirect(new URL("/", req.url));
        } catch {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    if (ADMIN_API.some((api) => pathname.startsWith(api))) {
        if (!token) {
            return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }

        try {
            const user = verifyToken(token);

            if (!user || user.role !== "ADMIN") {
                return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
                    status: 403,
                });
            }
        } catch {
            return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
            });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/:path*",
    ],
};