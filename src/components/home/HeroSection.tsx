"use client";

import { Search, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HeroSection() {
    return (
        <section className="w-full">
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 space-y-12">

                {/* top row */}
                <div className="flex items-start justify-between gap-6">
                    {/* categories */}
                    <ul className="space-y-1 text-[12px] uppercase tracking-[0.15em] font-medium text-neutral-700">
                        {["Men", "Women", "Kids"].map((x) => (
                            <li
                                key={x}
                                className="cursor-pointer opacity-80 hover:opacity-100 transition underline underline-offset-[3px]"
                            >
                                {x}
                            </li>
                        ))}
                    </ul>

                    {/* search */}
                    <div className="ml-auto w-full max-w-sm relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <Input
                            placeholder="Search"
                            className="pl-9 bg-white/70 border-neutral-300 focus-visible:ring-neutral-800 text-sm"
                        />
                    </div>
                </div>

                {/* main grid */}
                <div className="grid grid-cols-12 gap-10 items-start">

                    {/* left column */}
                    <div className="col-span-12 md:col-span-4 space-y-6">
                        <h1 className="uppercase leading-none tracking-tight text-5xl md:text-6xl font-extrabold text-neutral-900">
                            New
                            <br />
                            Collection
                        </h1>

                        <p className="text-sm text-neutral-600 leading-tight">
                            Summer <br /> 2024
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="px-6 py-5 uppercase tracking-wide font-medium
                                border-neutral-400 bg-white hover:bg-neutral-900 hover:text-white"
                            >
                                Go To Shop
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 border-neutral-300 hover:bg-neutral-200"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 border-neutral-300 hover:bg-neutral-200"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* right column: product previews */}
                    <div className="col-span-12 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <Card className="aspect-[4/5] bg-white border-neutral-300 flex items-center justify-center shadow-xs">
                            <span className="text-sm text-neutral-400">Image 1</span>
                        </Card>

                        <Card className="aspect-[4/5] bg-white border-neutral-300 flex items-center justify-center shadow-xs">
                            <span className="text-sm text-neutral-400">Image 2</span>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}