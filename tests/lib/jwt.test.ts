process.env.JWT_SECRET = "supersecret";
process.env.JWT_EXPIRES_IN = "7d";

import jwt from "jsonwebtoken";
import { signToken, verifyToken, getUserFromAuthHeader } from "@/lib/jwt";
import { ApiError } from "@/lib/ApiError";

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(),
    verify: jest.fn(),
}));

const payload = { userId: "u1", role: "ADMIN" };

describe("lib/jwt", () => {
    afterEach(() => jest.clearAllMocks());

    describe("signToken()", () => {
        it("should sign token with correct arguments", () => {
            (jwt.sign as jest.Mock).mockReturnValue("signed-token");

            const result = signToken(payload);

            expect(jwt.sign).toHaveBeenCalledWith(payload, "supersecret", { expiresIn: "7d" });
            expect(result).toBe("signed-token");
        });
    });

    describe("verifyToken()", () => {
        it("should return decoded payload if valid", () => {
            (jwt.verify as jest.Mock).mockReturnValue(payload);
            const result = verifyToken("valid-token");
            expect(result).toEqual(payload);
        });

        it("should return null if decoded is string", () => {
            (jwt.verify as jest.Mock).mockReturnValue("string");
            const result = verifyToken("weird-token");
            expect(result).toBeNull();
        });

        it("should throw ApiError on invalid token", () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error("invalid");
            });

            expect(() => verifyToken("bad-token")).toThrow(ApiError);
            expect(() => verifyToken("bad-token")).toThrow("Invalid or expired token");
        });
    });

    describe("getUserFromAuthHeader()", () => {
        it("should return null if no header", () => {
            expect(getUserFromAuthHeader(null)).toBeNull();
            expect(getUserFromAuthHeader("")).toBeNull();
        });

        it("should return null if header does not start with Bearer", () => {
            expect(getUserFromAuthHeader("Token 123")).toBeNull();
        });

        it("should verify token and return payload", () => {
            const fakePayload = { userId: "123", role: "CUSTOMER" };
            (jwt.verify as jest.Mock).mockReturnValue(fakePayload);

            const header = "Bearer valid-token";
            const result = getUserFromAuthHeader(header);

            expect(result).toEqual(fakePayload);
        });

        it("should throw ApiError if verifyToken fails", () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error("expired");
            });

            expect(() => getUserFromAuthHeader("Bearer bad")).toThrow(ApiError);
        });
    });
});