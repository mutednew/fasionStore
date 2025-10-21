import { orderService } from "@/services/order.service";
import { OrderSchema } from "@/schemas/order.schema";
import { requireAuth } from "@/middleware/auth";
import { ok, fail } from "@/lib/response";
import { ZodError } from "zod";
import { ApiError } from "@/lib/ApiError";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const auth = await requireAuth(req as any);
    if (auth) return auth;

    const user = (req as any).user;

    try {
        const order = await orderService.getById(params.id);

        if (!order) {
            throw new ApiError("Order not found", 404);
        }

        if (user.role !== "ADMIN" && user.userId !== order.userId) {
            throw new ApiError("Forbidden", 403);
        }

        return ok(order);
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("GET /api/orders/:id error:", err);
        return fail("Failed to fetch order", 500);
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const auth = await requireAuth(req as any);
    if (auth) return auth;

    const user = (req as any).user;

    try {
        const body = await req.json();
        const parsed = OrderSchema.pick({ status: true }).parse(body);

        const order = await orderService.getById(params.id);

        if (!order || (user.role !== "ADMIN" && user.userId !== order.userId)) {
            throw new ApiError("Forbidden", 403);
        }

        const updated = await orderService.updateStatus(params.id, parsed.status);
        return ok(updated);
    } catch (err) {
        if (err instanceof ZodError) {
            return fail("Invalid status", 400, err.issues);
        }

        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("PUT /api/orders/:id error:", err);
        return fail("Failed to update order", 500);
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const auth = await requireAuth(req as any);
    if (auth) return auth;

    const user = (req as any).user;

    try {
        const order = await orderService.getById(params.id);

        if (!order || (user.role !== "ADMIN" && user.userId !== order.userId)) {
            throw new ApiError("Forbidden", 403);
        }

        await orderService.delete(params.id);
        return ok({ message: "Order deleted" });
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("DELETE /api/orders/:id error:", err);
        return fail("Failed to delete order", 500);
    }
}