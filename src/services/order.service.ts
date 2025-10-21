import { OrderType } from "@/schemas/order.schema";
import { prisma } from "@/lib/prisma";
import { CartSchema } from "@/schemas/cart.schema";
import { toPlainOrder, PrismaOrderWithItems } from "@/lib/transformers";
import { ApiError } from "@/lib/ApiError";

export const orderService = {
    async getAll(): Promise<OrderType[]> {
        try {
            const orders = await prisma.order.findMany({
                include: {
                    items: {
                        include: { product: true },
                    },
                    user: true,
                },
                orderBy: { createdAt: "desc" },
            });

            return orders.map(toPlainOrder);
        } catch (err) {
            throw new ApiError("Failed to fetch orders", 500);
        }
    },

    async getById(id: string): Promise<OrderType | null> {
        try {
            const order = await prisma.order.findUnique({
                where: { id },
                include: {
                    items: {
                        include: { product: true },
                    },
                    user: true,
                },
            });

            if (!order) {
                throw new ApiError("Order not found", 404);
            }

            return toPlainOrder(order);
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new ApiError("Failed to fetch order", 500);
        }
    },

    async getByUser(userId: string): Promise<OrderType[]> {
        try {
            const orders = await prisma.order.findMany({
                where: { userId },
                include: {
                    items: { include: { product: true } },
                },
                orderBy: { createdAt: "desc" },
            });

            return orders.map(toPlainOrder);
        } catch (err) {
            throw new ApiError("Failed to fetch orders for user", 500);
        }
    },

    async createFromCart(cartData: unknown): Promise<OrderType> {
        try {
            const parsed = CartSchema.parse(cartData);

            if (!parsed.items || parsed.items.length === 0) {
                throw new ApiError("Cart is empty", 400);
            }

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

            return toPlainOrder(order);
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new ApiError("Failed to create order from cart", 500);
        }
    },

    async updateStatus(id: string, status: OrderType["status"]): Promise<OrderType> {
        try {
            const updated = await prisma.order.update({
                where: { id },
                data: { status },
                include: { items: { include: { product: true } } },
            });

            return toPlainOrder(updated);
        } catch (err) {
            throw new ApiError("Failed to update order status", 500);
        }
    },

    async delete(id: string): Promise<void> {
        try {
            const order = await prisma.order.findUnique({ where: { id } });

            if (!order) {
                throw new ApiError("Order not found", 404);
            }

            await prisma.order.delete({ where: { id } });
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new ApiError("Failed to delete order", 500);
        }
    },
};