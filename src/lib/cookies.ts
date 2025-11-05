import { NextResponse } from "next/server";

const COOKIE_NAME = "token";

export function setAuthCookie(res: NextResponse, token: string) {
    res.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });
}

export function clearAuthCookie(res: NextResponse) {
    res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}