import {ProductSchema, ProductType} from "@/schemas/product.schema";
import { prisma } from "@/lib/prisma";
import { toPlainProduct } from "@/lib/transformers";
import { ApiError } from "@/lib/ApiError";
import { Product } from "@/types";

interface ProductsResponse {
    products: any[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const productService = {
    async getAll(filter?: any) {
        try {
            const { search, categoryId, size, price, tag, limit, sort, page } = filter ?? {};

            const pageNum = Number(page) || 1;
            const limitNum = Number(limit) || 100;
            const skip = (pageNum - 1) * limitNum;

            const where: any = {
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { description: { contains: search, mode: "insensitive" } },
                    ]
                }),
                ...(categoryId && { categoryId }),
                ...(size && { sizes: { has: size } }),
                ...(tag && { tags: { has: tag } }),
            };

            const priceMap: Record<string, any> = {
                low:  { lt: 50 },
                mid:  { gte: 50, lte: 200 },
                high: { gt: 200 },
            };

            if (price && priceMap[price]) {
                where.price = priceMap[price];
            }

            const [products, total] = await prisma.$transaction([
                prisma.product.findMany({
                    where,
                    include: { category: true },
                    orderBy:
                        sort === "new" ? { createdAt: "desc" } :
                            sort === "price-asc" ? { price: "asc" } :
                                sort === "price-desc" ? { price: "desc" } :
                                    undefined,
                    take: limitNum,
                    skip: skip,
                }),
                prisma.product.count({ where }),
            ]);

            const totalPages = Math.ceil(total / limitNum);

            return {
                products: products.map(toPlainProduct),
                meta: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages
                }
            };

        } catch (err) {
            console.log(err);
            throw new ApiError("Failed to fetch products", 500);
        }
    },

    async getById(id: string): Promise<ProductType> {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!product) throw new ApiError("Product not found", 404);
        return toPlainProduct(product);
    },

    async create(data: unknown): Promise<ProductType> {
        const parsed = ProductSchema.parse(data);
        const product = await prisma.product.create({
            data: {
                ...parsed,
                images: parsed.images ?? [],
                colors: parsed.colors ?? [],
                sizes: parsed.sizes ?? [],
                tags: parsed.tags ?? [],
                description: parsed.description ?? null,
                categoryId: parsed.categoryId ?? null,
            },
            include: { category: true },
        });
        return toPlainProduct(product);
    },

    async update(id: string, data: unknown) {
        try {
            const parsed = ProductSchema.partial().parse(data);

            const existing = await prisma.product.findUnique({ where: { id } });
            if (!existing) throw new ApiError("Product not found", 404);

            const updated = await prisma.product.update({
                where: { id },
                data: {
                    ...parsed,
                    categoryId: parsed.categoryId === "" ? existing.categoryId : parsed.categoryId,
                    description: parsed.description ?? existing.description,
                    images: parsed.images ?? existing.images,
                    colors: parsed.colors ?? existing.colors,
                    sizes: parsed.sizes ?? existing.sizes,
                    tags: parsed.tags ?? existing.tags,
                },
                include: { category: true },
            });

            return toPlainProduct(updated);
        } catch (err) {
            if (err instanceof ApiError) throw err;
            console.error(err);
            throw new ApiError("Failed to update product", 500);
        }
    },

    async delete(id: string): Promise<void> {
        try {
            const existingProduct = await prisma.product.findUnique({ where: { id } });
            if (!existingProduct) throw new ApiError("Product not found", 404);
            await prisma.product.delete({ where: { id } });
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new ApiError("Failed to delete product", 500);
        }
    },
};