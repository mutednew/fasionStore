import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/response";
import { getUserFromToken } from "@/lib/auth";
import { ApiError } from "@/lib/ApiError";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError("Unauthorized", 401);
        }

        const token = authHeader.split(" ")[1];
        const user = getUserFromToken(token);

        if (!user) {
            throw new ApiError("Unauthorized", 401);
        }

        const userFromDb = await prisma.user.findUnique({
            where: { id: user.userId },
            select: { id: true, email: true, name: true, role: true, createdAt: true },
        });

        if (!userFromDb) {
            throw new ApiError("User not found", 404);
        }

        return ok({ user: userFromDb }, 200);
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("Me error:", err);
        return fail("Internal Server Error", 500);
    }
}