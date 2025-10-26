"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function ThisWeek() {
    return (
        <section className="w-full">
            <div className="max-w-7xl mx-auto px-8 py-24">
                {/* ===== HEADER ===== */}
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-5xl font-extrabold uppercase tracking-tight text-gray-900">
                        New <br />
                        <span className="text-gray-900">This Week</span>
                        <span className="text-blue-600 text-[18px] font-bold ml-2">(50)</span>
                    </h2>
                    <button className="text-sm uppercase tracking-wider text-gray-500 hover:text-gray-800 transition">
                        See All
                    </button>
                </div>

                {/* ===== PRODUCTS GRID ===== */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                    {[1, 2, 3, 4].map((i) => (
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
                                    V-Neck T-Shirt
                                </p>
                                <h3 className="font-semibold text-sm text-gray-900">
                                    Product Name {i}
                                </h3>
                                <p className="text-sm font-medium text-gray-800 mt-1">$99</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ===== ARROWS ===== */}
                <div className="flex justify-center items-center gap-3">
                    <button className="grid place-items-center h-10 w-10 border border-gray-300 bg-white hover:bg-gray-100">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="grid place-items-center h-10 w-10 border border-gray-300 bg-white hover:bg-gray-100">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}