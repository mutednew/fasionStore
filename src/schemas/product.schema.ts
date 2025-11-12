import { z } from "zod";

export const ProductSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1),
    price: z.number().nonnegative(),
    stock: z.number().int().min(0).default(0),
    imageUrl: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type ProductType = z.infer<typeof ProductSchema>;