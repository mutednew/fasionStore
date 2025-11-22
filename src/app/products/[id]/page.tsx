"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetProductByIdQuery } from "@/store/api/productsApi";

const FALLBACK_IMAGES = [
    "https://via.placeholder.com/600x800?text=No+Image",
];

const FALLBACK_COLORS = ["#000000", "#c4c4c4", "#ffffff"];
const FALLBACK_SIZES = ["S", "M", "L", "XL"];

export default function ProductPage() {
    const { id } = useParams() as { id: string };

    // Загружаем товар
    const { data, isLoading } = useGetProductByIdQuery(id);

    const product = data?.data?.product;

    const images = product?.imageUrl ? [product.imageUrl] : FALLBACK_IMAGES;

    const [selectedImage, setSelectedImage] = useState(images[0]);
    const [selectedColor, setSelectedColor] = useState(FALLBACK_COLORS[0]);
    const [selectedSize, setSelectedSize] = useState("");

    // Обновить картинку после загрузки товара
    useEffect(() => {
        if (product?.imageUrl) {
            setSelectedImage(product.imageUrl);
        }
    }, [product]);

    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center text-neutral-600">
                Loading product...
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen flex items-center justify-center text-neutral-600">
                Product not found
            </main>
        );
    }

    return (
        <main className="min-h-screen w-full bg-[#fafafa] text-neutral-900 px-20 py-16">

            {/* Breadcrumb */}
            <p className="text-xs text-neutral-500 mb-4 tracking-wide">
                Home / Products /{" "}
                <span className="opacity-70">{product.name}</span>
            </p>

            <div className="flex gap-20 justify-start">

                {/* LEFT — IMAGES */}
                <div className="flex gap-6">

                    {/* Thumbnails */}
                    <div className="flex flex-col gap-3">
                        {images.map((img) => (
                            <Card
                                key={img}
                                onClick={() => setSelectedImage(img)}
                                className={`relative w-[80px] h-[110px] overflow-hidden cursor-pointer border
                                    ${
                                    selectedImage === img
                                        ? "border-black"
                                        : "border-neutral-300 hover:border-neutral-500"
                                } transition`}
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
                    <Card className="relative w-[520px] h-[680px] bg-white border border-neutral-200">
                        <Image
                            src={selectedImage}
                            alt={product.name}
                            fill
                            priority
                            className="object-contain"
                        />
                    </Card>
                </div>

                {/* RIGHT — INFO */}
                <Card className="w-[360px] border border-neutral-200 p-8 shadow-sm">

                    <h1 className="text-lg font-semibold uppercase tracking-tight mb-2">
                        {product.name}
                    </h1>

                    <p className="text-[15px] mb-1">${product.price}</p>

                    <p className="text-xs text-neutral-500 mb-6">
                        Added {new Date(product.createdAt ?? Date.now()).toLocaleDateString()}
                    </p>

                    <p className="text-sm leading-relaxed mb-8">
                        {/* Если нет description — заглушка */}
                        Relaxed-fit shirt. Camp collar and short sleeves. Button-up front.
                    </p>

                    {/* COLOR */}
                    <div className="mb-8">
                        <p className="text-xs text-neutral-500 uppercase mb-2 tracking-wide">
                            Color
                        </p>

                        <div className="flex gap-3">
                            {FALLBACK_COLORS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    style={{ backgroundColor: color }}
                                    className={`w-8 h-8 rounded-sm border transition
                                        ${
                                        selectedColor === color
                                            ? "border-neutral-900 scale-105"
                                            : "border-neutral-300 hover:border-neutral-500"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* SIZE */}
                    <div className="mb-8">
                        <p className="text-xs text-neutral-500 uppercase mb-2 tracking-wide">
                            Size
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {FALLBACK_SIZES.map((size) => (
                                <Button
                                    key={size}
                                    variant={selectedSize === size ? "default" : "outline"}
                                    className={`px-3 py-1 h-auto text-xs
                                        ${
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

                        <div className="flex justify-between text-[11px] text-neutral-500 mt-3">
                            <span className="cursor-pointer hover:text-neutral-700">
                                FIND YOUR SIZE
                            </span>

                            <span className="cursor-pointer hover:text-neutral-700">
                                MEASUREMENT GUIDE
                            </span>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-800">
                        Add to Cart
                    </Button>
                </Card>
            </div>
        </main>
    );
}