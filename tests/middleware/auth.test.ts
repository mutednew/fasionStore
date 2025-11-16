import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";

describe("requireAuth middleware", () => {
    const makeRequest = (headers: Record<string, string> = {}) =>
        ({
            headers: new Headers(headers),
        }) as unknown as Request;

    it("should return 401 if no Authorization header", async () => {
        const req = makeRequest({});
        const res = await requireAuth(req);

        expect(res).toBeInstanceOf(NextResponse);
        expect(res?.status).toBe(401);

        const json = await res?.json();
        expect(json).toEqual({ success: false, message: "Unauthorized" });
    });

    it("should return 401 if Authorization header does not start with Bearer", async () => {
        const req = makeRequest({ authorization: "InvalidToken" });
        const res = await requireAuth(req);

        expect(res?.status).toBe(401);
        const json = await res?.json();
        expect(json).toEqual({ success: false, message: "Unauthorized" });
    });

    it("should return 401 if userId or role missing", async () => {
        const req = makeRequest({
            authorization: "Bearer token",
            "x-user-id": "123",
        });

        const res = await requireAuth(req);
        expect(res?.status).toBe(401);
        const json = await res?.json();
        expect(json).toEqual({ success: false, message: "Unauthorized" });
    });

    it("should return 403 if role mismatch", async () => {
        const req = makeRequest({
            authorization: "Bearer token",
            "x-user-id": "123",
            "x-user-role": "CUSTOMER",
        });

        const res = await requireAuth(req, "ADMIN");

        expect(res?.status).toBe(403);
        const json = await res?.json();
        expect(json).toEqual({ success: false, message: "Forbidden" });
    });

    it("should attach user to request and return null if authorized", async () => {
        const req = makeRequest({
            authorization: "Bearer validtoken",
            "x-user-id": "user-123",
            "x-user-role": "ADMIN",
        });

        const res = await requireAuth(req, "ADMIN");

        expect(res).toBeNull();
        expect((req as any).user).toEqual({
            userId: "user-123",
            role: "ADMIN",
        });
    });

    it("should pass if no specific role required", async () => {
        const req = makeRequest({
            authorization: "Bearer validtoken",
            "x-user-id": "user-456",
            "x-user-role": "CUSTOMER",
        });

        const res = await requireAuth(req);

        expect(res).toBeNull();
        expect((req as any).user).toEqual({
            userId: "user-456",
            role: "CUSTOMER",
        });
    });
});