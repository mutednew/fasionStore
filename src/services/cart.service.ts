import { prisma } from "@/lib/prisma";
import { CartItemSchema } from "@/schemas/cart.schema";
import { ApiError } from "@/lib/ApiError";

export const cartService = {
    async getByUser(userId: string) {
        try {
            const cart = await prisma.cart.findUnique({
                where: { userId },
                include: {
                    items: {
                        orderBy: { createdAt: "asc" },
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    imageUrl: true,
                                    images: true,
                                    category: true
                                }
                            }
                        },
                    },
                },
            });

            if (!cart) {
                return await prisma.cart.create({
                    data: { userId },
                    include: {
                        items: {
                            orderBy: { createdAt: "asc" },
                            include: {
                                product: {
                                    select: {
                                        id: true, name: true, price: true, imageUrl: true, images: true, category: true
                                    }
                                }
                            }
                        }
                    },
                });
            }

            return cart;
        } catch (err) {
            console.error(err);
            throw new ApiError("Failed to fetch cart", 500);
        }
    },

    async addItem(userId: string, data: unknown) {
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
                    size: parsed.size,
                    color: parsed.color,
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
                        size: parsed.size,
                        color: parsed.color,
                    },
                });
            }

            return await this.getByUser(userId);
        } catch (err) {
            if (err instanceof ApiError) throw err;
            console.error(err);
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
            throw new ApiError("Failed to update item quantity", 500);
        }
    },

    async removeItem(userId: string, cartItemId: string) {
        try {
            await prisma.cartItem.delete({ where: { id: cartItemId } });
            return await this.getByUser(userId);
        } catch (err) {
            throw new ApiError("Failed to remove item from cart", 500);
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