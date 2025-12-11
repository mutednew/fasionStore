import { NextResponse } from "next/server";
import { promoService } from "@/services/promo.service";

export async function GET(req: Request) {
    // const authHeader = req.headers.get("authorization");
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new NextResponse("Unauthorized", { status: 401 });
    // }

    try {
        await promoService.generateDailyPromos();
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}