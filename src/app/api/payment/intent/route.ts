import { NextResponse } from "next/server";
import Stripe from "stripe";
import { requireAuth, AuthenticatedRequest } from "@/lib/requireAuth";
import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/response";
import { promoService } from "@/services/promo.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20" as any,
    typescript: true,
});

export async function POST(req: Request) {
    try {
        const auth = await requireAuth(req);
        if (auth instanceof NextResponse) return auth;

        const user = (req as unknown as AuthenticatedRequest).user;

        const body = await req.json();
        const { promoCode } = body;

        const cart = await prisma.cart.findUnique({
            where: { userId: user.userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart || cart.items.length === 0) {
            return fail("Cart is empty", 400);
        }

        let subtotal = cart.items.reduce((acc, item) => {
            const price = Number(item.product.salePrice ?? item.product.price);
            return acc + (price * item.quantity);
        }, 0);

        let shipping = subtotal > 200 ? 0 : 15;

        if (promoCode) {
            try {
                const promo = await promoService.validatePromo(promoCode, user.userId);

                if (promo.type === "FREE_SHIPPING") {
                    shipping = 0;
                } else if (promo.type === "PERCENT") {
                    const discount = subtotal * (promo.value / 100);
                    subtotal -= discount;
                } else if (promo.type === "FIXED") {
                    subtotal -= promo.value;
                }
            } catch (e) {
                console.warn("Invalid promo ignored during payment:", promoCode);
            }
        }

        const total = subtotal + shipping;

        const amountInCents = Math.round(Math.max(0.5, total) * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            metadata: {
                userId: user.userId,
                promoCode: promoCode || ""
            },
        });

        return ok({ clientSecret: paymentIntent.client_secret });

    } catch (err) {
        console.error("Stripe Intent Error:", err);
        return fail("Internal server error", 500);
    }
}