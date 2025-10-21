import { LoginSchema } from "@/schemas/auth.schema";
import { loginUser } from "@/services/user.service";
import { ApiError } from "@/lib/ApiError";
import { ok, fail } from "@/lib/response";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = LoginSchema.safeParse(body);

        if (!parsed.success) {
            return fail("Invalid data", 400, parsed.error.format());
        }

        const result = await loginUser(parsed.data);
        return ok(result, 200);
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }
        console.error("Login error:", err);
        return fail("Internal server error", 500);
    }
}