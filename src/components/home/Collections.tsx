"use client";

import { ChevronDown, Plus } from "lucide-react";

export default function Collections() {
    return (
        <section className="w-full bg-[#f5f5f5] border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-8 py-24">
                {/* ===== HEADER ===== */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10">
                    <h2 className="text-5xl font-extrabold uppercase tracking-tight text-gray-900 leading-tight">
                        XIV <br />
                        <span className="text-gray-900">Collections</span> <br />
                        <span className="text-3xl font-semibold">23-24</span>
                    </h2>

                    <div className="flex items-center gap-8 mt-6 md:mt-0 text-sm text-gray-500">
                        <p className="cursor-pointer hover:text-gray-800 transition">
                            Filters(+)
                        </p>
                        <div className="flex flex-col gap-[2px]">
                            <p className="cursor-pointer hover:text-gray-800 transition">
                                Sorts(–)
                            </p>
                            <div className="text-[11px] text-gray-400 leading-tight">
                                <p>Less to more</p>
                                <p>More to less</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== FILTERS ===== */}
                <div className="flex items-center gap-6 mb-10 text-sm font-medium tracking-wide">
                    {["(ALL)", "Men", "Women", "Kid"].map((filter) => (
                        <button
                            key={filter}
                            className={`uppercase transition ${
                                filter === "(ALL)"
                                    ? "text-black font-bold"
                                    : "text-gray-500 hover:text-gray-800"
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* ===== PRODUCTS GRID ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="group flex flex-col border border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition"
                        >
                            {/* IMAGE */}
                            <div className="relative aspect-[4/5] flex items-center justify-center bg-[#f7f7f7] overflow-hidden">
                                <span className="text-gray-400 text-sm">Image {i}</span>
                                <button className="absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-gray-300 grid place-items-center hover:bg-gray-900 hover:text-white transition">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* INFO */}
                            <div className="p-4 flex flex-col gap-1">
                                <p className="text-[11px] text-gray-400 uppercase tracking-wider">
                                    Cotton T-Shirt
                                </p>
                                <h3 className="font-semibold text-sm text-gray-900">
                                    Basic Heavy Weight T-Shirt
                                </h3>
                                <p className="text-sm font-medium text-gray-800 mt-1">$199</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ===== LOAD MORE BUTTON ===== */}
                <div className="flex justify-center">
                    <button className="flex items-center gap-2 text-sm uppercase tracking-wider text-gray-700 hover:opacity-70 transition">
                        More <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}