import { z } from "zod";

export const uploadSchema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, "File too large (max 5MB)")
        .refine(
            (file) =>
                ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type),
            "Only JPG, PNG or WEBP images are allowed"
        ),
});

export const deleteImageSchema = z.object({
    imageUrl: z
        .string()
        .regex(/^\/uploads\/[\w\-]+\.(jpg|jpeg|png|webp)$/i, "Invalid image URL format"),
});

export type UploadInput = z.infer<typeof uploadSchema>;
export type DeleteImageInput = z.infer<typeof deleteImageSchema>;