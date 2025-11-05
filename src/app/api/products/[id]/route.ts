import { productService } from "@/services/product.service";
import { ProductSchema } from "@/schemas/product.schema";
import { requireAuth } from "@/middleware/auth";
import { ok, fail } from "@/lib/response";
import { ZodError } from "zod";
import { ApiError } from "@/lib/ApiError";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const product = await productService.getById(params.id);

        if (!product) {
            return fail("Product not found", 404);
        }

        return ok({ product });
    } catch (err) {
        console.error("Product fetch error:", err);
        return fail("Internal server error", 500);
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await requireAuth(req, "ADMIN");
        if (auth) return auth;

        const body = await req.json();
        const parsed = ProductSchema.safeParse(body);

        if (!parsed.success) {
            return fail("Invalid data", 400, parsed.error.format());
        }

        const updated = await productService.update(params.id, parsed.data);

        if (!updated) {
            return fail("Product not found", 404);
        }

        return ok({ product: updated });
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("Product update error:", err);
        return fail("Internal server error", 500);
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const auth = await requireAuth(req, "ADMIN");
        if (auth) return auth;

        const deleted = await productService.delete(params.id);

        return ok({ message: "Product deleted successfully" });
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("Product deletion error:", err);
        return fail("Internal server error", 500);
    }
}