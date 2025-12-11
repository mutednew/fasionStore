import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/ApiError";
import { emailService } from "./email.service";
import { promoService } from "./promo.service";

export interface CheckoutData {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    zip: string;
    promoCode?: string;
}

export const orderService = {
    // ... getAll, getById, getByUser оставляем без изменений ...
    async getAll() {
        return await prisma.order.findMany({
            include: { items: { include: { product: true } }, user: true },
            orderBy: { createdAt: "desc" },
        });
    },

    async getById(id: string) {
        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: { include: { product: true } }, user: true },
        });
        if (!order) throw new ApiError("Order not found", 404);
        return order;
    },

    async getByUser(userId: string) {
        return await prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: "desc" },
        });
    },

    // 4. Создать заказ
    async createFromCart(userId: string, data: CheckoutData) {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart || cart.items.length === 0) {
            throw new ApiError("Cart is empty", 400);
        }

        // 1. Считаем базовую сумму
        let subtotal = cart.items.reduce((acc, item) => {
            const price = Number(item.product.salePrice ?? item.product.price);
            return acc + (price * item.quantity);
        }, 0);

        let shippingCost = subtotal > 200 ? 0 : 15;

        // 2. Применяем ПРОМОКОД
        if (data.promoCode) {
            // Убрали try/catch, чтобы ошибка валидации (если код неверный) прерывала создание заказа
            // Это безопаснее: если юзер ожидает скидку, а она не сработала, лучше выдать ошибку.
            const promo = await promoService.validatePromo(data.promoCode, userId);

            console.log(`Applying promo code ${data.promoCode} to order for user ${userId}`);

            if (promo.type === "FREE_SHIPPING") {
                shippingCost = 0;
            } else if (promo.type === "PERCENT") {
                const discount = subtotal * (promo.value / 100);
                subtotal -= discount;
            } else if (promo.type === "FIXED") {
                subtotal -= promo.value;
            }

            // Если нужно, чтобы промокод был одноразовым, раскомментируй:
            // await prisma.promoCode.update({ where: { id: promo.id }, data: { isActive: false } });
        }

        const total = Math.max(0, subtotal + shippingCost);

        // 3. Создаем заказ в транзакции
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    status: "PAID",
                    total: total, // <-- Здесь должна быть сумма со скидкой

                    email: data.email,
                    phone: data.phone,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    city: data.city,
                    country: data.country,
                    zip: data.zip,
                },
            });

            const orderItemsData = cart.items.map((item) => ({
                orderId: newOrder.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.salePrice ?? item.product.price,
                size: item.size,
                color: item.color,
            }));

            if (orderItemsData.length > 0) {
                await tx.orderItem.createMany({ data: orderItemsData });
            }

            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

            return newOrder;
        });

        // 4. Отправляем чек
        const fullOrder = await prisma.order.findUnique({
            where: { id: order.id },
            include: { items: { include: { product: true } } }
        });

        if (fullOrder) {
            await emailService.sendReceipt(fullOrder as any);
        }

        return order;
    },

    // ... методы updateStatus и delete оставляем без изменений ...
    async updateStatus(id: string, status: any) {
        return await prisma.order.update({
            where: { id },
            data: { status },
            include: { items: { include: { product: true } }, user: true },
        });
    },

    async delete(id: string) {
        await prisma.orderItem.deleteMany({ where: { orderId: id } });
        await prisma.order.delete({ where: { id } });
    }
};