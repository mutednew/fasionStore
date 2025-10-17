import { NextResponse } from "next/server";
import { orderService } from "@/services/order.service";

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
    try {
        const orders = await orderService.getByUser(params.userId);

        return NextResponse.json(orders);
    } catch (err) {
        console.error("GET /api/orders/user/:userId error:", err);

        return NextResponse.json(
            { error: "Failed to fetch user's orders" },
            { status: 500 }
        );
    }
}