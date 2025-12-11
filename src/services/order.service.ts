import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/ApiError";
import { emailService } from "./email.service";
import { promoService } from "./promo.service";
import { startOfDay, subDays, format, subMonths } from "date-fns";

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

    async createFromCart(userId: string, data: CheckoutData) {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart || cart.items.length === 0) {
            throw new ApiError("Cart is empty", 400);
        }

        let subtotal = cart.items.reduce((acc, item) => {
            const price = Number(item.product.salePrice ?? item.product.price);
            return acc + (price * item.quantity);
        }, 0);

        let shippingCost = subtotal > 200 ? 0 : 15;

        if (data.promoCode) {
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

        }

        const total = Math.max(0, subtotal + shippingCost);

        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    status: "PAID",
                    total: total,

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

        const fullOrder = await prisma.order.findUnique({
            where: { id: order.id },
            include: { items: { include: { product: true } } }
        });

        if (fullOrder) {
            await emailService.sendReceipt(fullOrder as any);
        }

        return order;
    },

    async getAnalytics(range: 'week' | 'month' | 'year') {
        const now = new Date();
        let startDate = new Date();
        let previousStartDate = new Date();
        let dateFormat = "MMM dd";

        if (range === 'week') {
            startDate = subDays(now, 7);
            previousStartDate = subDays(now, 14);
            dateFormat = "EEE";
        } else if (range === 'month') {
            startDate = subDays(now, 30);
            previousStartDate = subDays(now, 60);
            dateFormat = "MMM dd";
        } else if (range === 'year') {
            startDate = subMonths(now, 12);
            previousStartDate = subMonths(now, 24);
            dateFormat = "MMM yyyy";
        }

        const currentOrders = await prisma.order.findMany({
            where: {
                createdAt: { gte: startDate },
                status: { not: "CANCELED" }
            },
            select: { createdAt: true, total: true },
            orderBy: { createdAt: 'asc' }
        });

        const previousOrdersAgg = await prisma.order.aggregate({
            _sum: { total: true },
            where: {
                createdAt: { gte: previousStartDate, lt: startDate },
                status: { not: "CANCELED" }
            }
        });

        const groupedData: Record<string, number> = {};
        let currentTotalSales = 0;

        currentOrders.forEach(order => {
            const dateKey = format(order.createdAt, dateFormat);
            const total = Number(order.total);

            currentTotalSales += total;

            if (groupedData[dateKey]) {
                groupedData[dateKey] += total;
            } else {
                groupedData[dateKey] = total;
            }
        });

        const sales = Object.entries(groupedData).map(([name, value]) => ({
            name,
            value
        }));

        const previousTotalSales = Number(previousOrdersAgg._sum.total || 0);

        let percentageChange = 0;

        if (previousTotalSales === 0) {
            percentageChange = currentTotalSales > 0 ? 100 : 0;
        } else {
            percentageChange = ((currentTotalSales - previousTotalSales) / previousTotalSales) * 100;
        }

        percentageChange = Math.round(percentageChange * 10) / 10;

        return {
            sales,
            percentageChange,
            total: currentTotalSales
        };
    },

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