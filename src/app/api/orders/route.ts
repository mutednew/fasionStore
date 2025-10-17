import { NextResponse } from "next/server";
import { orderService } from "@/services/order.service";
import { ZodError } from "zod";
import { CartSchema } from "@/schemas/cart.schema";

export async function GET() {
    try {
        const orders = await orderService.getAll();

        return NextResponse.json(orders);
    } catch (err) {
        console.error("GET /api/orders error:", err);

        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = CartSchema.parse(body);
        const createdOrder = await orderService.createFromCart(parsed);

        return NextResponse.json(createdOrder, { status: 201 });
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json(
                { error: "Invalid cart data", details: err.issues },
                { status: 400 }
            );
        }

        if (err instanceof Error && err.message.includes("Cart is empty")) {
            return NextResponse.json({ error: err.message }, { status: 400 });
        }

        console.error("POST /api/orders error:", err);

        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}