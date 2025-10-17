import { cartService } from "@/services/cart.service";
import { NextResponse } from "next/server";
import { CartItemSchema } from "@/schemas/cart.schema";
import { ZodError } from "zod";

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
    try {
        const cart = await cartService.getByUser(params.userId);

        return NextResponse.json(cart);
    } catch (err) {
        console.error("GET /api/cart/:userId error:", err);

        return NextResponse.json({ error: "Failed to load cart" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { userId: string } }) {
    try {
        const body = await req.json();
        const parsed = CartItemSchema.parse(body);
        const updatedCart = await cartService.addItem(params.userId, parsed);

        return NextResponse.json(updatedCart, { status: 201 });
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json(
                { error: "Invalid cart item", details: err.issues },
                { status: 400 }
            );
        }

        console.error("POST /api/cart/:userId error:", err);

        return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { userId: string } }) {
    try {
        await cartService.clear(params.userId);

        return NextResponse.json({ message: "Cart cleared" });
    } catch (err) {
        console.error("DELETE /api/cart/:userId error:", err);

        return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
    }
}