import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const carts = await prisma.cart.findMany({
            include: {
                items: { include: { product: true } },
            },
        });

        return NextResponse.json(carts);
    } catch (err) {
        console.error("GET /api/cart error:", err);

        return NextResponse.json({ error: "Failed to fetch carts" }, { status: 500 });
    }
}