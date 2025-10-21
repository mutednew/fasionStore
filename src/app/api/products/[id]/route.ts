import { productService } from "@/services/product.service";
import { ProductSchema } from "@/schemas/product.schema";
import { requireAuth } from "@/middleware/auth";
import { ok, fail } from "@/lib/response";
import { ZodError } from "zod";
import { ApiError } from "@/lib/ApiError";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const product = await productService.getById(params.id);

        if (!product) {
            throw new ApiError("Product not found", 404);
        }

        return ok(product);
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("GET /api/products/:id error:", err);
        return fail("Failed to fetch product", 500);
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const auth = await requireAuth(req as any, "ADMIN");
    if (auth) return auth;

    const user = (req as any).user;

    try {
        const body = await req.json();
        const parsed = ProductSchema.partial()
            .omit({ id: true, createdAt: true, updatedAt: true })
            .parse(body);

        const updated = await productService.update(params.id, parsed);
        return ok(updated);
    } catch (err) {
        if (err instanceof ZodError) {
            return fail("Invalid data", 400, err.issues);
        }

        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("PUT /api/products/:id error:", err);
        return fail("Failed to update product", 500);
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const auth = await requireAuth(_req as any, "ADMIN");
    if (auth) return auth;

    const user = (_req as any).user;

    try {
        await productService.delete(params.id);
        return ok({ message: "Product deleted" });
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("DELETE /api/products/:id error:", err);
        return fail("Failed to delete product", 500);
    }
}