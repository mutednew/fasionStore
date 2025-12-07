import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/ApiError";
import { emailService } from "./email.service"; // Импортируем наш новый сервис

// Интерфейс данных доставки
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
    // 1. Получить все заказы (для Админа)
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

    // 2. Получить один заказ по ID
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

    // 3. Получить заказы конкретного пользователя
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

    // 4. Создать заказ из корзины (CHECKOUT)
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

        // Создаем заказ в транзакции
        const order = await prisma.$transaction(async (tx) => {
            // Создаем заказ
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

            // Переносим товары
            const orderItemsData = cart.items.map((item) => ({
                orderId: newOrder.id,
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

            // Чистим корзину
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });

            return newOrder;
        });

        // 🚀 ОТПРАВЛЯЕМ ПИСЬМО (уже после успешной транзакции)
        // Нам нужно загрузить order.items.product для красивого письма,
        // так как order выше содержит только сырые данные
        const fullOrder = await prisma.order.findUnique({
            where: { id: order.id },
            include: { items: { include: { product: true } } }
        });

        if (fullOrder) {
            // as any нужен, так как Prisma возвращает Decimal, а наш тип ждет number/string
            // в реальном проекте лучше сделать маппер
            await emailService.sendReceipt(fullOrder as any);
        }

        return order;
    },

    // 5. Обновить статус заказа
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

    // 6. Удалить заказ
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