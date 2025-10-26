import { ProductSchema, ProductType } from "@/schemas/product.schema";
import { prisma } from "@/lib/prisma";
import { toPlainProduct } from "@/lib/transformers";
import { ApiError } from "@/lib/ApiError";

export const productService = {
    async getAll(categoryId?: string): Promise<ProductType[]> {
        try {
            const products = await prisma.product.findMany({
                where: categoryId ? { categoryId } : {},
                include: { category: true },
                orderBy: { createdAt: "desc" },
            });

            return products.map(toPlainProduct);
        } catch (err) {
            throw new ApiError("Failed to fetch products", 500);
        }
    },

    async getById(id: string): Promise<ProductType | null> {
        try {
            const product = await prisma.product.findUnique({
                where: { id },
                include: { category: true },
            });

            if (!product) {
                throw new ApiError("Product not found", 404);
            }

            return toPlainProduct(product);
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new ApiError("Failed to fetch product", 500);
        }
    },

    async create(data: unknown): Promise<ProductType> {
        try {
            const parsed = ProductSchema.parse(data);

            const existingProduct = await prisma.product.findFirst({
                where: { name: parsed.name },
            });
            if (existingProduct) {
                throw new ApiError("Product with this name already exists", 409);
            }

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
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new ApiError("Failed to create product", 500);
        }
    },

    async update(id: string, data: unknown): Promise<ProductType> {
        try {
            const parsed = ProductSchema.partial().parse(data);

            const existingProduct = await prisma.product.findUnique({
                where: { id },
            });

            if (!existingProduct) {
                throw new ApiError("Product not found", 404);
            }

            const updated = await prisma.product.update({
                where: { id },
                data: parsed,
                include: { category: true },
            });

            return toPlainProduct(updated);
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new ApiError("Failed to update product", 500);
        }
    },

    async delete(id: string): Promise<void> {
        try {
            const existingProduct = await prisma.product.findUnique({
                where: { id },
            });

            if (!existingProduct) {
                throw new ApiError("Product not found", 404);
            }

            await prisma.product.delete({ where: { id } });
        } catch (err) {
            if (err instanceof ApiError) {
                throw err;
            }
            throw new ApiError("Failed to delete product", 500);
        }
    },
};