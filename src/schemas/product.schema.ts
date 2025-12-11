import { z } from "zod";

export const ProductSchema = z.object({
    name: z.string().min(1),

    price: z.coerce.number().positive(),

    salePrice: z.coerce.number().positive().optional().nullable(),

    stock: z.coerce.number().min(0),

    description: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),

    images: z.array(z.string()).optional().default([]),
    colors: z.array(z.string()).optional().default([]),
    sizes: z.array(z.string()).optional().default([]),
    tags: z.array(z.string()).optional().default([]),

    categoryId: z.string().optional().nullable(),
});

export type ProductType = z.infer<typeof ProductSchema> & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    category?: { id: string; name: string } | null;
};