import { NextResponse } from "next/server";
import { RegisterSchema } from "@/schemas/auth.schema";
import { registerUser } from "@/services/user.service";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = RegisterSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
        }

        const result = await registerUser(parsed.data);

        return NextResponse.json({ result, status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
    }
}