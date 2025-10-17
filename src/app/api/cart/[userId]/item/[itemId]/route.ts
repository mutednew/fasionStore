import { z, ZodError } from "zod";
import { cartService } from "@/services/cart.service";
import { NextResponse } from "next/server";

const QuantitySchema = z.object({
    quantity: z.number().int().min(1),
});

export async function PUT(
    req: Request,
    { params }: { params: { userId: string, itemId: string } }
) {
    try {
        const body = await req.json();
        const { quantity } = QuantitySchema.parse(body);

        const updated = await cartService.updateItemQuantity(
            params.userId,
            params.itemId,
            quantity,
        );

        return NextResponse.json(updated);
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json(
                { error: "Invalid quantity", details: err.issues },
                { status: 400 }
            );
        }

        console.error("PUT /api/cart/:userId/item/:itemId error:", err);

        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: { userId: string, itemId: string } }
) {
    try {
        const updated = await cartService.removeItem(params.userId, params.itemId);

        return NextResponse.json(updated);
    } catch (err) {
        console.error("DELETE /api/cart/:userId/item/:itemId error:", err);

        return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
    }
}