import { cartService } from "@/services/cart.service";
import { CartItemSchema } from "@/schemas/cart.schema";
import { requireAuth } from "@/middleware/auth";
import { ok, fail } from "@/lib/response";
import { ZodError } from "zod";
import {ApiError} from "@/lib/ApiError";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
    const auth = await requireAuth(req as any);
    if (auth) return auth;

    const user = (req as any).user;

    try {
        if (user.userId !== params.userId) {
            return new ApiError("Forbidden", 403);
        }

        const cart = await cartService.getByUser(params.userId);
        return ok(cart, 200);
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("GET /api/cart/:userId error:", err);

        return fail("Failed to load cart", 500);
    }
}

export async function POST(req: Request, { params }: { params: { userId: string } }) {
    const auth = await requireAuth(req as any);
    if (auth) return auth;

    const user = (req as any).user;

    try {
        if (user.userId !== params.userId) {
            return new ApiError("Forbidden", 403);
        }

        const body = await req.json();
        const parsed = CartItemSchema.parse(body);
        const updatedCart = await cartService.addItem(params.userId, parsed);

        return ok(updatedCart, 201);
    } catch (err) {
        if (err instanceof ZodError) {
            return fail("Invalid cart item", 400, err.issues);
        }

        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("POST /api/cart/:userId error:", err);

        return fail("Failed to add item", 500);
    }
}

export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
    const auth = await requireAuth(req as any);
    if (auth) return auth;

    const user = (req as any).user;

    try {
        if (user.userId !== params.userId) {
            return new ApiError("Forbidden", 403);
        }

        await cartService.clear(params.userId);

        return ok({ message: "Cart cleared" }, 200);
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("DELETE /api/cart/:userId error:", err);

        return fail("Failed to clear cart", 500);
    }
}