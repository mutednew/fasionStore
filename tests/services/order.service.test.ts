import { orderService } from "@/services/order.service";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/ApiError";
import { emailService } from "@/services/email.service";
import { promoService } from "@/services/promo.service";

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
            createMany: jest.fn(),
            deleteMany: jest.fn(),
        },
        cart: {
            findUnique: jest.fn(),
        },
        cartItem: {
            deleteMany: jest.fn(),
        },
        product: {
            update: jest.fn(),
        },
        $transaction: jest.fn((callback) => callback(require("@/lib/prisma").prisma)),
    },
}));

jest.mock("@/services/email.service", () => ({
    emailService: {
        sendReceipt: jest.fn(),
    },
}));

jest.mock("@/services/promo.service", () => ({
    promoService: {
        validatePromo: jest.fn(),
    },
}));

describe("orderService", () => {
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

    describe("createFromCart()", () => {
        const checkoutData = {
            email: "test@test.com",
            phone: "123",
            firstName: "John",
            lastName: "Doe",
            address: "Street",
            city: "City",
            country: "Country",
            zip: "00000",
        };

        const mockCart = {
            id: "cart1",
            userId: "u1",
            items: [
                {
                    productId: "p1",
                    quantity: 2,
                    product: { price: 100, salePrice: null }
                },
                {
                    productId: "p2",
                    quantity: 1,
                    product: { price: 50, salePrice: 40 }
                },
            ],
        };

        it("should create order successfully without promo", async () => {
            (prisma.cart.findUnique as jest.Mock).mockResolvedValue(mockCart);
            (prisma.order.create as jest.Mock).mockResolvedValue({ id: "newOrder1" });
            (prisma.order.findUnique as jest.Mock).mockResolvedValue({ id: "newOrder1", items: [] });

            await orderService.createFromCart("u1", checkoutData);

            expect(prisma.order.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    userId: "u1",
                    total: 240,
                })
            }));

            expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: "cart1" } });

            expect(emailService.sendReceipt).toHaveBeenCalled();
        });

        it("should apply PERCENT promo code correctly", async () => {
            (prisma.cart.findUnique as jest.Mock).mockResolvedValue(mockCart);
            (prisma.order.create as jest.Mock).mockResolvedValue({ id: "newOrder2" });
            (prisma.order.findUnique as jest.Mock).mockResolvedValue({ id: "newOrder2", items: [] });

            (promoService.validatePromo as jest.Mock).mockResolvedValue({
                type: "PERCENT",
                value: 10,
            });

            await orderService.createFromCart("u1", { ...checkoutData, promoCode: "SAVE10" });

            expect(prisma.order.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    total: 216,
                })
            }));

            expect(promoService.validatePromo).toHaveBeenCalledWith("SAVE10", "u1");
        });

        it("should apply FREE_SHIPPING promo correctly", async () => {
            const smallCart = {
                id: "cart2",
                userId: "u1",
                items: [{ productId: "p1", quantity: 1, product: { price: 100, salePrice: null } }],
            };
            (prisma.cart.findUnique as jest.Mock).mockResolvedValue(smallCart);
            (prisma.order.create as jest.Mock).mockResolvedValue({ id: "newOrder3" });
            (prisma.order.findUnique as jest.Mock).mockResolvedValue({ id: "newOrder3", items: [] });

            (promoService.validatePromo as jest.Mock).mockResolvedValue({
                type: "FREE_SHIPPING",
                value: 0,
            });

            await orderService.createFromCart("u1", { ...checkoutData, promoCode: "FREESHIP" });

            expect(prisma.order.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    total: 100,
                })
            }));
        });

        it("should throw 400 if cart is empty", async () => {
            (prisma.cart.findUnique as jest.Mock).mockResolvedValue({ items: [] });

            await expect(orderService.createFromCart("u1", checkoutData)).rejects.toThrow("Cart is empty");
        });
    });
});