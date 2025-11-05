"use client";

import Image from "next/image";
import {useState} from "react";
import {useParams} from "next/navigation";

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
    const {id} = useParams();
    const [selectedColor, setSelectedColor] = useState(mockProduct.colors[0]);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedImage, setSelectedImage] = useState(mockProduct.images[0]);

    return (
        <main className="min-h-screen w-full bg-[#fbfbfb] text-gray-800 px-24 py-16 font-[Poppins]">
            <p className="text-xs text-gray-400 mb-4">
                Home / Products / {mockProduct.name}
            </p>

            <div className="flex gap-24 items-start justify-evenly">
                {/* LEFT — images */}
                <div className="flex gap-6">
                    {/* Thumbnails */}
                    <div className="flex flex-col gap-3">
                        {mockProduct.images.map((img) => (
                            <div
                                key={img}
                                onClick={() => setSelectedImage(img)}
                                className={`relative w-[70px] h-[100px] overflow-hidden cursor-pointer border ${
                                    selectedImage === img
                                        ? "border-gray-800"
                                        : "border-gray-200 hover:border-gray-400"
                                }`}
                            >
                                <Image
                                    src={img}
                                    alt="thumbnail"
                                    fill
                                    sizes="70px"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Main image */}
                    <div className="relative w-[520px] h-[680px] bg-white">
                        <Image
                            src={selectedImage}
                            alt={mockProduct.name}
                            fill
                            sizes="520px"
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* RIGHT — info */}
                <div className="w-[350px] border border-gray-200 p-8">
                    <h1 className="text-[15px] font-semibold tracking-wide uppercase mb-2">
                        {mockProduct.name}
                    </h1>

                    <p className="text-[15px] mb-1">${mockProduct.price}</p>
                    <p className="text-xs text-gray-400 mb-6">{mockProduct.details}</p>

                    <p className="text-sm leading-relaxed mb-8">
                        {mockProduct.description}
                    </p>

                    {/* Color */}
                    <div className="mb-8">
                        <p className="text-xs text-gray-400 uppercase mb-2">Color</p>

                        <div className="flex gap-2">
                            {mockProduct.colors.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    style={{backgroundColor: color}}
                                    className={`w-7 h-7 border rounded-sm ${
                                        selectedColor === color
                                            ? "border-gray-900 scale-105"
                                            : "border-gray-200 hover:border-gray-400"
                                    } transition`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Size */}
                    <div className="mb-8">
                        <p className="text-xs text-gray-400 uppercase mb-2">Size</p>

                        <div className="flex flex-wrap gap-2">
                            {mockProduct.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`border text-xs px-3 py-[5px] ${
                                        selectedSize === size
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : "border-gray-300 hover:border-gray-500"
                                    } transition`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between text-[11px] text-gray-400 mt-3">
                            <span className="cursor-pointer hover:text-gray-600">
                                FIND YOUR SIZE
                            </span>

                            <span className="cursor-pointer hover:text-gray-600">
                                MEASUREMENT GUIDE
                          </span>
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        className="w-full bg-[#efefef] border border-gray-300 py-3 text-sm font-semibold hover:bg-gray-900 hover:text-white transition">
                        ADD
                    </button>
                </div>
            </div>
        </main>
    );
}