"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const mockProducts = [
    {
        id: "1",
        name: "Soft Heavyweight T-Shirt",
        category: "Cotton T-Shirt",
        price: 199,
        image:
            "https://img2.ans-media.com/i/628x942/AW25-TSM0AT-99X_F1_PRM.webp?v=1758011804",
    },
    {
        id: "2",
        name: "Slim Fit Basic Tee",
        category: "Cotton T-Shirt",
        price: 159,
        image:
            "https://img2.ans-media.com/i/628x942/AW25-TSM0ZG-99X_F1_PRM.webp?v=1752828626",
    },
    {
        id: "3",
        name: "Oversized Beige Tee",
        category: "Cotton T-Shirt",
        price: 199,
        image:
            "https://img2.ans-media.com/i/628x942/AW25-BUU002-83X_F1_PRM.webp?v=1758607723",
    },
    {
        id: "4",
        name: "Abstract Print Tee",
        category: "Printed Shirt",
        price: 239,
        image:
            "https://img2.ans-media.com/i/542x813/AW25-TSM139-00X_F1_PRM.webp?v=1758779988",
    },
];

export default function CollectionPage() {
    const [active, setActive] = useState("(ALL)");

    const filters = ["(ALL)", "Men", "Women", "Kids"];

    return (
        <main className="w-full min-h-screen bg-[#f5f5f5] text-gray-900 font-[Poppins]">
            <div className="max-w-7xl mx-auto px-8 py-20">

                {/* ===== TITLE ===== */}
                <div className="mb-16">
                    <h1 className="text-5xl font-extrabold uppercase tracking-tight leading-none">
                        XIV
                        <br />
                        <span className="text-gray-900">Collections</span>
                        <br />
                        <span className="text-3xl font-semibold">23-24</span>
                    </h1>
                    <p className="mt-6 text-gray-600 text-sm max-w-lg leading-relaxed">
                        Explore our thoughtfully crafted pieces made with premium materials —
                        where modern silhouettes meet timeless design.
                    </p>
                </div>

                {/* ===== FILTERS ===== */}
                <div className="flex items-center justify-between mb-14">
                    {/* categories */}
                    <div className="flex gap-8 text-sm tracking-wide">
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActive(f)}
                                className={`uppercase ${
                                    active === f
                                        ? "text-black font-semibold"
                                        : "text-gray-500 hover:text-black"
                                } transition`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* sort */}
                    <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition">
                        Sort <ChevronDown className="w-4 h-4" />
                    </button>
                </div>

                {/* ===== GRID ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-16">
                    {mockProducts.map((p) => (
                        <div
                            key={p.id}
                            className="group cursor-pointer border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition"
                        >
                            {/* IMAGE */}
                            <div className="relative aspect-[4/5] overflow-hidden bg-[#f7f7f7]">
                                <Image
                                    src={p.image}
                                    alt={p.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            {/* TEXT */}
                            <div className="p-4">
                                <p className="text-[11px] text-gray-400 uppercase tracking-wider">
                                    {p.category}
                                </p>
                                <h3 className="font-semibold text-[14px] mt-1">{p.name}</h3>
                                <p className="text-[13px] font-medium mt-1">${p.price}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ===== LOAD MORE ===== */}
                <div className="flex justify-center pb-10">
                    <button className="flex items-center gap-2 text-sm uppercase tracking-wider text-gray-700 hover:opacity-70 transition">
                        More <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </main>
    );
}