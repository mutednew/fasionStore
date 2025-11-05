import {requireAuth} from "@/middleware/auth";
import {z} from "zod";
import {cartService} from "@/services/cart.service";
import {ok, fail} from "@/lib/response";
import {ApiError} from "@/lib/ApiError";

/**
 * PATCH /api/cart/item/[itemId]
 * Изменяет количество конкретного товара в корзине
 */
export async function PATCH(
    req: Request,
    { params }: { params: { itemId: string } }
) {
    try {
        const auth = await requireAuth(req);
        if (auth) return auth;

        const user = (req as any).user;
        const body = await req.json();

        const QuantitySchema = z.object({ quantity: z.number().int().positive() });
        const parsed = QuantitySchema.safeParse(body);

        if (!parsed.success) return fail("Invalid data", 400, parsed.error.format());

        const cart = await cartService.updateItemQuantity(user.userId, params.itemId, parsed.data.quantity);
        return ok({ cart });
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status, err.details);
        console.error("Cart item update error:", err);
        return fail("Internal server error", 500);
    }
}

/**
 * DELETE /api/cart/item/[itemId]
 * Удаляет конкретный товар из корзины
 */
export async function DELETE(
    req: Request,
    { params }: { params: { itemId: string } }
) {
    try {
        const auth = await requireAuth(req);
        if (auth) return auth;

        const user = (req as any).user;
        const cart = await cartService.removeItem(user.userId, params.itemId);
        return ok({ cart });
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status, err.details);
        console.error("Cart item delete error:", err);
        return fail("Internal server error", 500);
    }
}