import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { ApiError } from "@/lib/ApiError";
import { ok } from "@/lib/response";
import { uploadSchema, deleteImageSchema } from "@/schemas/upload.schema";

export const uploadService = {
    async saveImage(file: File) {
        try {
            uploadSchema.parse({ file });
        } catch (err: any) {
            if (err.name === "ZodError") {
                throw new ApiError(err.errors[0].message, 400);
            }
            throw err;
        }

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const ext = path.extname(file.name);
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
        const filePath = path.join(uploadDir, fileName);

        const bytes = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(bytes));

        const url = `/uploads/${fileName}`;

        return ok({ url });
    },

    async deleteImage(imageUrl: string) {
        try {
            deleteImageSchema.parse({ imageUrl });
        } catch (err: any) {
            if (err.name === "ZodError") {
                throw new ApiError(err.errors[0].message, 400);
            }
            throw err;
        }

        const relativePath = imageUrl.replace(/^\/+/, ""); // убираем "/"
        if (!relativePath.startsWith("uploads/")) {
            throw new ApiError("Invalid file path", 400);
        }

        const filePath = path.join(process.cwd(), "public", relativePath);

        try {
            await unlink(filePath);
        } catch (err: any) {
            throw new ApiError("File not found or already deleted", 404);
        }

        return ok({ message: "Image deleted successfully" });
    },
};