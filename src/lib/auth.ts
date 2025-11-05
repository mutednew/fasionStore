import { verifyToken, UserTokenPayload } from "@/lib/jwt";
import { ApiError } from "@/lib/ApiError";
import type { NextRequest } from "next/server";

export function getUserFromToken(token?: string | null): UserTokenPayload | null {
    if (!token) return null;

    try {
        const payload = verifyToken(token);
        if (!payload) {
            throw new ApiError("Invalid or expired token", 401);
        }
        return { userId: payload.userId, role: payload.role };
    } catch (err) {
        if (err instanceof ApiError) {
            throw err;
        }
        throw new ApiError("Failed to process token", 500);
    }
}

export function getUserFromRequest(req: Request | NextRequest): UserTokenPayload | null {
    try {
        const cookieToken =
            "cookies" in req ? (req as NextRequest).cookies.get("token")?.value : undefined;

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
        if (!token) return null;

        return getUserFromToken(token);
    } catch (err) {
        console.error("getUserFromRequest error:", err);
        return null;
    }
}