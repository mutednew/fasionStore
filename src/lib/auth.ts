import { verifyToken, UserTokenPayload } from "@/lib/jwt";
import { ApiError } from "@/lib/ApiError";

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