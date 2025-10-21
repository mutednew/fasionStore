import { orderService } from "@/services/order.service";
import { requireAuth } from "@/middleware/auth";
import { ok, fail } from "@/lib/response";
import { ApiError } from "@/lib/ApiError";

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
    const auth = await requireAuth(_req as any);
    if (auth) return auth;

    const user = (_req as any).user;

    try {
        if (user.userId !== params.userId) {
            throw new ApiError("Forbidden", 403);
        }

        const orders = await orderService.getByUser(params.userId);
        return ok(orders);
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("GET /api/orders/user/:userId error:", err);
        return fail("Failed to fetch user's orders", 500);
    }
}
