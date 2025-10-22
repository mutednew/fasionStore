import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import { middleware } from "@/middleware/middleware";

jest.mock("@/lib/jwt", () => ({
    verifyToken: jest.fn(),
}));

describe("🧩 middleware", () => {
    const mockUrl = "http://localhost/api/secure";
    const makeRequest = (headers?: Record<string, string>, pathname = "/api/secure") =>
        new NextRequest(mockUrl, { headers, method: "GET" });

    afterEach(() => jest.clearAllMocks());

    it("should allow public routes", () => {
        const reqAuth = new NextRequest("http://localhost/api/auth/login");
        const reqRoot = new NextRequest("http://localhost/");
        const reqPublic = new NextRequest("http://localhost/api/public/info");

        expect(middleware(reqAuth)).toBeInstanceOf(NextResponse);
        expect(middleware(reqRoot)).toBeInstanceOf(NextResponse);
        expect(middleware(reqPublic)).toBeInstanceOf(NextResponse);
    });

    it("should return 401 if authorization header is missing", async () => {
        const req = makeRequest();
        const res = middleware(req);

        expect(res.status).toBe(401);
        const body = await res.json();
        expect(body.error).toBe("Unauthorized");
    });

    it("should return 401 if token is invalid", async () => {
        (verifyToken as jest.Mock).mockReturnValue("invalid");
        const req = makeRequest({ authorization: "Bearer fake_token" });
        const res = middleware(req);

        expect(res.status).toBe(401);
        const body = await res.json();
        expect(body.error).toBe("Invalid or expired token");
    });

    it("should return 401 if verifyToken returns null", async () => {
        (verifyToken as jest.Mock).mockReturnValue(null);
        const req = makeRequest({ authorization: "Bearer fake_token" });
        const res = middleware(req);

        expect(res.status).toBe(401);
        const body = await res.json();
        expect(body.error).toBe("Invalid or expired token");
    });

    it("should return NextResponse.next() with user headers on valid token", () => {
        (verifyToken as jest.Mock).mockReturnValue({
            userId: "u1",
            role: "ADMIN",
        });

        const req = makeRequest({ authorization: "Bearer valid_token" });
        const res = middleware(req);

        expect(res).toBeInstanceOf(NextResponse);
        expect(res.headers.get("x-user-id")).toBe("u1");
        expect(res.headers.get("x-user-role")).toBe("ADMIN");
    });
});