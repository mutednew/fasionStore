import { productService } from "@/services/product.service";
import { ProductSchema } from "@/schemas/product.schema";
import { requireAuth } from "@/lib/requireAuth";
import { ok, fail } from "@/lib/response";
import { ZodError } from "zod";
import { ApiError } from "@/lib/ApiError";

export async function GET() {
    try {
        const products = await productService.getAll();
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
        return ok({ product }, 201);
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("Product creation error:", err);
        return fail("Internal server error", 500);
    }
}