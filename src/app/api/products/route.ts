import { productService } from "@/services/product.service";
import { ProductSchema } from "@/schemas/product.schema";
import { requireAuth } from "@/lib/requireAuth";
import { ok, fail } from "@/lib/response";
import { ApiError } from "@/lib/ApiError";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);

        const filter = {
            search: url.searchParams.get("search") ?? undefined,
            categoryId: url.searchParams.get("categoryId") ?? undefined,
            size: url.searchParams.get("size") ?? undefined,
            tag: url.searchParams.get("tag") ?? undefined,
            price: url.searchParams.get("price") ?? undefined,
            limit: url.searchParams.get("limit") ? Number(url.searchParams.get("limit")) : undefined,
            sort: url.searchParams.get("sort") ?? undefined,
        };

        const products = await productService.getAll(filter);

        return ok({ products });

    } catch (err) {
        console.error("Products fetch error:", err);
        return fail("Internal server error", 500);
    }
}

export async function POST(req: Request) {
    try {
        const auth = await requireAuth(req, "ADMIN");
        if (auth) return auth;

        const body = await req.json();

        const parsed = ProductSchema.safeParse(body);
        if (!parsed.success) {
            return fail("Invalid data", 400, parsed.error.format());
        }

        const product = await productService.create(parsed.data);

        return ok({ product });

    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("Product creation error:", err);
        return fail("Internal server error", 500);
    }
}