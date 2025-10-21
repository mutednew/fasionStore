import { NextRequest, NextResponse } from "next/server";

export interface User {
    userId: string;
    role: "ADMIN" | "CUSTOMER";
}

export async function requireAuth(req: NextRequest, role?: "ADMIN" | "CUSTOMER"): Promise<NextResponse | null> {
    const userId = req.headers.get("x-user-id");
    const userRole = req.headers.get("x-user-role");

    if (!userId || !userRole) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (role && userRole !== role) {
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    // Типизируем user
    (req as any).user = { userId, role: userRole };

    return null;
}