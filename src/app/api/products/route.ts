import { productService } from "@/services/product.service";
import { NextResponse } from "next/server";
import { ProductSchema } from "@/schemas/product.schema";
import { ZodError } from "zod";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;

        const products = await productService.getAll(categoryId);

        return NextResponse.json(products);
    } catch (err) {
        console.error("GET /api/products error:", err);

        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const parsed = ProductSchema.omit({
            id: true,
            createdAt: true,
            updatedAt: true,
        }).parse(body);

        const newProduct = await productService.create(parsed);

        return NextResponse.json(newProduct, { status: 201 });
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json(
                { error: "Invalid data", details: err.issues },
                { status: 400 }
            );
        }

        console.error("POST /api/products error:", err);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}