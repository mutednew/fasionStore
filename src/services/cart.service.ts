import { prisma } from "@/lib/prisma";
import { CartItemSchema, CartType } from "@/schemas/cart.schema";
import { ApiError } from "@/lib/ApiError";

export const cartService = {
    async getByUser(userId: string): Promise<CartType> {
        try {
            const cart = await prisma.cart.findUnique({
                where: { userId },
                include: {
                    items: {
                        include: { product: { include: { category: true } } },
                    },
                },
            });

            if (!cart) {
                const newCart = await prisma.cart.create({
                    data: { userId },
                    include: { items: { include: { product: true } } },
                });
                return {
                    id: newCart.id,
                    userId: newCart.userId,
                    items: [],
                };
            }

            return {
                id: cart.id,
                userId: cart.userId,
                items: cart.items.map((item) => ({
                    id: item.id,
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            };
        } catch (err) {
            throw new ApiError("Failed to fetch cart", 500);
        }
    },

    async addItem(userId: string, data: unknown): Promise<CartType> {
        try {
            const parsed = CartItemSchema.parse(data);

            const cart = await prisma.cart.upsert({
                where: { userId },
                update: {},
                create: { userId },
            });

            const existingItem = await prisma.cartItem.findFirst({
                where: {
                    cartId: cart.id,
                    productId: parsed.productId,
                },
            });

            if (existingItem) {
                await prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + parsed.quantity },
                });
            } else {
                await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId: parsed.productId,
                        quantity: parsed.quantity,
                    },
                });
            }

            return await this.getByUser(userId);
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new ApiError("Failed to add item to cart", 500);
        }
    },

    async updateItemQuantity(
        userId: string,
        cartItemId: string,
        quantity: number
    ): Promise<CartType> {
        try {
            await prisma.cartItem.update({
                where: { id: cartItemId },
                data: { quantity },
            });

            return await this.getByUser(userId);
        } catch (err) {
            throw new ApiError("Failed to update item quantity", 500);
        }
    },

    async removeItem(userId: string, cartItemId: string): Promise<CartType> {
        try {
            await prisma.cartItem.delete({ where: { id: cartItemId } });
            return await this.getByUser(userId);
        } catch (err) {
            throw new ApiError("Failed to remove item from cart", 500);
        }
    },

    async clear(userId: string): Promise<void> {
        try {
            const cart = await prisma.cart.findUnique({ where: { userId } });
            if (cart) {
                await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
            }
        } catch (err) {
            throw new ApiError("Failed to clear cart", 500);
        }
    },

    async getItemCount(userId: string): Promise<number> {
        try {
            const count = await prisma.cartItem.aggregate({
                where: { cart: { userId } },
                _sum: { quantity: true },
            });
            return count._sum.quantity ?? 0;
        } catch (err) {
            throw new ApiError("Failed to get item count from cart", 500);
        }
    },
};