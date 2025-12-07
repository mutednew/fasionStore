import { orderService } from "@/services/order.service";
import { requireAuth, AuthenticatedRequest } from "@/lib/requireAuth";
import { ok, fail } from "@/lib/response";
import { z } from "zod";
import { ApiError } from "@/lib/ApiError";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const auth = await requireAuth(req);
        if (auth instanceof NextResponse) return auth;

        const user = (req as unknown as AuthenticatedRequest).user;
        const order = await orderService.getById(id);

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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const auth = await requireAuth(req);
        if (auth instanceof NextResponse) return auth;

        const user = (req as unknown as AuthenticatedRequest).user;
        const body = await req.json();

        const UpdateSchema = z.object({
            status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED"]),
        });

        const parsed = UpdateSchema.safeParse(body);
        if (!parsed.success) {
            return fail("Invalid data", 400, parsed.error.format());
        }

        const order = await orderService.getById(id);
        if (!order) return fail("Order not found", 404);

        if (user.role !== "ADMIN") {
            if (order.userId !== user.userId) return fail("Forbidden", 403);
            if (parsed.data.status !== "CANCELED")
                return fail("You can only cancel your own order", 403);
        }

        const updated = await orderService.updateStatus(id, parsed.data.status);

        return ok({ order: updated });
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status, err.details);
        console.error("Order update error:", err);
        return fail("Internal server error", 500);
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const auth = await requireAuth(req, "ADMIN");
        if (auth instanceof NextResponse) return auth;

        await orderService.delete(id);
        return ok({ message: "Order deleted successfully" });
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status, err.details);
        console.error("Order deletion error:", err);
        return fail("Internal server error", 500);
    }
}