import { z, ZodError } from "zod";
import { cartService } from "@/services/cart.service";
import { requireAuth } from "@/middleware/auth";
import { ok, fail } from "@/lib/response";
import { ApiError } from "@/lib/ApiError";

const QuantitySchema = z.object({
    quantity: z.number().int().min(1),
});

export async function PUT(
    req: Request,
    { params }: { params: { userId: string; itemId: string } }
) {
    const auth = await requireAuth(req as any);
    if (auth) return auth;

    const user = (req as any).user;

    if (user.userId !== params.userId) {
        throw new ApiError("Forbidden", 403);
    }

    try {
        const body = await req.json();
        const { quantity } = QuantitySchema.parse(body);

        const updated = await cartService.updateItemQuantity(
            params.userId,
            params.itemId,
            quantity
        );

        return ok(updated);
    } catch (err) {
        if (err instanceof ZodError) {
            return fail("Invalid quantity", 400, err.issues);
        }

        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("PUT /api/cart/:userId/item/:itemId error:", err);
        return fail("Failed to update item", 500);
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { userId: string; itemId: string } }
) {
    const auth = await requireAuth(req as any);
    if (auth) return auth;

    const user = (req as any).user;

    if (user.userId !== params.userId) {
        throw new ApiError("Forbidden", 403);
    }

    try {
        const updated = await cartService.removeItem(params.userId, params.itemId);
        return ok(updated);
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("DELETE /api/cart/:userId/item/:itemId error:", err);
        return fail("Failed to remove item", 500);
    }
}