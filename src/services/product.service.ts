import { ProductSchema, ProductType } from "@/schemas/product.schema";
import { prisma } from "@/lib/prisma";
import { toPlainProduct } from "@/lib/transformers";
import { ApiError } from "@/lib/ApiError";

export const productService = {
    async getAll(filter?: any): Promise<ProductType[]> {
        try {
            const { search, categoryId, size, price, tag, limit, sort } = filter ?? {};

            const where: any = {
                ...(search && {
                    name: { contains: search, mode: "insensitive" },
                }),

                ...(categoryId && { categoryId }),

                ...(size && { sizes: { has: size } }),

                ...(tag && { tags: { has: tag } }),
            };

            // --- PRICE RANGE ---
            const priceMap: Record<string, any> = {
                low:  { lt: 50 },
                mid:  { gte: 50, lte: 200 },
                high: { gt: 200 },
            };

            if (price && priceMap[price]) {
                where.price = priceMap[price];
            }

            const products = await prisma.product.findMany({
                where,
                include: { category: true },

                // --- SORTING ---
                orderBy:
                    sort === "new"
                        ? { createdAt: "desc" }
                        : sort === "price-asc"
                            ? { price: "asc" }
                            : sort === "price-desc"
                                ? { price: "desc" }
                                : undefined,

                // --- LIMIT ---
                take: limit ? Number(limit) : undefined,
            });

            return products.map(toPlainProduct);

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
        try {
            const parsed = ProductSchema.parse(data);

            const exists = await prisma.product.findFirst({
                where: { name: parsed.name },
            });
            if (exists) throw new ApiError("Product already exists", 409);

            const product = await prisma.product.create({
                data: {
                    name: parsed.name,
                    price: parsed.price,
                    stock: parsed.stock,

                    description: parsed.description ?? null,

                    imageUrl: parsed.imageUrl,
                    images: parsed.images ?? [],
                    colors: parsed.colors ?? [],
                    sizes: parsed.sizes ?? [],
                    tags: parsed.tags ?? [],

                    categoryId: parsed.categoryId ?? null,
                },
                include: { category: true },
            });

            return toPlainProduct(product);
        } catch (err) {
            if (err instanceof ApiError) throw err;
            console.error(err);
            throw new ApiError("Failed to create product", 500);
        }
    },

    async update(id: string, data: unknown): Promise<ProductType> {
        try {
            const parsed = ProductSchema.partial().parse(data);

            const existing = await prisma.product.findUnique({
                where: { id },
            });
            if (!existing) throw new ApiError("Product not found", 404);

            const updated = await prisma.product.update({
                where: { id },
                data: {
                    ...parsed,

                    categoryId:
                        parsed.categoryId === "" || parsed.categoryId === undefined
                            ? existing.categoryId
                            : parsed.categoryId,

                    description:
                        parsed.description !== undefined
                            ? parsed.description
                            : existing.description,

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
            const existingProduct = await prisma.product.findUnique({
                where: { id },
            });

            if (!existingProduct) throw new ApiError("Product not found", 404);

            await prisma.product.delete({ where: { id } });
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new ApiError("Failed to delete product", 500);
        }
    },
};