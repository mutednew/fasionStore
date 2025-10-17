import { cartService } from "@/services/cart.service";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
    try {
        const count = await cartService.getItemCount(params.userId);

        return NextResponse.json({ count });
    } catch (err) {
        console.error("GET /api/cart/:userId/count error:", err);

        return NextResponse.json(
            { error: "Failed to get cart item count" },
            { status: 500 }
        );
    }
}