import { categoryService } from "@/services/category.service";
import { CategorySchema } from "@/schemas/category.schema";
import { requireAuth } from "@/lib/requireAuth";
import { ok, fail } from "@/lib/response";
import { ApiError } from "@/lib/ApiError";

export async function GET() {
    try {
        const categories = await categoryService.getAll();
        return ok({ categories });
    } catch (err) {
        console.error("Categories fetch error:", err);
        return fail("Internal server error", 500);
    }
}

export async function POST(req: Request) {
    try {
        const auth = await requireAuth(req, "ADMIN");
        if (auth) return auth;

        const body = await req.json();
        const parsed = CategorySchema.safeParse(body);
        if (!parsed.success) {
            return fail("Invalid data", 400, parsed.error.format());
        }

        const category = await categoryService.create(parsed.data);
        return ok({ category }, 201);
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }

        console.error("Category creation error:", err);
        return fail("Internal server error", 500);
    }
}