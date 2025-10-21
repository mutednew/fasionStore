import { orderService } from "@/services/order.service";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/ApiError";
import { CartSchema } from "@/schemas/cart.schema"

// Мокаем prisma
jest.mock("@/lib/prisma", () => ({
    prisma: {
        order: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        orderItem: {
            deleteMany: jest.fn(),
        },
    },
}));

jest.mock("@/schemas/cart.schema", () => ({
    CartSchema: {
        parse: jest.fn(),
    },
}));

jest.mock("@/lib/transformers", () => ({
    toPlainOrder: jest.fn((order) => order),
}));

describe("🧪 orderService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll()", () => {
        it("should return all orders", async () => {
            (prisma.order.findMany as jest.Mock).mockResolvedValue([
                { id: "1", userId: "u1", items: [] },
            ]);

            const result = await orderService.getAll();

            expect(prisma.order.findMany).toHaveBeenCalled();
            expect(result).toEqual([{ id: "1", userId: "u1", items: [] }]);
        });

        it("should throw ApiError on database error", async () => {
            (prisma.order.findMany as jest.Mock).mockRejectedValue(new Error("DB error"));

            await expect(orderService.getAll()).rejects.toThrow(ApiError);
            await expect(orderService.getAll()).rejects.toThrow("Failed to fetch orders");
        });
    });

    describe("getById()", () => {
        it("should return order if found", async () => {
            (prisma.order.findUnique as jest.Mock).mockResolvedValue({ id: "1", userId: "u1" });

            const result = await orderService.getById("1");

            expect(prisma.order.findUnique).toHaveBeenCalledWith({
                where: { id: "1" },
                include: {
                    items: { include: { product: true } },
                    user: true,
                },
            });
            expect(result).toEqual({ id: "1", userId: "u1" });
        });

        it("should throw 404 if order not found", async () => {
            (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(orderService.getById("404")).rejects.toThrow("Order not found");
        });

        it("should throw 500 on unexpected error", async () => {
            (prisma.order.findUnique as jest.Mock).mockRejectedValue(new Error("DB fail"));

            await expect(orderService.getById("1")).rejects.toThrow("Failed to fetch order");
        });
    });

    describe("getByUser()", () => {
        it("should return all user orders", async () => {
            (prisma.order.findMany as jest.Mock).mockResolvedValue([
                { id: "1", userId: "u1", items: [] },
            ]);

            const result = await orderService.getByUser("u1");

            expect(prisma.order.findMany).toHaveBeenCalledWith({
                where: { userId: "u1" },
                include: { items: { include: { product: true } } },
                orderBy: { createdAt: "desc" },
            });
            expect(result).toEqual([{ id: "1", userId: "u1", items: [] }]);
        });

        it("should throw ApiError on failure", async () => {
            (prisma.order.findMany as jest.Mock).mockRejectedValue(new Error("oops"));
            await expect(orderService.getByUser("u1")).rejects.toThrow("Failed to fetch orders for user");
        });
    });

    describe("createFromCart()", () => {
        const validCart = {
            userId: "u1",
            items: [
                { productId: "p1", quantity: 2, price: 0 },
                { productId: "p2", quantity: 1, price: 0 },
            ],
        };

        beforeEach(() => {
            (CartSchema.parse as jest.Mock).mockReset();
        });

        it("should create order from cart", async () => {
            (CartSchema.parse as jest.Mock).mockReturnValue(validCart);
            (prisma.order.create as jest.Mock).mockResolvedValue({
                id: "o1",
                userId: "u1",
                status: "PENDING",
                items: [],
            });

            const result = await orderService.createFromCart(validCart);

            expect(CartSchema.parse).toHaveBeenCalledWith(validCart);
            expect(prisma.order.create).toHaveBeenCalled();
            expect(result).toHaveProperty("id", "o1");
        });

        it("should throw 400 if cart empty", async () => {
            (CartSchema.parse as jest.Mock).mockReturnValue({
                userId: "u1",
                items: [],
            });

            await expect(orderService.createFromCart({})).rejects.toThrow("Cart is empty");
        });

        it("should throw 500 if prisma fails", async () => {
            (CartSchema.parse as jest.Mock).mockReturnValue(validCart);
            (prisma.order.create as jest.Mock).mockRejectedValue(new Error("DB fail"));

            await expect(orderService.createFromCart(validCart)).rejects.toThrow(
                "Failed to create order from cart"
            );
        });
    });

    describe("updateStatus()", () => {
        it("should update order status", async () => {
            (prisma.order.update as jest.Mock).mockResolvedValue({
                id: "o1",
                status: "PAID",
            });

            const result = await orderService.updateStatus("o1", "PAID");

            expect(prisma.order.update).toHaveBeenCalledWith({
                where: { id: "o1" },
                data: { status: "PAID" },
                include: { items: { include: { product: true } } },
            });
            expect(result.status).toBe("PAID");
        });

        it("should throw ApiError if update fails", async () => {
            (prisma.order.update as jest.Mock).mockRejectedValue(new Error("DB fail"));
            await expect(orderService.updateStatus("o1", "PAID")).rejects.toThrow(
                "Failed to update order status"
            );
        });
    });

    describe("delete()", () => {
        it("should delete existing order", async () => {
            (prisma.order.findUnique as jest.Mock).mockResolvedValue({
                id: "o1",
                items: [{ id: "i1" }],
            });
            (prisma.orderItem.deleteMany as jest.Mock).mockResolvedValue({});
            (prisma.order.delete as jest.Mock).mockResolvedValue({});

            await orderService.delete("o1");

            expect(prisma.orderItem.deleteMany).toHaveBeenCalledWith({
                where: { orderId: "o1" },
            });
            expect(prisma.order.delete).toHaveBeenCalledWith({
                where: { id: "o1" },
            });
        });

        it("should throw 404 if order not found", async () => {
            (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);
            await expect(orderService.delete("404")).rejects.toThrow("Order not found");
        });

        it("should throw 500 on prisma error", async () => {
            (prisma.order.findUnique as jest.Mock).mockRejectedValue(new Error("DB fail"));
            await expect(orderService.delete("o1")).rejects.toThrow("Failed to delete order");
        });
    });
});