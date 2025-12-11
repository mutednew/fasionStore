import { z } from "zod";

export const OrderItemSchema = z.object({
    id: z.string().uuid().optional(),
    productId: z.string().uuid(),
    quantity: z.number().int().min(1),
    price: z.number().nonnegative(),
});

export const OrderSchema = z.object({
    id: z.string().uuid().optional(),
    userId: z.string().uuid(),
    status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED"]).default("PENDING"),
    total: z.number().nonnegative().default(0),
    createdAt: z.date().optional(),
    items: z.array(OrderItemSchema).optional(),
});

export type OrderType = Omit<z.infer<typeof OrderSchema>, "items"> & {
    items: (z.infer<typeof OrderItemSchema> & {
        product: {
            id: string;
            name: string;
            imageUrl?: string | null;
        };
    })[];
};

export type OrderItemType = z.infer<typeof OrderItemSchema>;