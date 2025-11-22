import { z } from "zod";

export const ProductSchema = z.object({
    name: z.string().min(1),
    price: z.number().positive(),
    stock: z.number().min(0),

    imageUrl: z.string().optional(),

    images: z.array(z.string()).optional().default([]),
    colors: z.array(z.string()).optional().default([]),
    sizes: z.array(z.string()).optional().default([]),
    tags: z.array(z.string()).optional().default([]),

    categoryId: z.string().optional(),
});

export type ProductType = z.infer<typeof ProductSchema> & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
};