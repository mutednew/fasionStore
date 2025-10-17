import { ProductSchema, ProductType } from "@/schemas/product.schema";
import { prisma } from "@/lib/prisma";
import { toPlainProduct } from "@/lib/transformers";

export const productService = {
    async getAll(categoryId?: string): Promise<ProductType[]> {
        const products = await prisma.product.findMany({
            where: categoryId ? { categoryId } : {},
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });

        return products.map(toPlainProduct);
    },

    async getById(id: string): Promise<ProductType | null> {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });

        return product ? toPlainProduct(product) : null;
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
            include: { category: true },
        });

        return toPlainProduct(product);
    },

    async update(id: string, data: unknown): Promise<ProductType> {
        const parsed = ProductSchema.partial().parse(data);

        const updated = await prisma.product.update({
            where: { id },
            data: parsed,
            include: { category: true },
        });

        return toPlainProduct(updated);
    },

    async delete(id: string): Promise<void> {
        await prisma.product.delete({ where: { id } });
    },
};