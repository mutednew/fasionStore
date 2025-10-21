import { categoryService } from "@/services/category.service";
import { CategorySchema } from "@/schemas/category.schema";
import { requireAuth } from "@/middleware/auth";
import { ok, fail } from "@/lib/response";
import { ZodError } from "zod";
import { ApiError } from "@/lib/ApiError";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const category = await categoryService.getById(params.id);

        if (!category) {
            throw new ApiError("Category not found", 404);
        }

        return ok(category);
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("GET /api/categories/:id error:", err);
        return fail("Failed to fetch category", 500);
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const auth = await requireAuth(req as any, "ADMIN");
    if (auth) return auth;

    const user = (req as any).user;

    try {
        const body = await req.json();
        const parsed = CategorySchema.partial().omit({ id: true }).parse(body);

        const category = await categoryService.getById(params.id);
        if (!category) {
            throw new ApiError("Category not found", 404);
        }

        const updated = await categoryService.update(params.id, parsed);

        return ok(updated);
    } catch (err) {
        if (err instanceof ZodError) {
            return fail("Invalid data", 400, err.issues);
        }

        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("PUT /api/categories/:id error:", err);
        return fail("Failed to update category", 500);
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const auth = await requireAuth(_req as any, "ADMIN");
    if (auth) return auth;

    const user = (_req as any).user;

    try {
        const category = await categoryService.getById(params.id);
        if (!category) {
            throw new ApiError("Category not found", 404);
        }

        await categoryService.delete(params.id);

        return ok({ message: "Category deleted" });
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("DELETE /api/categories/:id error:", err);
        return fail("Failed to delete category", 500);
    }
}