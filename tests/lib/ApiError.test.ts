import { ApiError } from "@/lib/ApiError";

describe("🧩 ApiError", () => {
    it("should create an instance with message and status", () => {
        const err = new ApiError("Something went wrong", 500);

        expect(err).toBeInstanceOf(ApiError);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe("Something went wrong");
        expect(err.status).toBe(500);
        expect(err.details).toBeUndefined();
        expect(err.name).toBe("ApiError");
        expect(typeof err.stack).toBe("string");
    });

    it("should store details when provided", () => {
        const details = { reason: "Invalid input", field: "email" };
        const err = new ApiError("Validation failed", 400, details);

        expect(err.details).toEqual(details);
        expect(err.status).toBe(400);
        expect(err.message).toBe("Validation failed");
    });

    it("should have proper stack trace", () => {
        const err = new ApiError("Trace test", 404);
        expect(err.stack).toContain("ApiError");
        expect(err.stack).toContain("Trace test");
    });
});