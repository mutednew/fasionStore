import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/response";

export async function GET() {
    try {
        const [total, pending, paid, shipped, delivered, canceled, revenueResult] = await Promise.all([
            prisma.order.count(),
            prisma.order.count({ where: { status: "PENDING" } }),
            prisma.order.count({ where: { status: "PAID" } }),
            prisma.order.count({ where: { status: "SHIPPED" } }),
            prisma.order.count({ where: { status: "DELIVERED" } }),
            prisma.order.count({ where: { status: "CANCELED" } }),
            prisma.order.aggregate({
                _sum: { total: true },
                where: { status: { not: "CANCELED" } }
            })
        ]);

        const revenue = Number(revenueResult._sum.total || 0);

        return ok({
            stats: {
                total,
                pending,
                paid,
                shipped,
                delivered,
                canceled,
                revenue
            }
        });
    } catch (err) {
        console.error("Failed to fetch order stats:", err);
        return fail("Internal server error", 500);
    }
}