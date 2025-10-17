import { OrderType } from "@/schemas/order.schema";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { CartSchema } from "@/schemas/cart.schema";

export const orderService = {
    async getAll(): Promise<OrderType[]> {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: { product: true },
                },
                user: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return orders.map(orderService.toPlainOrder);
    },

    async getById(id: string): Promise<OrderType | null> {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: true },
                },
                user: true,
            },
        });

        return order ? orderService.toPlainOrder(order) : null;
    },

    async getByUser(userId: string): Promise<OrderType[]> {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: { include: { product: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return orders.map(orderService.toPlainOrder);
    },

    async createFromCart(cartData: unknown): Promise<OrderType> {
        const parsed = CartSchema.parse(cartData);

        if (!parsed.items || parsed.items.length === 0)
            throw new Error("Cart is empty");

        const order = await prisma.order.create({
            data: {
                userId: parsed.userId,
                status: "PENDING",
                items: {
                    create: parsed.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: 0,
                    })),
                },
            },
            include: { items: { include: { product: true } } },
        });

        return orderService.toPlainOrder(order);
    },

    async updateStatus(id: string, status: OrderType["status"]): Promise<OrderType> {
        const updated = await prisma.order.update({
            where: { id },
            data: { status },
            include: { items: { include: { product: true } } },
        });

        return orderService.toPlainOrder(updated);
    },

    async delete(id: string): Promise<void> {
        await prisma.order.delete({ where: { id } });
    },

    toPlainOrder(order: Prisma.OrderGetPayload<{ include: { items: { include: { product: true } } } }>): OrderType {
        return {
            id: order.id,
            userId: order.userId,
            status: order.status,
            createdAt: order.createdAt,
            items: order.items.map((item) => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                price: Number(item.price),
            })),
        };
    },
};