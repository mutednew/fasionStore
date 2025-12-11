import { productService } from "@/services/product.service";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/ApiError";

jest.mock("@/lib/prisma", () => ({
    prisma: {
        product: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        $transaction: jest.fn((promises) => Promise.all(promises)),
    },
}));

jest.mock("@/lib/transformers", () => ({
    toPlainProduct: (p: any) => ({ ...p, price: Number(p.price) }),
}));

describe("productService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll()", () => {
        it("should return products with meta", async () => {
            const mockProducts = [
                { id: "1", name: "A", price: 10 },
                { id: "2", name: "B", price: 20 },
            ];
            const mockCount = 2;

            (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
            (prisma.product.count as jest.Mock).mockResolvedValue(mockCount);

            const result = await productService.getAll({ page: 1, limit: 10 });

            expect(prisma.product.findMany).toHaveBeenCalled();
            expect(prisma.product.count).toHaveBeenCalled();

            expect(result).toHaveProperty("products");
            expect(result).toHaveProperty("meta");
            expect(result.products.length).toBe(2);
            expect(result.meta.total).toBe(2);
        });

        it("should throw ApiError on database error", async () => {
            (prisma.product.findMany as jest.Mock).mockRejectedValue(new Error("DB error"));

            await expect(productService.getAll()).rejects.toThrow(ApiError);
        });
    });

    describe("getById()", () => {
        it("should return product if found", async () => {
            const mockProduct = { id: "1", name: "Test", price: 100 };
            (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

            const result = await productService.getById("1");

            expect(result).not.toBeNull();
            expect(result!.name).toBe("Test");
        });

        it("should throw 404 if not found", async () => {
            (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);
            await expect(productService.getById("999")).rejects.toThrow("Product not found");
        });
    });

    describe("create()", () => {
        it("should create a new product", async () => {
            const inputData = {
                name: "Created Product",
                price: 150,
                stock: 10,
                imageUrl: "https://example.com/image.png",
                categoryId: undefined,
            };

            (prisma.product.create as jest.Mock).mockResolvedValue({
                id: "1",
                ...inputData,
                createdAt: new Date(),
                updatedAt: new Date(),
                category: null,
            });

            const result = await productService.create(inputData);

            expect(result.name).toBe("Created Product");
            expect(result.price).toBe(150);
            expect(prisma.product.create).toHaveBeenCalled();
        });
    });

    describe("update()", () => {
        it("should update existing product", async () => {
            (prisma.product.findUnique as jest.Mock).mockResolvedValue({ id: "1", categoryId: null });
            (prisma.product.update as jest.Mock).mockResolvedValue({
                id: "1",
                name: "Updated",
                price: 200,
            });

            const result = await productService.update("1", { name: "Updated", price: 200 });
            expect(result.name).toBe("Updated");
        });

        it("should throw 404 if product not found", async () => {
            (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);
            await expect(productService.update("999", { name: "X" })).rejects.toThrow("Product not found");
        });
    });

    describe("delete()", () => {
        it("should delete existing product", async () => {
            (prisma.product.findUnique as jest.Mock).mockResolvedValue({ id: "1" });
            (prisma.product.delete as jest.Mock).mockResolvedValue({});

            await expect(productService.delete("1")).resolves.not.toThrow();
            expect(prisma.product.delete).toHaveBeenCalled();
        });

        it("should throw 404 if product not found", async () => {
            (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);
            await expect(productService.delete("999")).rejects.toThrow("Product not found");
        });
    });

    describe("bulkDiscount()", () => {
        it("should apply discount to selected products", async () => {
            const ids = ["1", "2"];
            const discountPercent = 20;

            (prisma.product.findMany as jest.Mock).mockResolvedValue([
                { id: "1", price: 100 },
                { id: "2", price: 200 },
            ]);

            (prisma.product.update as jest.Mock).mockResolvedValue({});

            const result = await productService.bulkDiscount(ids, discountPercent);

            expect(prisma.product.findMany).toHaveBeenCalledWith({
                where: { id: { in: ids } },
                select: { id: true, price: true }
            });

            expect(prisma.product.update).toHaveBeenCalledTimes(2);

            expect(result).toHaveProperty("count", 2);
        });

        it("should calculate sale price correctly", async () => {
            const ids = ["1"];
            const discountPercent = 50;

            (prisma.product.findMany as jest.Mock).mockResolvedValue([
                { id: "1", price: 100 },
            ]);

            await productService.bulkDiscount(ids, discountPercent);

            expect(prisma.product.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: "1" },
                data: expect.objectContaining({
                    salePrice: 50
                })
            }));
        });
    });
});