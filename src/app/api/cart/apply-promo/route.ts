import { NextResponse } from "next/server";
import { promoService } from "@/services/promo.service";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const user = getUserFromRequest(req);

        const body = await req.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json({ success: false, message: "Code is required" }, { status: 400 });
        }

        console.log(`Applying promo: ${code} for user: ${user?.userId || 'Guest'}`);

        const promo = await promoService.validatePromo(code, user?.userId);

        return NextResponse.json({
            success: true,
            data: { promo }
        });

    } catch (err: any) {
        console.error("Apply Promo Error:", err.message);

        return NextResponse.json(
            { success: false, message: err.message || "Invalid promo code" },
            { status: 400 }
        );
    }
}