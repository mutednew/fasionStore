import { productService } from "@/services/product.service";
import { requireAuth } from "@/lib/requireAuth";
import { ok, fail } from "@/lib/response";
import { ApiError } from "@/lib/ApiError";

export async function POST(req: Request) {
    try {
        const auth = await requireAuth(req, "ADMIN");
        if (auth) return auth;

        const body = await req.json();
        const { ids, discountPercent } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return fail("No products selected", 400);
        }

        if (typeof discountPercent !== 'number' || discountPercent < 0 || discountPercent > 100) {
            return fail("Invalid discount percent", 400);
        }

        const result = await productService.bulkDiscount(ids, discountPercent);

        return ok({ message: `Updated ${result.count} products` });

    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status);
        console.error("Bulk action error:", err);
        return fail("Internal server error", 500);
    }
}