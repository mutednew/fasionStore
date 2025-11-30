import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, AuthenticatedRequest } from "@/lib/requireAuth";
import { cartService } from "@/services/cart.service";
import { ok, fail } from "@/lib/response";
import { ApiError } from "@/lib/ApiError";

const UpdateQuantitySchema = z.object({
    quantity: z.number().int().positive(),
});

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const auth = await requireAuth(req);
        if (auth instanceof NextResponse) return auth;

        const user = (req as unknown as AuthenticatedRequest).user;
        const { itemId } = await params;

        const body = await req.json();
        const parsed = UpdateQuantitySchema.safeParse(body);

        if (!parsed.success) {
            return fail("Invalid quantity", 400);
        }

        const updatedCart = await cartService.updateItemQuantity(
            user.userId,
            itemId,
            parsed.data.quantity
        );

        return ok(updatedCart);
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status);
        console.error("Update cart item error:", err);
        return fail("Internal server error", 500);
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const auth = await requireAuth(req);
        if (auth instanceof NextResponse) return auth;

        const user = (req as unknown as AuthenticatedRequest).user;
        const { itemId } = await params;

        const updatedCart = await cartService.removeItem(user.userId, itemId);

        return ok(updatedCart);
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status);
        console.error("Delete cart item error:", err);
        return fail("Internal server error", 500);
    }
}