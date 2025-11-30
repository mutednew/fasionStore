import { NextRequest, NextResponse } from "next/server";
import { verifyToken, UserTokenPayload } from "@/lib/jwt";
import { fail } from "@/lib/response";

export interface AuthenticatedRequest extends Request {
    user: UserTokenPayload;
}

export async function requireAuth(
    req: Request | NextRequest,
    role?: "ADMIN" | "CUSTOMER"
): Promise<NextResponse | null> {

    let cookieToken: string | undefined;
    if ("cookies" in req) {
        cookieToken = (req as NextRequest).cookies.get("token")?.value;
    }

    const authHeader = req.headers.get("authorization");

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

        Object.assign(req, { user: payload });

        return null;
    } catch (err) {
        return fail("Invalid or expired token", 401);
    }
}