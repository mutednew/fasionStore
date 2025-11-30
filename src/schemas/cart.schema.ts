import { z } from "zod";

export const CartItemSchema = z.object({
    id: z.string().uuid().optional(),
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).default(1),
    color: z.string().optional(),
    size: z.string().optional(),
});

export const CartSchema = z.object({
    id: z.string().uuid().optional(),
    userId: z.string().uuid(),
    items: z.array(CartItemSchema).optional(),
});

export type CartType = z.infer<typeof CartSchema>;
export type CartItemType = z.infer<typeof CartItemSchema>;