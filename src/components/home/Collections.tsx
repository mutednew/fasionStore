"use client";

import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Collections() {
    return (
        <section className="w-full bg-[#f5f5f5] border-t border-neutral-200">
            <div className="max-w-7xl mx-auto px-6 py-24">

                {/* ===== HEADER ===== */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-14">
                    <h2 className="font-extrabold uppercase tracking-tight leading-none text-neutral-900 text-5xl">
                        XIV<br />
                        <span className="text-neutral-900">Collections</span><br />
                        <span className="text-3xl font-semibold tracking-tight">23–24</span>
                    </h2>

                    <div className="flex items-center gap-10 mt-6 md:mt-0 text-sm text-neutral-600">
                        <Button variant="ghost" className="px-0 hover:text-neutral-900">
                            Filters(+)
                        </Button>

                        <div className="flex flex-col gap-1 leading-tight">
                            <Button variant="ghost" className="px-0 hover:text-neutral-900">
                                Sorts(–)
                            </Button>
                            <div className="text-[11px] text-neutral-500">
                                <p>Less to more</p>
                                <p>More to less</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== FILTER TABS ===== */}
                <Tabs defaultValue="all" className="mb-12">
                    <TabsList className="bg-transparent gap-6 px-0">
                        <TabsTrigger
                            value="all"
                            className="text-sm uppercase tracking-wider data-[state=active]:font-bold data-[state=active]:text-black"
                        >
                            (ALL)
                        </TabsTrigger>

                        {["Men", "Women", "Kid"].map((item) => (
                            <TabsTrigger
                                key={item}
                                value={item.toLowerCase()}
                                className="text-sm uppercase tracking-wider text-neutral-500 data-[state=active]:text-black data-[state=active]:font-bold"
                            >
                                {item}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {/* ===== PRODUCTS GRID ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-16">
                    {[1, 2, 3].map((i) => (
                        <Card
                            key={i}
                            className="border border-neutral-200 bg-white rounded-none shadow-sm hover:shadow-md transition"
                        >
                            {/* IMAGE */}
                            <div className="relative aspect-[4/5] bg-neutral-100 flex items-center justify-center overflow-hidden">
                                <span className="text-neutral-400 text-sm">Image {i}</span>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute bottom-3 left-1/2 -translate-x-1/2 h-8 w-8 bg-white border border-neutral-300 rounded-full hover:bg-neutral-900 hover:text-white transition"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            <CardContent className="p-4 flex flex-col gap-1">
                                <p className="text-[11px] text-neutral-500 uppercase tracking-wider">
                                    Cotton T-Shirt
                                </p>
                                <h3 className="text-sm font-semibold text-neutral-900">
                                    Basic Heavy Weight T-Shirt
                                </h3>
                                <p className="text-sm font-medium text-neutral-800 mt-1">$199</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* ===== LOAD MORE ===== */}
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        className="uppercase tracking-wider text-neutral-700 hover:opacity-70 flex items-center gap-1 text-sm"
                    >
                        More <ChevronDown className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </section>
    );
}