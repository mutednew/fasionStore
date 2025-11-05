import { requireAuth } from "@/middleware/auth";
import { cartService } from "@/services/cart.service";
import { orderService } from "@/services/order.service";
import { ApiError } from "@/lib/ApiError";
import { ok, fail}  from "@/lib/response";

export async function POST(req: Request) {
    try {
        const auth = await requireAuth(req);
        if (auth) return auth;

        const user = (req as any).user;
        const cart = await cartService.getByUser(user.userId);

        if (!cart?.items?.length) {
            return fail("Cart is empty", 400);
        }

        const order = await orderService.createFromCart(user.userId);
        await cartService.clear(user.userId);

        return ok({ order }, 201);
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status, err.details);
        console.error("Checkout error:", err);
        return fail("Internal server error", 500);
    }
}