"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useGetProductsFilteredQuery } from "@/store/api/productsApi";
import { useGetCategoriesQuery } from "@/store/api/adminApi";

export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [priceRange, setPriceRange] = useState<"all" | "low" | "mid" | "high">("all");

    // fetch categories
    const { data: categoriesRes } = useGetCategoriesQuery();
    const categories = categoriesRes?.data?.categories ?? [];

    // fetch products (без color)
    const { data } = useGetProductsFilteredQuery({
        categoryId: categoryId || undefined,
        size: selectedSize || undefined,
        tag: selectedTag || undefined,
    });

    const products = data?.products ?? [];

    // собрать все теги из продуктов
    const allTags = useMemo(() => {
        const set = new Set<string>();
        products.forEach((p) => p.tags?.forEach((t) => set.add(t)));
        return Array.from(set);
    }, [products]);

    // поиск + фильтр по цене
    const visibleProducts = useMemo(() => {
        return products
            .filter((p) =>
                search.trim()
                    ? p.name.toLowerCase().includes(search.toLowerCase().trim())
                    : true
            )
            .filter((p) => {
                const price = Number(p.price);
                if (priceRange === "low") return price < 50;
                if (priceRange === "mid") return price >= 50 && price <= 200;
                if (priceRange === "high") return price > 200;
                return true;
            });
    }, [products, search, priceRange]);

    const safeImage = (url?: string | null) =>
        url && url.trim().length > 0 ? url : "/placeholder.png";

    return (
        <main className="w-full min-h-screen bg-[#f5f5f5] text-neutral-900 px-10 py-16">

            <p className="text-xs text-neutral-500 mb-1 tracking-wide">Home / Products</p>

            <h1 className="text-3xl font-extrabold tracking-tight uppercase mb-10">
                Products
            </h1>

            <div className="flex gap-14">

                {/* FILTER SIDEBAR */}
                <aside className="w-64 flex-shrink-0">
                    <h2 className="font-semibold text-sm text-neutral-700 mb-3">
                        Filters
                    </h2>

                    <Accordion type="multiple" className="space-y-3">

                        {/* CATEGORY */}
                        <AccordionItem value="categories">
                            <AccordionTrigger className="text-xs uppercase tracking-wide text-neutral-500">
                                Category
                            </AccordionTrigger>

                            <AccordionContent className="flex flex-col gap-2 py-2">
                                <Button
                                    variant={categoryId === "" ? "default" : "outline"}
                                    className="py-1 text-xs"
                                    onClick={() => setCategoryId("")}
                                >
                                    All
                                </Button>

                                {categories.map((cat) => (
                                    <Button
                                        key={cat.id}
                                        variant={categoryId === cat.id ? "default" : "outline"}
                                        className="py-1 text-xs justify-start"
                                        onClick={() =>
                                            setCategoryId(categoryId === cat.id ? "" : cat.id)
                                        }
                                    >
                                        {cat.name}
                                    </Button>
                                ))}
                            </AccordionContent>
                        </AccordionItem>

                        {/* TAGS */}
                        <AccordionItem value="tags">
                            <AccordionTrigger className="text-xs uppercase tracking-wide text-neutral-500">
                                Tags
                            </AccordionTrigger>

                            <AccordionContent className="flex flex-wrap gap-2 mt-2">
                                {allTags.length === 0 && (
                                    <p className="text-xs text-neutral-400">No tags found</p>
                                )}

                                {allTags.map((tag) => (
                                    <Button
                                        key={tag}
                                        variant={selectedTag === tag ? "default" : "outline"}
                                        className="px-3 py-1 h-auto text-xs"
                                        onClick={() =>
                                            setSelectedTag(selectedTag === tag ? "" : tag)
                                        }
                                    >
                                        {tag}
                                    </Button>
                                ))}
                            </AccordionContent>
                        </AccordionItem>

                        {/* SIZE */}
                        <AccordionItem value="size">
                            <AccordionTrigger className="text-xs uppercase tracking-wide text-neutral-500">
                                Size
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {["XS", "S", "M", "L", "XL", "2X"].map((size) => (
                                        <Button
                                            key={size}
                                            variant={selectedSize === size ? "default" : "outline"}
                                            onClick={() =>
                                                setSelectedSize(size === selectedSize ? "" : size)
                                            }
                                            className="px-3 py-1 h-auto text-xs"
                                        >
                                            {size}
                                        </Button>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* PRICE RANGE */}
                        <AccordionItem value="price">
                            <AccordionTrigger className="text-xs uppercase tracking-wide text-neutral-500">
                                Price Range
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-2 py-2">
                                {["all", "low", "mid", "high"].map((p) => (
                                    <Button
                                        key={p}
                                        variant={priceRange === p ? "default" : "outline"}
                                        onClick={() => setPriceRange(p as any)}
                                        className="py-1 text-xs"
                                    >
                                        {p === "all" && "All"}
                                        {p === "low" && "Under $50"}
                                        {p === "mid" && "$50 – $200"}
                                        {p === "high" && "Above $200"}
                                    </Button>
                                ))}
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                </aside>

                {/* MAIN PRODUCT GRID */}
                <section className="flex-1 max-w-[1150px]">

                    {/* SEARCH */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="relative w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
                            <Input
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-white border-neutral-300"
                            />
                        </div>
                    </div>

                    <Separator className="mb-8" />

                    {visibleProducts.length === 0 ? (
                        <p className="text-neutral-500">No products found</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-10">
                            {visibleProducts.map((product) => (
                                <Link href={`/products/${product.id}`} key={product.id}>
                                    <Card className="rounded-none border border-neutral-300 shadow-sm hover:shadow-md transition cursor-pointer">

                                        <div className="relative w-full h-[380px] bg-neutral-200 overflow-hidden group">
                                            <Image
                                                src={safeImage(product.imageUrl)}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />

                                            {/* Hover sizes */}
                                            {product.sizes?.length > 0 && (
                                                <div
                                                    className="absolute bottom-0 left-0 right-0 bg-white/80
                                                    opacity-0 group-hover:opacity-100 transition-opacity
                                                    flex gap-2 justify-center py-2"
                                                >
                                                    {product.sizes.map((s) => (
                                                        <span
                                                            key={s}
                                                            className="text-[10px] px-2 py-1 border rounded-sm"
                                                        >
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <CardContent className="p-4">
                                            <p className="text-xs text-neutral-500 uppercase tracking-wide">
                                                {product.categoryId}
                                            </p>
                                            <h3 className="text-sm mt-1 tracking-wide font-semibold">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm font-medium mt-1">
                                                ${product.price}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}