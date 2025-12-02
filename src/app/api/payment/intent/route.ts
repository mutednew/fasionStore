import { NextResponse } from "next/server";
import Stripe from "stripe";
import { requireAuth, AuthenticatedRequest } from "@/lib/requireAuth";
import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/response";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20" as any,
    typescript: true,
});

export async function POST(req: Request) {
    try {
        const auth = await requireAuth(req);
        if (auth instanceof NextResponse) return auth;

        const user = (req as unknown as AuthenticatedRequest).user;

        const cart = await prisma.cart.findUnique({
            where: { userId: user.userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart || cart.items.length === 0) {
            return fail("Cart is empty", 400);
        }

        const subtotal = cart.items.reduce((acc, item) => {
            return acc + (Number(item.product.price) * item.quantity);
        }, 0);

        const shipping = subtotal > 200 ? 0 : 15;
        const total = subtotal + shipping;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            metadata: { userId: user.userId },
        });

        return ok({ clientSecret: paymentIntent.client_secret });

    } catch (err) {
        console.error("Stripe Intent Error:", err);
        return fail("Internal server error", 500);
    }
}