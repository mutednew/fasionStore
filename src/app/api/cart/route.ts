import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";
import { ok, fail } from "@/lib/response";
import { ApiError } from "@/lib/ApiError";

export async function GET(req: Request) {
    const auth = await requireAuth(req as any);
    if (auth) return auth;

    const user = (req as any).user;

    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: user.userId },
            include: {
                items: { include: { product: true } },
            },
        });

        if (!cart) {
            throw new ApiError("Cart not found", 404);
        }

        return ok(cart, 200);
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("GET /api/cart error:", err);
        return fail("Failed to fetch cart", 500);
    }
}