import { Decimal } from "@prisma/client/runtime/library";
import { toPlainProduct, toPlainOrder } from "@/lib/transformers";

describe("🧪 transformers", () => {
    describe("toPlainProduct()", () => {
        it("should correctly transform product with Decimal price", () => {
            const prismaProduct = {
                id: "p1",
                name: "Book",
                price: new Decimal(49.99),
                stock: 10,
                imageUrl: null,
                categoryId: null,
                createdAt: new Date("2024-01-01"),
                updatedAt: new Date("2024-02-01"),
                category: { id: "c1", name: "Books" },
            };

            const result = toPlainProduct(prismaProduct as any);

            expect(result).toEqual({
                id: "p1",
                name: "Book",
                price: 49.99,
                stock: 10,
                imageUrl: undefined,
                categoryId: undefined,
                createdAt: new Date("2024-01-01"),
                updatedAt: new Date("2024-02-01"),
            });
        });

        it("should handle number price without Decimal", () => {
            const prismaProduct = {
                id: "p2",
                name: "Toy",
                price: 15,
                stock: 5,
                imageUrl: "img.png",
                categoryId: "cat123",
                createdAt: new Date(),
                updatedAt: new Date(),
                category: { id: "cat123", name: "Toys" },
            };

            const result = toPlainProduct(prismaProduct as any);

            expect(result.price).toBe(15);
            expect(result.imageUrl).toBe("img.png");
            expect(result.categoryId).toBe("cat123");
        });
    });

    describe("toPlainOrder()", () => {
        it("should correctly transform order with items", () => {
            const prismaOrder = {
                id: "o1",
                userId: "u1",
                status: "PENDING",
                createdAt: new Date("2024-01-10"),
                items: [
                    {
                        id: "i1",
                        productId: "p1",
                        quantity: 2,
                        price: new Decimal(20),
                        product: { id: "p1", name: "Book", price: new Decimal(20) },
                    },
                    {
                        id: "i2",
                        productId: "p2",
                        quantity: 1,
                        price: new Decimal(10),
                        product: { id: "p2", name: "Toy", price: new Decimal(10) },
                    },
                ],
            };

            const result = toPlainOrder(prismaOrder as any);

            expect(result).toEqual({
                id: "o1",
                userId: "u1",
                status: "PENDING",
                createdAt: new Date("2024-01-10"),
                items: [
                    { id: "i1", productId: "p1", quantity: 2, price: 20 },
                    { id: "i2", productId: "p2", quantity: 1, price: 10 },
                ],
            });
        });

        it("should handle numeric price values (non-Decimal)", () => {
            const prismaOrder = {
                id: "o2",
                userId: "u2",
                status: "PAID",
                createdAt: new Date("2024-03-15"),
                items: [
                    {
                        id: "i1",
                        productId: "p5",
                        quantity: 3,
                        price: 99,
                        product: { id: "p5", name: "Chair", price: 99 },
                    },
                ],
            };

            const result = toPlainOrder(prismaOrder as any);
            expect(result.items?.[0].price).toBe(99);
            expect(result.status).toBe("PAID");
        });
    });
});