"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

const mockProducts = [
    {
        id: "1",
        name: "Basic Slim Fit T-Shirt",
        category: "Cotton T Shirt",
        price: 199,
        image:
            "https://img2.ans-media.com/i/542x813/AW25-TSM139-00X_F1_PRM.webp?v=1758779988",
    },
    {
        id: "2",
        name: "Basic Heavy Weight T-Shirt",
        category: "Crewneck T Shirt",
        price: 199,
        image:
            "https://img2.ans-media.com/i/628x942/AW25-BUU002-83X_F1_PRM.webp?v=1758607723",
    },
    {
        id: "3",
        name: "Full Sleeve Zipper",
        category: "Cotton T Shirt",
        price: 199,
        image:
            "https://img2.ans-media.com/i/628x942/AW25-TSM0AT-99X_F1_PRM.webp?v=1758011804",
    },
    {
        id: "4",
        name: "Basic Heavy Weight T-Shirt",
        category: "Cotton T Shirt",
        price: 199,
        image:
            "https://img2.ans-media.com/i/628x942/AW25-TSM0ZG-99X_F1_PRM.webp?v=1752828626",
    },
];

export default function ProductsPage() {
    const [search, setSearch] = useState("");

    return (
        <main className="w-full min-h-screen bg-gray-100 text-gray-800 px-16 py-16 font-[Poppins]">
            {/* breadcrumb */}
            <p className="text-xs text-gray-400 mb-2">Home / Products</p>

            {/* title */}
            <h1 className="text-2xl font-extrabold mb-8 tracking-wider">PRODUCTS</h1>

            <div className="flex gap-12">
                {/* ==== LEFT SIDEBAR ==== */}
                <aside className="w-1/4 text-sm tracking-wide">
                    <h2 className="font-semibold text-gray-700 mb-4">Filters</h2>

                    {/* size */}
                    <div className="mb-6">
                        <p className="text-xs text-gray-400 uppercase mb-2">Size</p>
                        <div className="flex flex-wrap gap-2">
                            {["XS", "S", "M", "L", "XL", "2X"].map((size) => (
                                <button
                                    key={size}
                                    className="border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* availability */}
                    <div className="mb-6">
                        <p className="text-xs text-gray-400 uppercase mb-2">Availability</p>
                        <label className="flex items-center gap-2 text-[13px]">
                            <input type="checkbox" className="accent-black" />
                            Availability <span className="text-gray-400 ml-auto">(450)</span>
                        </label>
                        <label className="flex items-center gap-2 text-[13px] mt-1">
                            <input type="checkbox" className="accent-black" />
                            Out of Stock <span className="text-gray-400 ml-auto">(18)</span>
                        </label>
                    </div>

                    {/* placeholders for other filters */}
                    {["Category", "Colors", "Price Range", "Collections", "Tags", "Ratings"].map(
                        (item) => (
                            <div key={item} className="border-t border-gray-200 py-3 text-[13px] cursor-pointer">
                                <span className="uppercase text-gray-400">{item}</span>
                            </div>
                        )
                    )}
                </aside>

                {/* ==== MAIN SECTION ==== */}
                <section className="flex-1">
                    {/* search + tags */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="relative w-80">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search"
                                className="w-full border border-gray-200 pl-9 pr-3 py-2 text-sm outline-none"
                            />
                        </div>

                        <div className="flex gap-2">
                            {[
                                "NEW",
                                "BEST SELLERS",
                                "T-SHIRTS",
                                "JEANS",
                                "JACKETS",
                                "COATS",
                            ].map((tag) => (
                                <button
                                    key={tag}
                                    className="border border-gray-300 text-[12px] px-3 py-1 hover:bg-gray-100 cursor-pointer"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* products grid */}
                    <div className="grid grid-cols-3 gap-8">
                        {mockProducts.map((product) => (
                            <div key={product.id} className="group cursor-pointer">
                                <div className="relative overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        width={400}
                                        height={400}
                                        className="w-full h-[420px] object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    {product.category}
                                </p>
                                <h3 className="text-[13px] font-semibold mt-1">
                                    {product.name}
                                </h3>
                                <p className="text-[13px] font-medium">${product.price}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
