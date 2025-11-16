import { cartService } from "@/services/cart.service";
import { ok, fail } from "@/lib/response";
import { ApiError } from "@/lib/ApiError";
import { requireAuth } from "@/lib/requireAuth";

export async function GET(req: Request) {
    try {
        const auth = await requireAuth(req);
        if (auth) return auth;

        const user = (req as any).user;
        const count = await cartService.getItemCount(user.userId);

        return ok({ count });
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status, err.details);
        console.error("Cart count error:", err);
        return fail("Internal server error", 500);
    }
}