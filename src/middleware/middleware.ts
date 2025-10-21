import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/api/public") ||
        pathname === "/"
    ) {
        return NextResponse.next();
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    if (!payload || typeof payload === "string") {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.userId);
    response.headers.set("x-user-role", payload.role);

    return response;
}

export const config = {
    matcher: ["/api/:path*", "/dashboard/:path*", "/orders/:path*", "/admin/:path*"],
};