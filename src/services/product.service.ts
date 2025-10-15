import {ProductSchema, ProductType} from "@/schemas/product.schema";
import { prisma } from "@/lib/prisma";

export const productService = {
    async getAll(categoryId: string): Promise<ProductType[]> {
        const products = await prisma.product.findMany({
            where: categoryId ? { categoryId } : {},
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });

        return products as ProductType[];
    },

    async getById(id: string): Promise<ProductType | null> {
        return prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });
    },

    async create(data: unknown): Promise<ProductType> {
        const parsed = ProductSchema.parse(data);

        const product = await prisma.product.create({
            data: {
                name: parsed.name,
                price: parsed.price,
                stock: parsed.stock,
                imageUrl: parsed.imageUrl,
                categoryId: parsed.categoryId,
            },
        });

        return product;
    },

    async update(id: string, data: unknown): Promise<ProductType> {
        const parsed = ProductSchema.partial().parse(data);

        const updated = await prisma.product.update({
            where: { id },
            data: parsed,
        });

        return updated;
    },

    async delete(id: string): Promise<void> {
        await prisma.product.delete({ where: { id } });
    },
};