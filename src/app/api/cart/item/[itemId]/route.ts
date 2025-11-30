import { requireAuth } from "@/lib/requireAuth";
import { cartService } from "@/services/cart.service";
import { ok, fail } from "@/lib/response";
import { ApiError } from "@/lib/ApiError";
import { NextResponse } from "next/server";

interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        role?: string;
        email?: string;
    }
}

export async function GET(req: Request) {
    try {
        const auth = await requireAuth(req);
        if (auth instanceof NextResponse) return auth;

        const userId = (req as AuthenticatedRequest).user.userId;

        const cart = await cartService.getByUser(userId);
        return ok(cart);
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status);
        console.error("Get cart error:", err);
        return fail("Internal server error", 500);
    }
}

export async function POST(req: Request) {
    try {
        const auth = await requireAuth(req);
        if (auth instanceof NextResponse) return auth;

        const userId = (req as AuthenticatedRequest).user.userId;
        const body = await req.json();

        const updatedCart = await cartService.addItem(userId, body);

        return ok(updatedCart);
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status);
        console.error("Add to cart error:", err);
        return fail("Internal server error", 500);
    }
}