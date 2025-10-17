import { categoryService } from "@/services/category.service";
import { NextResponse } from "next/server";
import { CategorySchema } from "@/schemas/category.schema";
import { ZodError } from "zod";

export async function GET() {
    try {
        const categories = await categoryService.getAll();

        return NextResponse.json(categories);
    } catch (err) {
        console.error("GET /api/categories error:", err);

        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = CategorySchema.omit({ id: true }).parse(body);
        const created = await categoryService.create(parsed);

        return NextResponse.json(created, { status: 201 });
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: err.issues },
                { status: 400 }
            );
        }

        if (err instanceof Error && err.message.includes("already exists")) {
            return NextResponse.json(
                { error: err.message },
                { status: 409 } // Conflict
            );
        }

        console.error("POST /api/categories error:", err);

        return NextResponse.json(
            { error: "Failed to create category" },
            { status: 500 }
        );
    }
}