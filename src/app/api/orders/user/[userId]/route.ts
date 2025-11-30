import {requireAuth} from "@/lib/requireAuth";
import {orderService} from "@/services/order.service";
import {ok, fail} from "@/lib/response";
import {ApiError} from "@/lib/ApiError";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        const auth = await requireAuth(req, "ADMIN");
        if (auth) return auth;

        const orders = await orderService.getByUser(userId);

        return ok({ orders });
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status, err.details);
        console.error("User orders fetch error:", err);
        return fail("Internal server error", 500);
    }
}