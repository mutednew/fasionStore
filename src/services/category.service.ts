import { CategorySchema, CategoryType } from "@/schemas/category.schema";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/ApiError";

export const categoryService = {
    async getAll(): Promise<CategoryType[]> {
        try {
            const categories = await prisma.category.findMany({
                include: {
                    products: true,
                },
                orderBy: { name: "asc" },
            });

            return categories.map((c) => ({
                id: c.id,
                name: c.name,
            }));
        } catch (err) {
            throw new ApiError("Failed to fetch categories", 500);
        }
    },

    async getById(id: string): Promise<CategoryType | null> {
        try {
            const category = await prisma.category.findUnique({
                where: { id },
                include: { products: true },
            });

            if (!category) {
                throw new ApiError("Category not found", 404);
            }

            return { id: category.id, name: category.name };
        } catch (err) {
            if (err instanceof ApiError) {
                throw err; // Перенаправляем уже выброшенную ошибку
            }
            throw new ApiError("Failed to fetch category", 500);
        }
    },

    async getByName(name: string): Promise<CategoryType | null> {
        try {
            const category = await prisma.category.findUnique({
                where: { name },
            });

            return category ? { id: category.id, name: category.name } : null;
        } catch (err) {
            throw new ApiError("Failed to fetch category by name", 500);
        }
    },

    async create(data: unknown): Promise<CategoryType> {
        try {
            const parsed = CategorySchema.parse(data);

            const existing = await prisma.category.findUnique({
                where: { name: parsed.name },
            });

            if (existing) {
                throw new ApiError("Category with this name already exists", 409); // 409 — Conflict
            }

            const created = await prisma.category.create({
                data: { name: parsed.name },
            });

            return { id: created.id, name: created.name };
        } catch (err) {
            if (err instanceof ApiError) {
                throw err; // Перенаправляем уже выброшенную ошибку
            }
            throw new ApiError("Failed to create category", 500);
        }
    },

    async update(id: string, data: unknown): Promise<CategoryType> {
        try {
            const parsed = CategorySchema.partial().parse(data);

            const updated = await prisma.category.update({
                where: { id },
                data: parsed,
            });

            return { id: updated.id, name: updated.name };
        } catch (err) {
            throw new ApiError("Failed to update category", 500);
        }
    },

    async delete(id: string): Promise<void> {
        try {
            const category = await prisma.category.findUnique({
                where: { id },
            });

            if (!category) {
                throw new ApiError("Category not found", 404);
            }

            await prisma.category.delete({ where: { id } });
        } catch (err) {
            if (err instanceof ApiError) {
                throw err; // Перенаправляем уже выброшенную ошибку
            }
            throw new ApiError("Failed to delete category", 500);
        }
    },
};