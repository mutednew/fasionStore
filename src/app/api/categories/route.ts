import { categoryService } from "@/services/category.service";
import { CategorySchema } from "@/schemas/category.schema";
import { requireAuth } from "@/middleware/auth";
import { ok, fail } from "@/lib/response";
import { ZodError } from "zod";
import { ApiError } from "@/lib/ApiError";

export async function GET() {
    try {
        const categories = await categoryService.getAll();
        return ok(categories);
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("GET /api/categories error:", err);
        return fail("Failed to fetch categories", 500);
    }
}

export async function POST(req: Request) {
    const auth = await requireAuth(req as any, "ADMIN");
    if (auth) return auth;

    const user = (req as any).user;

    try {
        const body = await req.json();
        const parsed = CategorySchema.omit({ id: true }).parse(body);

        const existingCategory = await categoryService.getByName(parsed.name);
        if (existingCategory) {
            throw new ApiError("Category with this name already exists", 409);
        }

        const created = await categoryService.create(parsed);

        return ok(created, 201);
    } catch (err) {
        if (err instanceof ZodError) {
            return fail("Invalid data", 400, err.issues);
        }

        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("POST /api/categories error:", err);
        return fail("Failed to create category", 500);
    }
}