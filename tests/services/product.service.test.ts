import { productService } from "@/services/product.service";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/ApiError";

// Мокаем prisma
jest.mock("@/lib/prisma", () => ({
    prisma: {
        product: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

// Мокаем toPlainProduct
jest.mock("@/lib/transformers", () => ({
    toPlainProduct: (p: any) => ({ ...p, price: Number(p.price) }),
}));

describe("🧪 productService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll()", () => {
        it("should return all products", async () => {
            const mockProducts = [
                { id: "1", name: "A", price: 10 },
                { id: "2", name: "B", price: 20 },
            ];
            (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

            const result = await productService.getAll();

            expect(prisma.product.findMany).toHaveBeenCalled();
            expect(result.length).toBe(2);
            expect(result[0].name).toBe("A");
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
            (prisma.product.findFirst as jest.Mock).mockResolvedValue(null);

            (prisma.product.create as jest.Mock).mockResolvedValue({
                id: "1",
                name: "Created Product",
                price: 150,
                stock: 10,
                imageUrl: "https://example.com/image.png", // ✅ строка, а не null
                categoryId: "a34e764a-2a60-418f-9df3-537a8a646f41",
                createdAt: new Date(),
                updatedAt: new Date(),
                category: { id: "a34e764a-2a60-418f-9df3-537a8a646f41", name: "Test Category" },
            });

            const result = await productService.create({
                name: "Created Product",
                price: 150,
                stock: 10,
                imageUrl: "https://example.com/image.png", // ✅ строка, не null
                categoryId: "a34e764a-2a60-418f-9df3-537a8a646f41",
            });

            expect(result).not.toBeNull();
            expect(result.name).toBe("Created Product");
            expect(result.price).toBe(150);
            expect(prisma.product.create).toHaveBeenCalledTimes(1);
        });
    });

    describe("update()", () => {
        it("should update existing product", async () => {
            (prisma.product.findUnique as jest.Mock).mockResolvedValue({ id: "1" });
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
});