"use client";

import { Search, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="w-full">
            <div className="max-w-7xl mx-auto px-8 pt-10 pb-20">
                {/* top row: categories + search */}
                <div className="flex items-start justify-between gap-6 mb-10">
                    {/* categories */}
                    <ul className="space-y-1 text-[12px] uppercase tracking-wider">
                        {["Men", "Women", "Kids"].map((x) => (
                            <li
                                key={x}
                                className="underline underline-offset-2 hover:opacity-80 cursor-pointer"
                            >
                                {x}
                            </li>
                        ))}
                    </ul>

                    {/* search */}
                    <div className="ml-auto w-full max-w-sm">
                        <label className="relative block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full rounded-sm border border-gray-300 bg-white/70 pl-9 pr-3 py-2 text-sm placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-gray-700"
                            />
                        </label>
                    </div>
                </div>

                {/* main row */}
                <div className="grid grid-cols-12 gap-8">
                    {/* left: text */}
                    <div className="col-span-12 md:col-span-4">
                        <h1 className="uppercase leading-none tracking-tight text-5xl md:text-6xl font-extrabold text-gray-900">
                            New
                            <br />
                            Collection
                        </h1>

                        <div className="mt-4 text-sm text-gray-600">
                            <div>Summer</div>
                            <div>2024</div>
                        </div>

                        {/* CTA + arrows */}
                        <div className="mt-8 flex items-center gap-3">
                            <button className="group inline-flex items-center gap-3 border border-gray-300 bg-white px-5 py-3 text-sm uppercase tracking-wider hover:bg-gray-900 hover:text-white transition">
                                Go To Shop
                                <ArrowRight className="w-5 h-5 transition group-hover:translate-x-1" />
                            </button>

                            <button
                                aria-label="prev"
                                className="grid place-items-center h-10 w-10 border border-gray-300 bg-white hover:bg-gray-100"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                aria-label="next"
                                className="grid place-items-center h-10 w-10 border border-gray-300 bg-white hover:bg-gray-100"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* right: two product cards */}
                    <div className="col-span-12 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {/* replace these boxes with <Image/> when будут реальные картинки */}
                        <div className="aspect-[4/5] bg-white border border-gray-300 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] flex items-center justify-center text-gray-400">
                            <span className="text-sm">Image 1</span>
                        </div>
                        <div className="aspect-[4/5] bg-white border border-gray-300 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] flex items-center justify-center text-gray-400">
                            <span className="text-sm">Image 2</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}