import { verifyToken } from "@/lib/jwt";
import { ApiError } from "@/lib/ApiError";
import { uploadService } from "@/services/upload.service";
import { fail } from "@/lib/response";
import {NextRequest} from "next/server";
import { uploadSchema } from "@/schemas/upload.schema";

export async function POST(req: NextRequest) {
    try {
        const token =
            req.headers.get("authorization")?.replace("Bearer ", "") ||
            req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

        if (!token) throw new ApiError("Unauthorized", 401);

        const payload = verifyToken(token);
        if (!payload || payload.role !== "ADMIN") {
            throw new ApiError("Access denied: admin only", 403);
        }

        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            throw new ApiError("No file uploaded", 400);
        }

        uploadSchema.parse({ file });

        const result = await uploadService.saveImage(file);
        return result;
    } catch (err: any) {
        console.error("Upload error:", err);

        if (err instanceof ApiError) {
            return fail(err.message, err.status);
        }

        if (err.name === "ZodError") {
            return fail(err.errors[0].message, 400);
        }

        return fail("Upload failed", 500);
    }
}

export async function DELETE(req: Request) {
    try {
        const token =
            req.headers.get("authorization")?.replace("Bearer ", "") ||
            req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

        if (!token) throw new ApiError("Unauthorized", 401);

        const payload = verifyToken(token);
        if (!payload || payload.role !== "ADMIN") {
            throw new ApiError("Access denied: admin only", 403);
        }

        const { imageUrl } = await req.json();
        if (!imageUrl) throw new ApiError("Image URL required", 400);

        const result = await uploadService.deleteImage(imageUrl);

        return result;
    } catch (err: any) {
        console.error("Delete image error:", err);

        if (err instanceof ApiError) {
            return fail(err.message, err.status);
        }

        if (err.name === "ZodError") {
            return fail(err.errors[0].message, 400);
        }

        return fail("Image deletion failed", 500);
    }
}