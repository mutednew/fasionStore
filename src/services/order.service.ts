import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/ApiError";

export interface CheckoutData {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    zip: string;
}

export const orderService = {
    async getAll() {
        try {
            return await prisma.order.findMany({
                include: {
                    items: { include: { product: true } },
                    user: true,
                },
                orderBy: { createdAt: "desc" },
            });
        } catch (err) {
            throw new ApiError("Failed to fetch orders", 500);
        }
    },

    async getById(id: string) {
        try {
            const order = await prisma.order.findUnique({
                where: { id },
                include: {
                    items: { include: { product: true } },
                    user: true,
                },
            });

            if (!order) throw new ApiError("Order not found", 404);
            return order;
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new ApiError("Failed to fetch order", 500);
        }
    },

    async getByUser(userId: string) {
        try {
            return await prisma.order.findMany({
                where: { userId },
                include: {
                    items: { include: { product: true } },
                },
                orderBy: { createdAt: "desc" },
            });
        } catch (err) {
            throw new ApiError("Failed to fetch user orders", 500);
        }
    },

    async createFromCart(userId: string, data: CheckoutData) {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart || cart.items.length === 0) {
            throw new ApiError("Cart is empty", 400);
        }

        const subtotal = cart.items.reduce((acc, item) => {
            return acc + (Number(item.product.price) * item.quantity);
        }, 0);

        const shippingCost = subtotal > 200 ? 0 : 15;
        const total = subtotal + shippingCost;

        return await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
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
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
                size: item.size,
                color: item.color,
            }));

            if (orderItemsData.length > 0) {
                await tx.orderItem.createMany({
                    data: orderItemsData,
                });
            }

            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });

            return order;
        });
    },

    async updateStatus(id: string, status: any) {
        try {
            return await prisma.order.update({
                where: { id },
                data: { status },
                include: {
                    items: { include: { product: true } },
                    user: true,
                },
            });
        } catch (err) {
            throw new ApiError("Failed to update order status", 500);
        }
    },

    async delete(id: string) {
        try {
            await prisma.orderItem.deleteMany({
                where: { orderId: id },
            });

            await prisma.order.delete({
                where: { id },
            });
        } catch (err) {
            throw new ApiError("Failed to delete order", 500);
        }
    },
};