import { cartService } from "@/services/cart.service";
import { ok, fail } from "@/lib/response";
import { ApiError } from "@/lib/ApiError";

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
    try {
        const count = await cartService.getItemCount(params.userId);

        return ok({ count });
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("GET /api/cart/:userId/count error:", err);

        return fail("Failed to get cart item count", 500);
    }
}