import { prisma } from "@/lib/prisma";
import { emailService } from "./email.service";

const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `DAILY-${result}`;
};

export const promoService = {
    async generateDailyPromos() {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, name: true }
        });

        console.log(`Generating promos for ${users.length} users...`);

        for (const user of users) {
            const chance = Math.random();
            let type: "PERCENT" | "FIXED" | "FREE_SHIPPING" = "PERCENT";
            let value = 0;

            if (chance < 0.1) {
                type = "FIXED";
                value = 50;
            } else if (chance < 0.3) {
                type = "FREE_SHIPPING";
                value = 0;
            } else {
                type = "PERCENT";
                value = Math.floor(Math.random() * (30 - 5 + 1)) + 5;
            }

            const code = generateCode();
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

            await prisma.promoCode.deleteMany({ where: { userId: user.id } });

            await prisma.promoCode.create({
                data: {
                    code,
                    type,
                    value,
                    userId: user.id,
                    expiresAt
                }
            });

            await emailService.sendPromoEmail(user.email, user.name || "User", code, type, value);
        }
    },

    async validatePromo(code: string, userId?: string) {
        const promo = await prisma.promoCode.findUnique({
            where: { code }
        });

        if (!promo) throw new Error("Invalid promo code");
        if (!promo.isActive) throw new Error("Promo code already used");
        if (new Date() > promo.expiresAt) throw new Error("Promo code expired");

        if (userId && promo.userId !== userId) {
            throw new Error("This code belongs to another user");
        }

        return promo;
    }
};