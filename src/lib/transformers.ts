import { Decimal } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";
import { OrderType } from "@/schemas/order.schema";
import { ProductType } from "@/schemas/product.schema";

export type PrismaProductWithCategory =
    Prisma.ProductGetPayload<{ include: { category: true } }>;

export type PrismaOrderWithItems =
    Prisma.OrderGetPayload<{ include: { items: { include: { product: true } } } }>;

export const toPlainProduct = (p: PrismaProductWithCategory): ProductType => ({
    id: p.id,
    name: p.name,
    price: p.price instanceof Decimal ? p.price.toNumber() : Number(p.price),

    salePrice: p.salePrice
        ? (p.salePrice instanceof Decimal ? p.salePrice.toNumber() : Number(p.salePrice))
        : null,

    stock: p.stock,

    imageUrl: p.imageUrl ?? undefined,
    images: p.images ?? [],
    colors: p.colors ?? [],
    sizes: p.sizes ?? [],
    tags: p.tags ?? [],

    description: p.description ?? undefined,

    categoryId: p.categoryId ?? undefined,

    category: p.category ? { id: p.category.id, name: p.category.name } : null,

    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
});

export const toPlainOrder = (o: PrismaOrderWithItems): OrderType => ({
    id: o.id,
    userId: o.userId,
    status: o.status,
    total: o.total instanceof Decimal ? o.total.toNumber() : Number(o.total),
    createdAt: o.createdAt,
    items: o.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price instanceof Decimal ? item.price.toNumber() : Number(item.price),
        product: {
            id: item.product.id,
            name: item.product.name,
            imageUrl: item.product.imageUrl ?? undefined,
        }
    })),
});