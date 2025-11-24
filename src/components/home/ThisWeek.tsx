"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import { useGetProductsFilteredQuery } from "@/store/api/productsApi";

export default function ThisWeek() {
    // Получаем 4 последних продукта
    const { data, isLoading } = useGetProductsFilteredQuery({
        limit: 4,
        sort: "new",
    });

    const products = data?.products ?? [];

    return (
        <section className="w-full">
            <div className="max-w-7xl mx-auto px-6 py-24">

                {/* ===== HEADER ===== */}
                <div className="flex items-end justify-between mb-14">
                    <h2 className="text-5xl font-extrabold uppercase leading-none tracking-tight text-neutral-900">
                        New <br />
                        <span>This Week</span>

                        <span className="text-blue-600 text-[18px] font-bold ml-2">
                            ({products.length})
                        </span>
                    </h2>

                    <Link href="/products">
                        <Button
                            variant="ghost"
                            className="uppercase tracking-wider text-neutral-500 hover:text-neutral-900 text-sm"
                        >
                            See All
                        </Button>
                    </Link>
                </div>

                {/* ===== PRODUCTS GRID ===== */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

                    {isLoading && (
                        <p className="text-neutral-500">Loading...</p>
                    )}

                    {!isLoading && products.map((product) => (
                        <Card
                            key={product.id}
                            className="group bg-white border border-neutral-200 shadow-sm hover:shadow-md transition rounded-none"
                        >
                            {/* IMAGE */}
                            <Link href={`/products/${product.id}`}>
                                <div className="relative aspect-[4/5] bg-neutral-100 flex items-center justify-center overflow-hidden">
                                    <Image
                                        src={product.imageUrl || "/placeholder.png"}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute bottom-3 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full border border-neutral-300
                                bg-white hover:bg-neutral-900 hover:text-white transition"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </Link>

                            {/* INFO */}
                            <CardContent className="p-4 space-y-1">
                                <p className="text-[11px] text-neutral-500 uppercase tracking-wider">
                                    {product.category?.name ?? "Unknown"}
                                </p>

                                <h3 className="text-sm font-semibold text-neutral-900">
                                    {product.name}
                                </h3>

                                <p className="text-sm font-medium text-neutral-800 mt-1">
                                    {product.price} ₴
                                </p>
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