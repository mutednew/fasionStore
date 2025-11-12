import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/response";

export async function GET() {
    try {
        const [total, pending, delivered, canceled] = await Promise.all([
            prisma.order.count(),
            prisma.order.count({ where: { status: "PENDING" } }),
            prisma.order.count({ where: { status: "DELIVERED" } }),
            prisma.order.count({ where: { status: "CANCELED" } }),
        ]);

        return ok({ stats: { total, pending, delivered, canceled } });
    } catch (err) {
        console.error("Failed to fetch order stats:", err);
        return fail("Internal server error", 500);
    }
}