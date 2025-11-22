import { Decimal } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";
import { ProductType } from "@/schemas/product.schema";
import { OrderType } from "@/schemas/order.schema";

export type PrismaProductWithCategory = Prisma.ProductGetPayload<{ include: { category: true } }>;

export type PrismaOrderWithItems  = Prisma.OrderGetPayload<{ include: { items: { include: { product: true } } } }>

export const toPlainProduct = (p: PrismaProductWithCategory): ProductType => ({
    id: p.id,
    name: p.name,
    price: p.price instanceof Decimal ? p.price.toNumber() : Number(p.price),
    stock: p.stock,

    imageUrl: p.imageUrl ?? undefined,
    images: p.images ?? [],
    colors: p.colors ?? [],
    sizes: p.sizes ?? [],
    tags: p.tags ?? [],

    categoryId: p.categoryId ?? undefined,

    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
});

export const toPlainOrder = (o: PrismaOrderWithItems): OrderType => ({
    id: o.id,
    userId: o.userId,
    status: o.status,
    createdAt: o.createdAt,
    items: o.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price),
    })),
});