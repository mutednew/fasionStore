import { orderService } from "@/services/order.service";
import { OrderSchema } from "@/schemas/order.schema";
import { requireAuth } from "@/lib/requireAuth";
import { ok, fail } from "@/lib/response";
import {z, ZodError} from "zod";
import { ApiError } from "@/lib/ApiError";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await requireAuth(req);
        if (auth) return auth;

        const user = (req as any).user;
        const order = await orderService.getById(params.id);

        if (!order) return fail("Order not found", 404);
        if (user.role !== "ADMIN" && order.userId !== user.userId)
            return fail("Forbidden", 403);

        return ok({ order });
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status, err.details);
        console.error("Order fetch error:", err);
        return fail("Internal server error", 500);
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await requireAuth(req);
        if (auth) return auth;

        const user = (req as any).user;
        const body = await req.json();

        const UpdateSchema = z.object({
            status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED"]),
        });

        const parsed = UpdateSchema.safeParse(body);
        if (!parsed.success) {
            return fail("Invalid data", 400, parsed.error.format());
        }

        const order = await orderService.getById(params.id);
        if (!order) return fail("Order not found", 404);

        if (user.role !== "ADMIN") {
            if (order.userId !== user.userId) return fail("Forbidden", 403);
            if (parsed.data.status !== "CANCELED")
                return fail("You can only cancel your own order", 403);
        }

        const updated = await orderService.updateStatus(params.id, parsed.data.status);

        return ok({ order: updated });
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status, err.details);
        console.error("Order update error:", err);
        return fail("Internal server error", 500);
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await requireAuth(req, "ADMIN");
        if (auth) return auth;

        await orderService.delete(params.id);
        return ok({ message: "Order deleted successfully" });
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status, err.details);
        console.error("Order deletion error:", err);
        return fail("Internal server error", 500);
    }
}