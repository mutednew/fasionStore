import { categoryService } from "@/services/category.service";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/ApiError";
import { CategorySchema } from "@/schemas/category.schema";

// 🔧 Моки
jest.mock("@/lib/prisma", () => ({
    prisma: {
        category: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

jest.mock("@/schemas/category.schema", () => ({
    CategorySchema: {
        parse: jest.fn(),
        partial: jest.fn().mockReturnValue({
            parse: jest.fn(),
        }),
    },
}));

describe("🧪 categoryService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll()", () => {
        it("should return all categories", async () => {
            (prisma.category.findMany as jest.Mock).mockResolvedValue([
                { id: "1", name: "Books" },
                { id: "2", name: "Toys" },
            ]);

            const result = await categoryService.getAll();

            expect(prisma.category.findMany).toHaveBeenCalledWith({
                include: { products: true },
                orderBy: { name: "asc" },
            });
            expect(result).toEqual([
                { id: "1", name: "Books" },
                { id: "2", name: "Toys" },
            ]);
        });

        it("should throw ApiError on failure", async () => {
            (prisma.category.findMany as jest.Mock).mockRejectedValue(new Error("DB fail"));
            await expect(categoryService.getAll()).rejects.toThrow("Failed to fetch categories");
        });
    });

    describe("getById()", () => {
        it("should return category if found", async () => {
            (prisma.category.findUnique as jest.Mock).mockResolvedValue({
                id: "1",
                name: "Books",
            });

            const result = await categoryService.getById("1");

            expect(prisma.category.findUnique).toHaveBeenCalledWith({
                where: { id: "1" },
                include: { products: true },
            });
            expect(result).toEqual({ id: "1", name: "Books" });
        });

        it("should throw 404 if not found", async () => {
            (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);
            await expect(categoryService.getById("404")).rejects.toThrow("Category not found");
        });

        it("should throw 500 on unexpected error", async () => {
            (prisma.category.findUnique as jest.Mock).mockRejectedValue(new Error("DB fail"));
            await expect(categoryService.getById("1")).rejects.toThrow("Failed to fetch category");
        });
    });

    describe("getByName()", () => {
        it("should return category by name", async () => {
            (prisma.category.findUnique as jest.Mock).mockResolvedValue({
                id: "1",
                name: "Books",
            });

            const result = await categoryService.getByName("Books");

            expect(prisma.category.findUnique).toHaveBeenCalledWith({
                where: { name: "Books" },
            });
            expect(result).toEqual({ id: "1", name: "Books" });
        });

        it("should return null if not found", async () => {
            (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);
            const result = await categoryService.getByName("Unknown");
            expect(result).toBeNull();
        });

        it("should throw 500 on failure", async () => {
            (prisma.category.findUnique as jest.Mock).mockRejectedValue(new Error("DB fail"));
            await expect(categoryService.getByName("Books")).rejects.toThrow(
                "Failed to fetch category by name"
            );
        });
    });

    describe("create()", () => {
        const parsedCategory = { name: "Books" };

        beforeEach(() => {
            (CategorySchema.parse as jest.Mock).mockReturnValue(parsedCategory);
        });

        it("should create a new category", async () => {
            (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.category.create as jest.Mock).mockResolvedValue({
                id: "1",
                name: "Books",
            });

            const result = await categoryService.create(parsedCategory);

            expect(CategorySchema.parse).toHaveBeenCalledWith(parsedCategory);
            expect(prisma.category.create).toHaveBeenCalledWith({
                data: { name: "Books" },
            });
            expect(result).toEqual({ id: "1", name: "Books" });
        });

        it("should throw 409 if category already exists", async () => {
            (prisma.category.findUnique as jest.Mock).mockResolvedValue({
                id: "1",
                name: "Books",
            });

            await expect(categoryService.create(parsedCategory)).rejects.toThrow(
                "Category with this name already exists"
            );
        });

        it("should throw 500 if prisma fails", async () => {
            (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.category.create as jest.Mock).mockRejectedValue(new Error("DB fail"));

            await expect(categoryService.create(parsedCategory)).rejects.toThrow(
                "Failed to create category"
            );
        });
    });

    describe("update()", () => {
        const mockPartial = { parse: jest.fn() };

        beforeEach(() => {
            (CategorySchema.partial as jest.Mock).mockReturnValue(mockPartial);
        });

        it("should update category", async () => {
            mockPartial.parse.mockReturnValue({ name: "Updated" });
            (prisma.category.update as jest.Mock).mockResolvedValue({
                id: "1",
                name: "Updated",
            });

            const result = await categoryService.update("1", { name: "Updated" });

            expect(prisma.category.update).toHaveBeenCalledWith({
                where: { id: "1" },
                data: { name: "Updated" },
            });
            expect(result).toEqual({ id: "1", name: "Updated" });
        });

        it("should throw ApiError if update fails", async () => {
            mockPartial.parse.mockReturnValue({ name: "Updated" });
            (prisma.category.update as jest.Mock).mockRejectedValue(new Error("DB fail"));

            await expect(categoryService.update("1", { name: "Updated" })).rejects.toThrow(
                "Failed to update category"
            );
        });
    });

    describe("delete()", () => {
        it("should delete existing category", async () => {
            (prisma.category.findUnique as jest.Mock).mockResolvedValue({ id: "1", name: "Books" });
            (prisma.category.delete as jest.Mock).mockResolvedValue({});

            await categoryService.delete("1");

            expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: "1" } });
        });

        it("should throw 404 if not found", async () => {
            (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);
            await expect(categoryService.delete("404")).rejects.toThrow("Category not found");
        });

        it("should throw 500 on prisma error", async () => {
            (prisma.category.findUnique as jest.Mock).mockRejectedValue(new Error("DB fail"));
            await expect(categoryService.delete("1")).rejects.toThrow("Failed to delete category");
        });
    });
});