import { LoginInput, RegisterInput } from "@/schemas/auth.schema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { ApiError } from "@/lib/ApiError";
import { authService } from "@/services/auth.service";

export async function registerUser(input: RegisterInput) {
    const { email, password, name } = input;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ApiError("User with this email already exists", 409);

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { email, password: hashed, name },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            emailVerified: true,
        },
    });

    await authService.sendVerificationToken(user.email);

    return { user };
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
            emailVerified: true
        },
    });

    if (!user) throw new ApiError("Invalid email or password", 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError("Invalid email or password", 401);

    if (!user.emailVerified) {
        throw new ApiError("Please verify your email first. Check your inbox.", 403);
    }

    const token = signToken({ userId: user.id, role: user.role });
    const { password: _, ...publicUser } = user;

    return { user: publicUser, token };
}