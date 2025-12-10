import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { signToken } from "@/lib/jwt";
import { setAuthCookie } from "@/lib/cookies";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.redirect(new URL("/verify-email?error=missing_token", req.url));
    }

    const result = await authService.verifyEmail(token);

    if (result.error || !result.user) {
        return NextResponse.redirect(new URL(`/verify-email?error=${result.error || 'invalid'}`, req.url));
    }

    const authToken = signToken({
        userId: result.user.id,
        role: result.user.role
    });

    const response = NextResponse.redirect(new URL("/verify-email?success=true", req.url));

    setAuthCookie(response, authToken);

    return response;
}