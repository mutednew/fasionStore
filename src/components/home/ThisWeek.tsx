"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ThisWeek() {
    return (
        <section className="w-full">
            <div className="max-w-7xl mx-auto px-6 py-24">

                {/* ===== HEADER ===== */}
                <div className="flex items-end justify-between mb-14">
                    <h2 className="text-5xl font-extrabold uppercase leading-none tracking-tight text-neutral-900">
                        New <br />
                        <span>This Week</span>
                        <span className="text-blue-600 text-[18px] font-bold ml-2">(50)</span>
                    </h2>

                    <Button
                        variant="ghost"
                        className="uppercase tracking-wider text-neutral-500 hover:text-neutral-900 text-sm"
                    >
                        See All
                    </Button>
                </div>

                {/* ===== PRODUCTS GRID ===== */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {[1, 2, 3, 4].map((i) => (
                        <Card
                            key={i}
                            className="group bg-white border border-neutral-200 shadow-sm hover:shadow-md transition rounded-none"
                        >
                            {/* IMAGE */}
                            <div className="relative aspect-[4/5] bg-neutral-100 flex items-center justify-center overflow-hidden">
                                <span className="text-neutral-400 text-sm">Image {i}</span>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute bottom-3 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full border border-neutral-300
                                    bg-white hover:bg-neutral-900 hover:text-white transition"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* INFO */}
                            <CardContent className="p-4 space-y-1">
                                <p className="text-[11px] text-neutral-500 uppercase tracking-wider">
                                    V-Neck T-Shirt
                                </p>

                                <h3 className="text-sm font-semibold text-neutral-900">
                                    Product Name {i}
                                </h3>

                                <p className="text-sm font-medium text-neutral-800 mt-1">$99</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* ===== ARROWS ===== */}
                <div className="flex justify-center items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 border-neutral-300 bg-white hover:bg-neutral-200"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 border-neutral-300 bg-white hover:bg-neutral-200"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </section>
    );
}