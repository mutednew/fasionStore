import { cartService } from "@/services/cart.service";
import { prisma } from "@/lib/prisma";
import { CartItemSchema } from "@/schemas/cart.schema";

jest.mock("@/lib/prisma", () => ({
    prisma: {
        cart: {
            findUnique: jest.fn(),
            create: jest.fn(),
            upsert: jest.fn(),
        },
        cartItem: {
            findFirst: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
            aggregate: jest.fn(),
        },
    },
}));

jest.mock("@/schemas/cart.schema", () => ({
    CartItemSchema: {
        parse: jest.fn(),
    },
}));

const mockCartItem = (
    id: string,
    productId: string,
    quantity: number,
    size?: string,
    color?: string
) => ({
    id,
    cartId: "c1",
    productId,
    quantity,
    size: size || null,
    color: color || null,
    createdAt: new Date(),
    updatedAt: new Date(),
    product: {
        id: productId,
        name: "Mock Product",
        price: 100,
        imageUrl: "http://img.com/1.jpg",
        images: [],
        category: { id: "cat1", name: "Category" }
    }
});

describe("cartService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getByUser()", () => {
        it("should return existing cart with items and product details", async () => {
            (prisma.cart.findUnique as jest.Mock).mockResolvedValue({
                id: "c1",
                userId: "u1",
                items: [
                    mockCartItem("i1", "p1", 2, "M", "Red"),
                    mockCartItem("i2", "p2", 1, "L", "Blue"),
                ],
            });

            const result = await cartService.getByUser("u1");

            expect(result?.items).toHaveLength(2);
            expect(result?.items[0].product.name).toBe("Mock Product");
            expect(result?.items[0].size).toBe("M");
        });

        it("should create new cart if not exists", async () => {
            (prisma.cart.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.cart.create as jest.Mock).mockResolvedValue({
                id: "new1",
                userId: "u1",
                items: [],
            });

            const result = await cartService.getByUser("u1");

            expect(prisma.cart.create).toHaveBeenCalledWith({
                data: { userId: "u1" },
                include: {
                    items: {
                        orderBy: { createdAt: 'asc' },
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
            expect(result).toEqual({ id: "new1", userId: "u1", items: [] });
        });

        it("should throw ApiError on prisma failure", async () => {
            (prisma.cart.findUnique as jest.Mock).mockRejectedValue(new Error("DB fail"));
            await expect(cartService.getByUser("u1")).rejects.toThrow("Failed to fetch cart");
        });
    });

    describe("addItem()", () => {
        const parsedItem = { productId: "p1", quantity: 2, size: "M", color: "Red" };

        beforeEach(() => {
            (CartItemSchema.parse as jest.Mock).mockReturnValue(parsedItem);
        });

        it("should add new item to cart with size and color", async () => {
            (prisma.cart.upsert as jest.Mock).mockResolvedValue({ id: "c1", userId: "u1" });
            (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null);
            (prisma.cartItem.create as jest.Mock).mockResolvedValue({});

            jest.spyOn(cartService, "getByUser").mockResolvedValue({
                id: "c1",
                userId: "u1",
                items: [mockCartItem("i1", "p1", 2, "M", "Red")] as any,
            });

            const result = await cartService.addItem("u1", parsedItem);

            expect(CartItemSchema.parse).toHaveBeenCalledWith(parsedItem);

            expect(prisma.cartItem.create).toHaveBeenCalledWith({
                data: {
                    cartId: "c1",
                    productId: "p1",
                    quantity: 2,
                    size: "M",
                    color: "Red"
                },
            });
            expect(result.items?.length).toBe(1);
        });

        it("should update quantity if item with same size/color exists", async () => {
            (prisma.cart.upsert as jest.Mock).mockResolvedValue({ id: "c1", userId: "u1" });

            (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue({
                id: "i1",
                quantity: 1,
                size: "M",
                color: "Red"
            });
            (prisma.cartItem.update as jest.Mock).mockResolvedValue({});

            jest.spyOn(cartService, "getByUser").mockResolvedValue({
                id: "c1",
                userId: "u1",
                items: [mockCartItem("i1", "p1", 3, "M", "Red")] as any,
            });

            const result = await cartService.addItem("u1", parsedItem);

            expect(prisma.cartItem.findFirst).toHaveBeenCalledWith({
                where: {
                    cartId: "c1",
                    productId: "p1",
                    size: "M",
                    color: "Red"
                }
            });

            expect(prisma.cartItem.update).toHaveBeenCalledWith({
                where: { id: "i1" },
                data: { quantity: 1 + 2 },
            });
        });
    });

    describe("updateItemQuantity()", () => {
        it("should update item quantity", async () => {
            (prisma.cartItem.update as jest.Mock).mockResolvedValue({});

            jest.spyOn(cartService, "getByUser").mockResolvedValue({
                id: "c1",
                userId: "u1",
                items: [mockCartItem("i1", "p1", 5, "M", "Red")] as any,
            });

            const result = await cartService.updateItemQuantity("u1", "i1", 5);

            expect(prisma.cartItem.update).toHaveBeenCalledWith({
                where: { id: "i1" },
                data: { quantity: 5 },
            });
            expect(result.items?.[0].quantity).toBe(5);
        });
    });

    describe("removeItem()", () => {
        it("should remove item and return updated cart", async () => {
            (prisma.cartItem.delete as jest.Mock).mockResolvedValue({});
            jest.spyOn(cartService, "getByUser").mockResolvedValue({
                id: "c1",
                userId: "u1",
                items: [],
            });

            const result = await cartService.removeItem("u1", "i1");

            expect(prisma.cartItem.delete).toHaveBeenCalledWith({ where: { id: "i1" } });
            expect(result.items).toEqual([]);
        });
    });

    describe("clear()", () => {
        it("should clear items if cart exists", async () => {
            (prisma.cart.findUnique as jest.Mock).mockResolvedValue({ id: "c1" });
            (prisma.cartItem.deleteMany as jest.Mock).mockResolvedValue({});

            jest.spyOn(cartService, "getByUser").mockResolvedValue({
                id: "c1", userId: "u1", items: []
            });

            await cartService.clear("u1");

            expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
                where: { cartId: "c1" },
            });
        });
    });

    describe("getItemCount()", () => {
        it("should return total quantity sum", async () => {
            (prisma.cartItem.aggregate as jest.Mock).mockResolvedValue({
                _sum: { quantity: 5 },
            });

            const result = await cartService.getItemCount("u1");
            expect(result).toBe(5);
        });
    });
});