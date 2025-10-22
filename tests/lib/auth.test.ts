import { getUserFromToken } from "@/lib/auth";
import { verifyToken } from "@/lib/jwt";
import { ApiError } from "@/lib/ApiError";

// 🧠 Мокаем verifyToken, чтобы контролировать поведение без реального JWT
jest.mock("@/lib/jwt", () => ({
    verifyToken: jest.fn(),
}));

describe("🔐 lib/auth — getUserFromToken()", () => {
    const mockVerify = verifyToken as jest.Mock;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return null if token is missing", () => {
        expect(getUserFromToken(null)).toBeNull();
        expect(getUserFromToken(undefined)).toBeNull();
    });

    it("should return payload if token is valid", () => {
        const payload = { userId: "u1", role: "ADMIN" };
        mockVerify.mockReturnValue(payload);

        const result = getUserFromToken("valid.jwt.token");

        expect(verifyToken).toHaveBeenCalledWith("valid.jwt.token");
        expect(result).toEqual(payload);
    });

    it("should throw 401 if verifyToken returns null", () => {
        mockVerify.mockReturnValue(null);

        expect(() => getUserFromToken("invalid.jwt.token")).toThrow(ApiError);
        expect(() => getUserFromToken("invalid.jwt.token")).toThrow("Invalid or expired token");
    });

    it("should rethrow ApiError from verifyToken if thrown directly", () => {
        mockVerify.mockImplementation(() => {
            throw new ApiError("Invalid token", 401);
        });

        expect(() => getUserFromToken("bad.token")).toThrow(ApiError);
        expect(() => getUserFromToken("bad.token")).toThrow("Invalid token");
    });

    it("should throw 500 if verifyToken throws unexpected error", () => {
        mockVerify.mockImplementation(() => {
            throw new Error("Something went wrong");
        });

        expect(() => getUserFromToken("oops.token")).toThrow(ApiError);
        expect(() => getUserFromToken("oops.token")).toThrow("Failed to process token");
    });
});