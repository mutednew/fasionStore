import { ok } from "@/lib/response";
import { clearAuthCookie } from "@/lib/cookies";

export async function POST() {
    const res = ok({ message: "Logged out" }, 200);
   clearAuthCookie(res);

    return res;
}