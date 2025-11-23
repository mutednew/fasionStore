"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetProductByIdQuery } from "@/store/api/productsApi";

export default function ProductPage() {
    const { id } = useParams() as { id: string };
    const { data, isLoading } = useGetProductByIdQuery(id);

    const product = data?.data?.product;

    // ==== REAL DATA ====

    const images =
        product?.images?.length
            ? product.images
            : product?.imageUrl
                ? [product.imageUrl]
                : ["/placeholder.png"];

    const colors = product?.colors ?? [];
    const sizes = product?.sizes ?? [];
    const tags = product?.tags ?? [];

    // ==== LOCAL STATE ====

    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
    const [selectedSize, setSelectedSize] = useState("");

    useEffect(() => {
        if (images.length > 0) {
            setSelectedImage(images[0]);
        }
    }, [product]);

    // ==== LOADING ====

    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center text-neutral-600">
                Loading product...
            </main>
        );
    }

    // ==== PRODUCT NOT FOUND ====

    if (!product) {
        return (
            <main className="min-h-screen flex items-center justify-center text-neutral-600">
                Product not found
            </main>
        );
    }

    // ============================================================
    //                       PAGE LAYOUT
    // ============================================================

    return (
        <main className="min-h-screen w-full bg-white text-neutral-900 px-8 md:px-20 lg:px-32 py-12">

            {/* Breadcrumb */}
            <p className="text-xs text-neutral-500 mb-6 tracking-wide">
                Home / Products / <span className="opacity-70">{product.name}</span>
            </p>

            <div className="grid grid-cols-12 gap-10 lg:gap-20">

                {/* =======================================================
                                LEFT — IMAGES
                ======================================================= */}
                <div className="col-span-12 lg:col-span-7 flex gap-6">

                    {/* Thumbnails */}
                    <div className="flex flex-col gap-3 w-20">
                        {images.map((img) => (
                            <Card
                                key={img}
                                onClick={() => setSelectedImage(img)}
                                className={`relative w-full aspect-[3/4] overflow-hidden cursor-pointer border transition ${
                                    selectedImage === img
                                        ? "border-black"
                                        : "border-neutral-300 hover:border-neutral-500"
                                }`}
                            >
                                <Image
                                    src={img}
                                    alt="thumbnail"
                                    fill
                                    className="object-cover"
                                />
                            </Card>
                        ))}
                    </div>

                    {/* Main image */}
                    <Card className="relative flex-1 w-[500px] h-[650px] bg-white border border-neutral-200">
                        <Image
                            src={selectedImage}
                            alt={product.name}
                            fill
                            priority
                            className="object-contain"
                        />
                    </Card>
                </div>

                {/* =======================================================
                                RIGHT — INFO
                ======================================================= */}
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-10 pr-4">

                    {/* NAME + PRICE */}
                    <div>
                        <h1 className="text-3xl font-light tracking-tight mb-2">
                            {product.name}
                        </h1>

                        <p className="text-lg font-medium mb-1">
                            ${product.price}
                        </p>

                        <p className="text-[11px] text-neutral-500">
                            Added {new Date(product.createdAt ?? Date.now()).toLocaleDateString()}
                        </p>
                    </div>

                    {/* COLORS */}
                    <div>
                        <p className="text-xs text-neutral-500 uppercase mb-2">Color</p>

                        {colors.length > 0 ? (
                            <div className="flex gap-3">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        style={{ backgroundColor: color }}
                                        className={`w-8 h-8 rounded-sm border transition ${
                                            selectedColor === color
                                                ? "border-neutral-900 scale-105"
                                                : "border-neutral-300 hover:border-neutral-500"
                                        }`}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-neutral-400 italic">No colors available</p>
                        )}
                    </div>

                    {/* SIZES */}
                    <div>
                        <p className="text-xs text-neutral-500 uppercase mb-2">Size</p>

                        {sizes.length > 0 ? (
                            <div className="flex gap-2 flex-wrap">
                                {sizes.map((size) => (
                                    <Button
                                        key={size}
                                        variant={selectedSize === size ? "default" : "outline"}
                                        className={`px-4 py-1 h-auto text-xs rounded-none ${
                                            selectedSize === size
                                                ? "bg-neutral-900 text-white"
                                                : "border-neutral-300 hover:border-neutral-500"
                                        }`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-neutral-400 italic">No sizes available</p>
                        )}

                        <div className="flex justify-between text-[11px] text-neutral-500 mt-3">
                            <span className="cursor-pointer hover:text-neutral-700">Find your size</span>
                            <span className="cursor-pointer hover:text-neutral-700">Measurement guide</span>
                        </div>
                    </div>

                    {/* TAGS */}
                    {tags.length > 0 && (
                        <div>
                            <p className="text-xs text-neutral-500 uppercase mb-2">Tags</p>
                            <div className="flex gap-2 flex-wrap">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 text-xs border border-neutral-300 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <Separator />

                    <Button className="w-full rounded-none bg-neutral-900 text-white hover:bg-neutral-800 py-4">
                        Add to Cart
                    </Button>
                </div>
            </div>

            {/* =======================================================
                        DESCRIPTION (BIG BOTTOM SECTION)
            ======================================================= */}

            <section className="mt-20">
                <h2 className="text-xl font-semibold mb-4">Описание товара</h2>

                <div className="text-sm leading-relaxed text-neutral-700 whitespace-pre-line">
                    {product.description?.trim()
                        ? product.description
                        : "Описание для этого товара пока отсутствует."}
                </div>
            </section>

        </main>
    );
}