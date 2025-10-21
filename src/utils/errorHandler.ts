import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function handleError(err: any) {
    if (err instanceof ZodError)
        return { status: 400, message: "Validation error", details: err.issues };

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") return { status: 409, message: "Duplicate entry" };
        if (err.code === "P2025") return { status: 404, message: "Record not found" };
    }

    console.error("Unhandled error:", err);
    return { status: 500, message: "Internal server error" };
}