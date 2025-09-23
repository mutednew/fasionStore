import {LoginSchema} from "@/schemas/auth.schema";
import {NextResponse} from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {signToken} from "@/lib/jwt";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = LoginSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true, password: true, role: true },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const token = signToken({ userId: user.id, role: user.role});

        const returnedUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        }

        return NextResponse.json({ user: returnedUser, token }, { status: 200 });
    } catch (err: any) {
        console.error("Login error:", err);

        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}