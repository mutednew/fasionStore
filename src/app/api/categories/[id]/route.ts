import { categoryService } from "@/services/category.service";
import { CategorySchema } from "@/schemas/category.schema";
import { requireAuth } from "@/middleware/auth";
import { ok, fail } from "@/lib/response";
import { ApiError } from "@/lib/ApiError";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const category = await categoryService.getById(params.id);

        if (!category) {
            return fail("Category not found", 404);
        }

        return ok({ category });
    } catch (err) {
        console.error("Category fetch error:", err);
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
        const parsed = CategorySchema.safeParse(body);

        if (!parsed.success) {
            return fail("Invalid data", 400, parsed.error.format());
        }

        const updated = await categoryService.update(params.id, parsed.data);

        if (!updated) {
            return fail("Category not found", 404);
        }

        return ok({ category: updated });
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("Category update error:", err);
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

        await categoryService.delete(params.id);
        return ok({ message: "Category deleted successfully" });
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("Category deletion error:", err);
        return fail("Internal server error", 500);
    }
}