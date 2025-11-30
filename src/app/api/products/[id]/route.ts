import { productService } from "@/services/product.service";
import { ProductSchema } from "@/schemas/product.schema";
import { requireAuth } from "@/lib/requireAuth";
import { ok, fail } from "@/lib/response";
import { ApiError } from "@/lib/ApiError";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await productService.getById(id);

        console.log(product);
        return ok({ product });
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status);
        }
        console.error("Product fetch error:", err);
        return fail("Internal server error", 500);
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const auth = await requireAuth(req, "ADMIN");
        if (auth) return auth;

        const body = await req.json();

        const parsed = ProductSchema.partial().safeParse(body);

        if (!parsed.success) {
            return fail("Invalid data", 400, parsed.error.format());
        }

        const updated = await productService.update(id, parsed.data);
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const auth = await requireAuth(req, "ADMIN");
        if (auth) return auth;

        await productService.delete(id);

        return ok({ message: "Product deleted successfully" });

    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("Product deletion error:", err);
        return fail("Internal server error", 500);
    }
}