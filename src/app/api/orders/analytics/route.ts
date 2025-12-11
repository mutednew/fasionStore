import { orderService } from "@/services/order.service";
import { ok, fail } from "@/lib/response";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const range = url.searchParams.get("range") || "month";

        if (!['week', 'month', 'year'].includes(range)) {
            return fail("Invalid range", 400);
        }

        const sales = await orderService.getAnalytics(range as 'week' | 'month' | 'year');

        return ok({ sales });

    } catch (err) {
        console.error("Analytics error:", err);
        return fail("Internal server error", 500);
    }
}