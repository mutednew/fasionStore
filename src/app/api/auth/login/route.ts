import { LoginSchema } from "@/schemas/auth.schema";
import { NextResponse } from "next/server";
import { loginUser } from "@/services/user.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = LoginSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
        }

        const result = await loginUser(parsed.data);

        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
    }
}