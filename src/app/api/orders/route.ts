import { orderService } from "@/services/order.service";
import { requireAuth } from "@/middleware/auth";
import { ok, fail } from "@/lib/response";
import { ApiError } from "@/lib/ApiError";
import { OrderSchema } from "@/schemas/order.schema";

export async function GET(req: Request) {
    try {
        const auth = await requireAuth(req);
        if (auth) return auth;

        const user = (req as any).user;

        const orders =
            user.role === "ADMIN"
                ? await orderService.getAll()
                : await orderService.getByUser(user.userId);

        return ok({ orders });
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status, err.details);
        console.error("Orders fetch error:", err);
        return fail("Internal server error", 500);
    }
}

export async function POST(req: Request) {
    try {
        const auth = await requireAuth(req);
        if (auth) return auth;

        const user = (req as any).user;
        const body = await req.json();

        const parsed = OrderSchema.safeParse(body);
        if (!parsed.success) {
            return fail("Invalid order data", 400, parsed.error.format());
        }

        const order = await orderService.createFromCart(user.userId);
        return ok({ order }, 201);
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status, err.details);
        console.error("Order creation error:", err);
        return fail("Internal server error", 500);
    }
}