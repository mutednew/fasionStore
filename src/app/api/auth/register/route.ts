import { RegisterSchema } from "@/schemas/auth.schema";
import { registerUser } from "@/services/user.service";
import { ApiError } from "@/lib/ApiError";
import { ok, fail } from "@/lib/response";
import {setAuthCookie} from "@/lib/cookies";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = RegisterSchema.safeParse(body);

        if (!parsed.success) {
            return fail("Invalid data", 400, parsed.error.format());
        }

        const { user, token } = await registerUser(parsed.data);

        const res = ok({ user }, 201);
        setAuthCookie(res, token);

        return res;
    } catch (err) {
        if (err instanceof ApiError) {
            return fail(err.message, err.status, err.details);
        }
        console.error("Register error:", err);
        return fail("Internal server error", 500);
    }
}