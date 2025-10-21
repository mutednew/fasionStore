import { NextRequest, NextResponse } from "next/server";

export interface User {
    userId: string;
    role: "ADMIN" | "CUSTOMER";
}

export async function requireAuth(req: Request | NextRequest, role?: "ADMIN" | "CUSTOMER"): Promise<NextResponse | null> {
    const headers = (req as any).headers?.get
        ? req.headers
        : new Headers((req as any).headers);

    const authHeader = headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const userId = headers.get("x-user-id");
    const userRole = headers.get("x-user-role");

    if (!userId || !userRole) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (role && userRole !== role) {
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    (req as any).user = { userId, role: userRole };

    return null;
}