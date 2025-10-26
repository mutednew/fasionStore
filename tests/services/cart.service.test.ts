import { cartService } from "@/services/cart.service";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/ApiError";
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

describe("cartService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getByUser()", () => {
        it("should return existing cart with items", async () => {
            (prisma.cart.findUnique as jest.Mock).mockResolvedValue({
                id: "c1",
                userId: "u1",
                items: [
                    { id: "i1", productId: "p1", quantity: 2 },
                    { id: "i2", productId: "p2", quantity: 1 },
                ],
            });

            const result = await cartService.getByUser("u1");

            expect(result).toEqual({
                id: "c1",
                userId: "u1",
                items: [
                    { id: "i1", productId: "p1", quantity: 2 },
                    { id: "i2", productId: "p2", quantity: 1 },
                ],
            });
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
                include: { items: { include: { product: true } } },
            });
            expect(result).toEqual({ id: "new1", userId: "u1", items: [] });
        });

        it("should throw ApiError on prisma failure", async () => {
            (prisma.cart.findUnique as jest.Mock).mockRejectedValue(new Error("DB fail"));
            await expect(cartService.getByUser("u1")).rejects.toThrow("Failed to fetch cart");
        });
    });

    describe("addItem()", () => {
        const parsedItem = { productId: "p1", quantity: 2 };

        beforeEach(() => {
            (CartItemSchema.parse as jest.Mock).mockReturnValue(parsedItem);
        });

        it("should add new item to cart", async () => {
            (prisma.cart.upsert as jest.Mock).mockResolvedValue({ id: "c1", userId: "u1" });
            (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue(null);
            (prisma.cartItem.create as jest.Mock).mockResolvedValue({});
            jest.spyOn(cartService, "getByUser").mockResolvedValue({
                id: "c1",
                userId: "u1",
                items: [{ id: "i1", productId: "p1", quantity: 2 }],
            });

            const result = await cartService.addItem("u1", parsedItem);

            expect(CartItemSchema.parse).toHaveBeenCalledWith(parsedItem);
            expect(prisma.cartItem.create).toHaveBeenCalledWith({
                data: { cartId: "c1", productId: "p1", quantity: 2 },
            });
            expect(result.items?.length).toBe(1);
        });

        it("should update quantity if item exists", async () => {
            (prisma.cart.upsert as jest.Mock).mockResolvedValue({ id: "c1", userId: "u1" });
            (prisma.cartItem.findFirst as jest.Mock).mockResolvedValue({
                id: "i1",
                quantity: 1,
            });
            (prisma.cartItem.update as jest.Mock).mockResolvedValue({});
            jest.spyOn(cartService, "getByUser").mockResolvedValue({
                id: "c1",
                userId: "u1",
                items: [{ id: "i1", productId: "p1", quantity: 3 }],
            });

            const result = await cartService.addItem("u1", parsedItem);

            expect(prisma.cartItem.update).toHaveBeenCalledWith({
                where: { id: "i1" },
                data: { quantity: 3 },
            });
            expect(result.items?.[0].quantity).toBe(3);
        });

        it("should throw ApiError if prisma fails", async () => {
            (prisma.cart.upsert as jest.Mock).mockRejectedValue(new Error("DB fail"));
            await expect(cartService.addItem("u1", parsedItem)).rejects.toThrow(
                "Failed to add item to cart"
            );
        });
    });

    describe("updateItemQuantity()", () => {
        it("should update item quantity", async () => {
            (prisma.cartItem.update as jest.Mock).mockResolvedValue({});
            jest.spyOn(cartService, "getByUser").mockResolvedValue({
                id: "c1",
                userId: "u1",
                items: [{ id: "i1", productId: "p1", quantity: 5 }],
            });

            const result = await cartService.updateItemQuantity("u1", "i1", 5);

            expect(prisma.cartItem.update).toHaveBeenCalledWith({
                where: { id: "i1" },
                data: { quantity: 5 },
            });
            expect(result.items?.[0].quantity).toBe(5);
        });

        it("should throw ApiError on failure", async () => {
            (prisma.cartItem.update as jest.Mock).mockRejectedValue(new Error("DB fail"));
            await expect(cartService.updateItemQuantity("u1", "i1", 3)).rejects.toThrow(
                "Failed to update item quantity"
            );
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

        it("should throw ApiError on prisma error", async () => {
            (prisma.cartItem.delete as jest.Mock).mockRejectedValue(new Error("DB fail"));
            await expect(cartService.removeItem("u1", "i1")).rejects.toThrow(
                "Failed to remove item from cart"
            );
        });
    });

    describe("clear()", () => {
        it("should clear items if cart exists", async () => {
            (prisma.cart.findUnique as jest.Mock).mockResolvedValue({ id: "c1" });
            (prisma.cartItem.deleteMany as jest.Mock).mockResolvedValue({});

            await cartService.clear("u1");

            expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
                where: { cartId: "c1" },
            });
        });

        it("should do nothing if cart not found", async () => {
            (prisma.cart.findUnique as jest.Mock).mockResolvedValue(null);
            await cartService.clear("u1");
            expect(prisma.cartItem.deleteMany).not.toHaveBeenCalled();
        });

        it("should throw ApiError on failure", async () => {
            (prisma.cart.findUnique as jest.Mock).mockRejectedValue(new Error("DB fail"));
            await expect(cartService.clear("u1")).rejects.toThrow("Failed to clear cart");
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

        it("should return 0 if sum is null", async () => {
            (prisma.cartItem.aggregate as jest.Mock).mockResolvedValue({
                _sum: { quantity: null },
            });

            const result = await cartService.getItemCount("u1");
            expect(result).toBe(0);
        });

        it("should throw ApiError on prisma failure", async () => {
            (prisma.cartItem.aggregate as jest.Mock).mockRejectedValue(new Error("DB fail"));
            await expect(cartService.getItemCount("u1")).rejects.toThrow(
                "Failed to get item count from cart"
            );
        });
    });
});
