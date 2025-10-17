import {productService} from "@/services/product.service";
import {NextResponse} from "next/server";
import {ZodError} from "zod";
import {ProductSchema} from "@/schemas/product.schema";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const product = await productService.getById(params.id);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (err) {
        console.error("GET /api/products/:id error:", err);

        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();

        const parsed = ProductSchema.partial()
            .omit({ id: true, createdAt: true, updatedAt: true })
            .parse(body);

        const updated = await productService.update(params.id, parsed);

        return NextResponse.json(updated);
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: err.issues },
                { status: 400 }
            );
        }

        console.error("PUT /api/products/:id error:", err);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await productService.delete(params.id);

        return NextResponse.json({ message: "Product deleted" }, { status: 200 });
    } catch (err) {
        console.error("DELETE /api/products/:id error:", err);

        return NextResponse.json({ error: "Failed to delete product" }, { status: 400 });
    }
}