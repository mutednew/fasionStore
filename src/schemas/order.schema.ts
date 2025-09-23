import {z} from "zod";

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
    createdAt: z.date().optional(),
    items: z.array(OrderItemSchema).optional(),
});

export type OrderType = z.infer<typeof OrderSchema>;
export type OrderItemType = z.infer<typeof OrderItemSchema>;