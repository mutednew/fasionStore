import { registerUser, loginUser } from "@/services/user.service";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { ApiError } from "@/lib/ApiError";

// 🧠 Мокаем зависимости
jest.mock("@/lib/prisma", () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    },
}));

jest.mock("bcryptjs", () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

jest.mock("@/lib/jwt", () => ({
    signToken: jest.fn(),
}));

describe("🧩 user.service", () => {
    const mockFind = prisma.user.findUnique as jest.Mock;
    const mockCreate = prisma.user.create as jest.Mock;
    const mockHash = bcrypt.hash as jest.Mock;
    const mockCompare = bcrypt.compare as jest.Mock;
    const mockSignToken = signToken as jest.Mock;

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ---------- registerUser ----------
    describe("registerUser()", () => {
        const input = { email: "new@example.com", password: "123456", name: "New User" };

        it("should register new user and return token", async () => {
            mockFind.mockResolvedValue(null);
            mockHash.mockResolvedValue("hashed_pw");
            mockCreate.mockResolvedValue({
                id: "u1",
                email: input.email,
                name: input.name,
                role: "CUSTOMER",
                createdAt: new Date(),
            });
            mockSignToken.mockReturnValue("token123");

            const result = await registerUser(input);

            expect(mockFind).toHaveBeenCalledWith({ where: { email: input.email } });
            expect(mockHash).toHaveBeenCalledWith(input.password, 10);
            expect(mockCreate).toHaveBeenCalled();
            expect(mockSignToken).toHaveBeenCalledWith({ userId: "u1", role: "CUSTOMER" });

            expect(result).toEqual({
                user: {
                    id: "u1",
                    email: input.email,
                    name: input.name,
                    role: "CUSTOMER",
                    createdAt: expect.any(Date),
                },
                token: "token123",
            });
        });

        it("should throw 409 if email already exists", async () => {
            mockFind.mockResolvedValue({ id: "exists" });

            await expect(registerUser(input)).rejects.toThrow(ApiError);
            await expect(registerUser(input)).rejects.toThrow("User with this email already exists");
        });

        it("should throw 500 on prisma error", async () => {
            mockFind.mockRejectedValue(new Error("DB error"));
            await expect(registerUser(input)).rejects.toThrow("DB error");
        });
    });

    // ---------- loginUser ----------
    describe("loginUser()", () => {
        const input = { email: "user@example.com", password: "password123" };

        it("should login user and return token", async () => {
            const user = {
                id: "u1",
                email: input.email,
                name: "User",
                password: "hashed",
                role: "CUSTOMER",
            };

            mockFind.mockResolvedValue(user);
            mockCompare.mockResolvedValue(true);
            mockSignToken.mockReturnValue("jwt_token");

            const result = await loginUser(input);

            expect(mockFind).toHaveBeenCalledWith({
                where: { email: input.email },
                select: expect.any(Object),
            });
            expect(mockCompare).toHaveBeenCalledWith(input.password, "hashed");
            expect(mockSignToken).toHaveBeenCalledWith({ userId: "u1", role: "CUSTOMER" });

            expect(result).toEqual({
                user: {
                    id: "u1",
                    email: input.email,
                    name: "User",
                    role: "CUSTOMER",
                },
                token: "jwt_token",
            });
        });

        it("should throw 401 if user not found", async () => {
            mockFind.mockResolvedValue(null);
            await expect(loginUser(input)).rejects.toThrow("Invalid email or password");
        });

        it("should throw 401 if password invalid", async () => {
            mockFind.mockResolvedValue({
                id: "u1",
                email: input.email,
                password: "hashed",
                role: "CUSTOMER",
                name: "User",
            });
            mockCompare.mockResolvedValue(false);

            await expect(loginUser(input)).rejects.toThrow("Invalid email or password");
        });

        it("should throw 500 on prisma failure", async () => {
            mockFind.mockRejectedValue(new Error("DB fail"));
            await expect(loginUser(input)).rejects.toThrow("DB fail");
        });
    });
});