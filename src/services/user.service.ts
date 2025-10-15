import {LoginInput, RegisterInput} from "@/schemas/auth.schema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {signToken} from "@/lib/jwt";

export async function registerUser(input: RegisterInput) {
    const { email, password, name } = input;

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) throw new Error("User with this email already exists");

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashed,
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

    return { user, token };
}

export async function loginUser(input: LoginInput) {
    const { email, password } = input;

    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
        }
    });

    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new Error("Invalid email or password");

    const token = signToken({ userId: user.id, role: user.role });

    const returnedUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    };

    return { user: returnedUser, token };
}