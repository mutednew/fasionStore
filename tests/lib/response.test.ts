import { ok, fail } from "@/lib/response";
import { NextResponse } from "next/server";

describe("🧪 response helpers", () => {
    it("ok() should return a successful JSON response with default 200 status", async () => {
        const payload = { id: 1, name: "Test" };
        const res = ok(payload);

        expect(res).toBeInstanceOf(NextResponse);
        expect(res.status).toBe(200);

        const json = await res.json();
        expect(json).toEqual({
            success: true,
            data: payload,
        });
    });

    it("ok() should allow custom status code", async () => {
        const res = ok({ done: true }, 201);
        expect(res.status).toBe(201);

        const json = await res.json();
        expect(json.success).toBe(true);
        expect(json.data).toEqual({ done: true });
    });

    it("fail() should return an error JSON response with default 400 status", async () => {
        const res = fail("Something went wrong");
        expect(res).toBeInstanceOf(NextResponse);
        expect(res.status).toBe(400);

        const json = await res.json();
        expect(json).toEqual({
            success: false,
            message: "Something went wrong",
            details: undefined,
        });
    });

    it("fail() should allow custom status and details", async () => {
        const res = fail("Invalid input", 422, { field: "email" });
        expect(res.status).toBe(422);

        const json = await res.json();
        expect(json).toEqual({
            success: false,
            message: "Invalid input",
            details: { field: "email" },
        });
    });
});