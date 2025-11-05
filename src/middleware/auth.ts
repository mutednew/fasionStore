import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { fail } from "@/lib/response";

export interface User {
    userId: string;
    role: "ADMIN" | "CUSTOMER";
}

export async function requireAuth(
    req: Request | NextRequest,
    role?: "ADMIN" | "CUSTOMER"
): Promise<NextResponse | null> {
    const cookies =
        "cookies" in req
            ? (req as NextRequest).cookies
            : undefined;

    const cookieToken = cookies?.get("token")?.value;

    const headers =
        (req as any).headers?.get
            ? (req as NextRequest).headers
            : new Headers((req as any).headers);

    const authHeader = headers.get("authorization");
    const bearerToken =
        authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : undefined;

    const token = cookieToken || bearerToken;

    if (!token) {
        return fail("Unauthorized", 401);
    }

    try {
        const payload = verifyToken(token);
        if (!payload) return fail("Invalid token payload", 401);

        if (role && payload.role !== role) {
            return fail("Forbidden", 403);
        }

        (req as any).user = { userId: payload.userId, role: payload.role } as User;
        return null;
    } catch (err) {
        return fail("Invalid or expired token", 401);
    }
}