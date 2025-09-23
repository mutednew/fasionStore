import {RegisterSchema} from "@/schemas/auth.schema";
import {NextResponse} from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {signToken} from "@/lib/jwt";

export async function POST(req: Request) {
    try {
        const body = await req.json;
        const parsed = RegisterSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
        }

        const { email, password, name } = parsed.data;

        const existing = await prisma.user.findUnique({ where: { email } });

        if (existing) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        const token = signToken({ userId: user.id, role: user.role });

        return NextResponse.json({ user, token }, { status: 201 });
    } catch (err: any) {
        console.error(err);

        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}