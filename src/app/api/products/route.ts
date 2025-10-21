import { productService } from "@/services/product.service";
import { ProductSchema } from "@/schemas/product.schema";
import { requireAuth } from "@/middleware/auth";
import { ok, fail } from "@/lib/response";
import { ZodError } from "zod";
import { ApiError } from "@/lib/ApiError";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;

        const products = await productService.getAll(categoryId);
        return ok(products);
    } catch (err) {
        console.error("GET /api/products error:", err);
        return fail("Failed to fetch products", 500);
    }
}

export async function POST(req: Request) {
    const auth = await requireAuth(req as any, "ADMIN");
    if (auth) return auth;

    const user = (req as any).user;

    try {
        const body = await req.json();
        const parsed = ProductSchema.omit({
            id: true,
            createdAt: true,
            updatedAt: true,
        }).parse(body);

        const newProduct = await productService.create(parsed);
        return ok(newProduct, 201);
    } catch (err) {
        if (err instanceof ZodError) {
            return fail("Invalid data", 400, err.issues);
        }

        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("POST /api/products error:", err);
        return fail("Failed to create product", 500);
    }
}