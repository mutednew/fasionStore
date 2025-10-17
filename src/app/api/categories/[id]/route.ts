import {categoryService} from "@/services/category.service";
import {NextResponse} from "next/server";
import {ZodError} from "zod";
import {CategorySchema} from "@/schemas/category.schema";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const category = await categoryService.getById(params.id);

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 })
        }

        return NextResponse.json(category);
    } catch (err) {
        console.error("GET /api/categories/:id error:", err);

        return NextResponse.json(
            { error: "Failed to fetch category" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const parsed = CategorySchema.partial().omit({ id: true }).parse(body);
        const updated = await categoryService.update(params.id, parsed);

        return NextResponse.json(updated);
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: err.issues },
                { status: 400 }
            );
        }

        console.error("PUT /api/categories/:id error:", err);

        return NextResponse.json(
            { error: "Failed to update category" },
            { status: 500 }
        );
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await categoryService.delete(params.id);

        return NextResponse.json({ message: "Category deleted" });
    } catch (err) {
        console.error("DELETE /api/categories/:id error:", err);

        return NextResponse.json(
            { error: "Failed to delete category" },
            { status: 500 }
        );
    }
}