import { prisma } from "@/lib/prisma";
import { CartItemSchema } from "@/schemas/cart.schema";
import { ApiError } from "@/lib/ApiError";

export const cartService = {
    // Получение корзины
    async getByUser(userId: string) {
        try {
            let cart = await prisma.cart.findUnique({
                where: { userId },
                include: {
                    items: {
                        orderBy: { createdAt: 'asc' },
                        include: {
                            product: true,
                        },
                    },
                },
            });

            if (!cart) {
                cart = await prisma.cart.create({
                    data: { userId },
                    include: { items: { include: { product: true } } },
                });
            }

            return cart;
        } catch (err) {
            console.error(err);
            throw new ApiError("Failed to fetch cart", 500);
        }
    },

    // Добавление товара
    async addItem(userId: string, data: unknown) {
        try {
            const parsed = CartItemSchema.parse(data);

            // 1. Убеждаемся, что корзина существует
            const cart = await prisma.cart.upsert({
                where: { userId },
                update: {},
                create: { userId },
            });

            // 2. Приводим undefined к null для Prisma
            const size = parsed.size ?? null;
            const color = parsed.color ?? null;

            // 3. Ищем, есть ли уже такой товар с ТАКИМИ ЖЕ параметрами
            const existingItem = await prisma.cartItem.findFirst({
                where: {
                    cartId: cart.id,
                    productId: parsed.productId,
                    size: size,
                    color: color,
                },
            });

            if (existingItem) {
                // Если есть - увеличиваем количество
                await prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + parsed.quantity },
                });
            } else {
                // Если нет - создаем новый
                await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId: parsed.productId,
                        quantity: parsed.quantity,
                        size: size,
                        color: color,
                    },
                });
            }

            return await this.getByUser(userId);
        } catch (err) {
            if (err instanceof ApiError) throw err;
            console.error("Cart Service Error:", err);
            throw new ApiError("Failed to add item to cart", 500);
        }
    },

    async updateItemQuantity(userId: string, cartItemId: string, quantity: number) {
        try {
            await prisma.cartItem.update({
                where: { id: cartItemId },
                data: { quantity },
            });
            return await this.getByUser(userId);
        } catch (err) {
            throw new ApiError("Failed to update quantity", 500);
        }
    },

    async removeItem(userId: string, cartItemId: string) {
        try {
            await prisma.cartItem.delete({ where: { id: cartItemId } });
            return await this.getByUser(userId);
        } catch (err) {
            throw new ApiError("Failed to remove item", 500);
        }
    },

    async clear(userId: string) {
        try {
            const cart = await prisma.cart.findUnique({ where: { userId } });
            if (cart) {
                await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
            }
            return await this.getByUser(userId);
        } catch (err) {
            throw new ApiError("Failed to clear cart", 500);
        }
    },

    async getItemCount(userId: string): Promise<number> {
        const count = await prisma.cartItem.aggregate({
            where: { cart: { userId } },
            _sum: { quantity: true },
        });
        return count._sum.quantity ?? 0;
    }
};