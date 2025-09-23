import {verifyToken} from "@/lib/jwt";

export function getUserFromToken(token?: string | null) {
    if (!token) return null;

    const payload = verifyToken(token);

    if (!payload || typeof payload === "string") return null;

    return { userId: (payload as any).userId, role: (payload as any).role };
}