import { ProductSchema, ProductType } from "@/schemas/product.schema";
import { prisma } from "@/lib/prisma";
import { toPlainProduct } from "@/lib/transformers";
import { ApiError } from "@/lib/ApiError";

export const productService = {
    async getAll(filter?: any) {
        try {
            const {
                search, categoryId, size, tag, limit, sort, page,
                minPrice, maxPrice, stockStatus
            } = filter ?? {};

            const pageNum = Number(page) || 1;
            const limitNum = Number(limit) || 10;
            const skip = (pageNum - 1) * limitNum;

            const where: any = {
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { description: { contains: search, mode: "insensitive" } },
                    ]
                }),
                ...(categoryId && categoryId !== "all" && { categoryId }),
                ...(size && { sizes: { has: size } }),
                ...(tag && { tags: { has: tag } }),
            };

            if (minPrice !== undefined || maxPrice !== undefined) {
                where.price = {};
                if (minPrice !== undefined) where.price.gte = Number(minPrice);
                if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
            }

            if (stockStatus === "in-stock") {
                where.stock = { gt: 0 };
            } else if (stockStatus === "out-of-stock") {
                where.stock = { lte: 0 };
            }

            let orderBy: any = { createdAt: "desc" };
            if (sort === "price-asc") orderBy = { price: "asc" };
            if (sort === "price-desc") orderBy = { price: "desc" };
            if (sort === "stock-desc") orderBy = { stock: "desc" };
            if (sort === "newest") orderBy = { createdAt: "desc" };

            const [products, total] = await prisma.$transaction([
                prisma.product.findMany({
                    where,
                    include: { category: true },
                    orderBy,
                    take: limitNum,
                    skip: skip,
                }),
                prisma.product.count({ where }),
            ]);

            const totalPages = Math.ceil(total / limitNum);

            return {
                products: products.map(toPlainProduct),
                meta: { total, page: pageNum, limit: limitNum, totalPages }
            };

        } catch (err) {
            console.error("Fetch products error:", err);
            throw new ApiError("Failed to fetch products", 500);
        }
    },

    async getById(id: string) {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!product) throw new ApiError("Product not found", 404);
        return toPlainProduct(product);
    },

    async create(data: unknown) {
        const parsed = ProductSchema.parse(data);
        const product = await prisma.product.create({
            data: {
                ...parsed,
                salePrice: parsed.salePrice ?? null,
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
                    salePrice: parsed.salePrice !== undefined ? parsed.salePrice : undefined,
                    categoryId: parsed.categoryId === "" ? existing.categoryId : (parsed.categoryId ?? existing.categoryId),
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
            throw new ApiError("Failed to update product", 500);
        }
    },

    async bulkDiscount(ids: string[], discountPercent: number) {
        try {
            const products = await prisma.product.findMany({
                where: { id: { in: ids } },
                select: { id: true, price: true }
            });

            const updates = products.map((p) => {
                const price = Number(p.price);
                const salePrice = discountPercent > 0
                    ? price - (price * discountPercent / 100)
                    : null;

                return prisma.product.update({
                    where: { id: p.id },
                    data: { salePrice },
                });
            });

            await prisma.$transaction(updates);

            return { count: updates.length };
        } catch (err) {
            console.error("Bulk discount error:", err);
            throw new ApiError("Failed to apply bulk discount", 500);
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