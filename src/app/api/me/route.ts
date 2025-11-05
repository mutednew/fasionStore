import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/response";
import {getUserFromRequest, getUserFromToken} from "@/lib/auth";
import { ApiError } from "@/lib/ApiError";

export async function GET(req: Request) {
    try {
        const user = getUserFromRequest(req);

        if (!user) {
            return fail("Unauthorized", 401);
        }

        const userFromDb = await prisma.user.findUnique({
            where: { id: user.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        if (!userFromDb) {
            throw new ApiError("User not found", 404);
        }

        return ok({ user: userFromDb });
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("Me error:", err);
        return fail("Internal Server Error", 500);
    }
}

export async function PUT(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        const token = authHeader?.split(" ")[1];
        const payload = getUserFromToken(token);

        if (!payload) return fail("Unauthorized", 401);

        const body = await req.json();

        const updated = await prisma.user.update({
            where: { id: payload.userId },
            data: { name: body.name },
            select: { id: true, name: true, email: true, role: true },
        });

        return ok({ user: updated });
    } catch (err) {
        return fail("Internal server error", 500);
    }
}