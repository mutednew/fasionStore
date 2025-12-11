import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuth, AuthenticatedRequest } from "@/lib/requireAuth";
import { orderService } from "@/services/order.service";
import { ok, fail } from "@/lib/response";
import { ApiError } from "@/lib/ApiError";

// Добавляем promoCode в валидацию (опционально)
const CheckoutBodySchema = z.object({
    email: z.string().email(),
    phone: z.string().min(5),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address: z.string().min(5),
    city: z.string().min(2),
    country: z.string().min(2),
    zip: z.string().min(3),
    promoCode: z.string().optional(), // <-- Добавили
});

export async function POST(req: Request) {
    try {
        const auth = await requireAuth(req);
        if (auth instanceof NextResponse) return auth;

        const user = (req as unknown as AuthenticatedRequest).user;
        const body = await req.json();

        const parsed = CheckoutBodySchema.safeParse(body);
        if (!parsed.success) {
            return fail("Invalid shipping data", 400, parsed.error.format());
        }

        // Имитация задержки (можно убрать в продакшене)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Передаем данные вместе с промокодом в сервис
        const order = await orderService.createFromCart(user.userId, parsed.data);

        return ok({ order }, 201);
    } catch (err) {
        if (err instanceof ApiError) return fail(err.message, err.status);
        console.error("Checkout error:", err);
        return fail("Internal server error", 500);
    }
}