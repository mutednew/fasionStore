"use client";

import Image from "next/image";
import { useState } from "react";
import { useParams } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const mockProduct = {
    id: "1",
    name: "ABSTRACT PRINT SHIRT",
    price: 99,
    description:
        "Relaxed-fit shirt. Camp collar and short sleeves. Button-up front.",
    details: "MRP incl. of all taxes",
    colors: ["#d9d9d9", "#333333", "#000000", "#a7dcd1", "#b1b9ee"],
    sizes: ["XS", "S", "M", "L", "XL", "2X"],
    images: [
        "https://img2.ans-media.com/i/542x813/AW25-TSM139-00X_F1_PRM.webp?v=1758779988",
        "https://img2.ans-media.com/i/542x813/AW25-TSM139-00X_F2_PRM.webp?v=1758780593",
        "https://img2.ans-media.com/i/542x813/AW25-TSM139-00X_F3_PRM.webp?v=1758780320",
        "https://img2.ans-media.com/i/542x813/AW25-TSM139-00X_F4_PRM.webp?v=1758780593",
    ],
};

export default function ProductPage() {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(mockProduct.images[0]);
    const [selectedColor, setSelectedColor] = useState(mockProduct.colors[0]);
    const [selectedSize, setSelectedSize] = useState("");

    return (
        <main className="min-h-screen w-full bg-[#fafafa] text-neutral-900 px-20 py-16">

            {/* Breadcrumb */}
            <p className="text-xs text-neutral-500 mb-4 tracking-wide">
                Home / Products / <span className="opacity-70">{mockProduct.name}</span>
            </p>

            <div className="flex gap-20 justify-start">

                {/* LEFT — IMAGES */}
                <div className="flex gap-6">
                    {/* thumbnails */}
                    <div className="flex flex-col gap-3">
                        {mockProduct.images.map((img) => (
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

                    {/* main image */}
                    <Card className="relative w-[520px] h-[680px] bg-white border border-neutral-200">
                        <Image
                            src={selectedImage}
                            alt={mockProduct.name}
                            fill
                            priority
                            className="object-contain"
                        />
                    </Card>
                </div>

                {/* RIGHT — INFO */}
                <Card className="w-[360px] border border-neutral-200 p-8 shadow-sm">

                    <h1 className="text-lg font-semibold uppercase tracking-tight mb-2">
                        {mockProduct.name}
                    </h1>

                    <p className="text-[15px] mb-1">${mockProduct.price}</p>
                    <p className="text-xs text-neutral-500 mb-6">{mockProduct.details}</p>

                    <p className="text-sm leading-relaxed mb-8">
                        {mockProduct.description}
                    </p>

                    {/* COLOR */}
                    <div className="mb-8">
                        <p className="text-xs text-neutral-500 uppercase mb-2 tracking-wide">Color</p>

                        <div className="flex gap-3">
                            {mockProduct.colors.map((color) => (
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
                        <p className="text-xs text-neutral-500 uppercase mb-2 tracking-wide">Size</p>

                        <div className="flex flex-wrap gap-2">
                            {mockProduct.sizes.map((size) => (
                                <Button
                                    key={size}
                                    variant={selectedSize === size ? "default" : "outline"}
                                    className={`px-3 py-1 h-auto text-xs ${
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