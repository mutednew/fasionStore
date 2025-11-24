"use client";

import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useGetCategoriesQuery } from "@/store/api/adminApi";
import { useGetProductsFilteredQuery } from "@/store/api/productsApi";
import Image from "next/image";
import Link from "next/link";

export default function Collections() {
    const [activeCategory, setActiveCategory] = useState("all");

    const { data: categoriesRes, isLoading: loadingCategories } = useGetCategoriesQuery();
    const categories = categoriesRes?.data.categories ?? [];

    const { data: productsRes, isLoading: loadingProducts } =
        useGetProductsFilteredQuery({
            categoryId: activeCategory === "all" ? undefined : activeCategory,
            limit: 6,
            sort: "new",
        });

    const products = productsRes?.products ?? [];

    return (
        <section className="w-full bg-[#f5f5f5] border-t border-neutral-200">
            <div className="max-w-7xl mx-auto px-6 py-24">

                {/* HEADER */}
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
                        </div>
                    </div>
                </div>

                {/* TABS */}
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-12">
                    <TabsList className="bg-transparent gap-6 px-0">
                        <TabsTrigger
                            value="all"
                            className="text-sm uppercase tracking-wider data-[state=active]:font-bold"
                        >
                            (ALL)
                        </TabsTrigger>

                        {!loadingCategories &&
                            categories.map((cat) => (
                                <TabsTrigger
                                    key={cat.id}
                                    value={cat.id}
                                    className="text-sm uppercase tracking-wider text-neutral-500 data-[state=active]:text-black data-[state=active]:font-bold"
                                >
                                    {cat.name}
                                </TabsTrigger>
                            ))}
                    </TabsList>
                </Tabs>

                {/* PRODUCTS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-16">
                    {loadingProducts && <p className="text-neutral-500">Loading products...</p>}

                    {!loadingProducts &&
                        products.map((product) => (
                            <Card
                                key={product.id}
                                className="border border-neutral-200 bg-white rounded-none shadow-sm hover:shadow-md transition"
                            >
                                <Link href={`/products/${product.id}`}>
                                    <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
                                        <Image
                                            src={product.imageUrl || "/placeholder.png"}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />

                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="absolute bottom-3 left-1/2 -translate-x-1/2 h-8 w-8 bg-white border border-neutral-300 rounded-full hover:bg-neutral-900 hover:text-white transition"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </Link>

                                <CardContent className="p-4 flex flex-col gap-1">
                                    <p className="text-[11px] text-neutral-500 uppercase tracking-wider">
                                        {product.category?.name}
                                    </p>

                                    <h3 className="text-sm font-semibold text-neutral-900">
                                        {product.name}
                                    </h3>

                                    <p className="text-sm font-medium mt-1">
                                        {product.price} ₴
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                </div>

                {/* LOAD MORE */}
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