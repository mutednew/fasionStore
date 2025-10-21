import { orderService } from "@/services/order.service";
import { CartSchema } from "@/schemas/cart.schema";
import { requireAuth } from "@/middleware/auth";
import { ok, fail } from "@/lib/response";
import { ZodError } from "zod";
import { ApiError } from "@/lib/ApiError";
import { User } from "@/middleware/auth";

export async function GET(req: Request) {
    try {
        const auth = await requireAuth(req as any);
        if (auth) return auth;

        const user = (req as any).user as User;

        const orders = user.role === "ADMIN"
            ? await orderService.getAll()
            : await orderService.getByUser(user.userId);

        return ok(orders);
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("GET /api/orders error:", err);
        return fail("Failed to fetch orders", 500);
    }
}

export async function POST(req: Request) {
    try {
        const auth = await requireAuth(req as any);
        if (auth) return auth;

        const user = (req as any).user as User;

        const body = await req.json();
        const parsed = CartSchema.parse(body);

        parsed.userId = user.userId;

        const createdOrder = await orderService.createFromCart(parsed);
        return ok(createdOrder, 201);
    } catch (err) {
        if (err instanceof ZodError) {
            return fail("Invalid cart data", 400, err.issues);
        }

        if (err instanceof Error && err.message.includes("Cart is empty")) {
            return fail(err.message, 400);
        }

        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("POST /api/orders error:", err);
        return fail("Failed to create order", 500);
    }
}