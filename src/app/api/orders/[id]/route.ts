import { orderService } from "@/services/order.service";
import { NextResponse } from "next/server";
import { OrderSchema } from "@/schemas/order.schema";
import { ZodError } from "zod";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const order = await orderService.getById(params.id);

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (err) {
        console.error("GET /api/orders/:id error:", err);

        return NextResponse.json(
            { error: "Failed to fetch order" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const parsed = OrderSchema.pick({ status: true }).parse(body);
        const updated = await orderService.updateStatus(params.id, parsed.status);

        return NextResponse.json(updated);
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json(
                { error: "Invalid status", details: err.issues },
                { status: 400 }
            );
        }

        console.error("PUT /api/orders/:id error:", err);
        return NextResponse.json(
            { error: "Failed to update order" },
            { status: 500 }
        );
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await orderService.delete(params.id);

        return NextResponse.json({ message: "Order deleted" });
    } catch (err) {
        console.error("DELETE /api/orders/:id error:", err);

        return NextResponse.json(
            { error: "Failed to delete order" },
            { status: 500 }
        );
    }
}