import {z} from "zod";

export const CategorySchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1),
});

export type CategoryType = z.infer<typeof CategorySchema>;