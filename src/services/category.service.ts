import {CategorySchema, CategoryType} from "@/schemas/category.schema";
import { prisma } from "@/lib/prisma";

export const categoryService = {
    async getAll(): Promise<CategoryType[]> {
        const categories = await prisma.category.findMany({
            include: {
                products: true,
            },
            orderBy: { name: "asc" },
        });

        return categories.map(c => ({
            id: c.id,
            name: c.name,
        }));
    },

    async getById(id: string): Promise<CategoryType | null> {
        const category = await prisma.category.findUnique({
            where: { id },
            include: { products: true },
        });

        return category ? { id: category.id, name: category.name } : null;
    },

    async create(data: unknown): Promise<CategoryType> {
        const parsed = CategorySchema.parse(data);

        const existing = await prisma.category.findUnique({
            where: { name: parsed.name },
        });

        if (existing) throw new Error("Category with this name already exists");

        const created = await prisma.category.create({
            data: { name: parsed.name },
        });

        return { id: created.id, name: created.name }
    },

    async update(id: string, data: unknown): Promise<CategoryType> {
        const parsed = CategorySchema.partial().parse(data);

        const updated = await prisma.category.update({
            where: { id },
            data: parsed,
        });

        return { id: updated.id, name: updated.name };
    },

    async delete(id: string): Promise<void> {
        await prisma.category.delete({ where: { id } })
    },
};