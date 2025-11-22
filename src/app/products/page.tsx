"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useGetProductsQuery } from "@/store/api/adminApi";
import Link from "next/link";

export default function ProductsPage() {
    const [search, setSearch] = useState("");

    const { data, isLoading } = useGetProductsQuery();
    const products = data?.data?.products ?? [];

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="w-full min-h-screen bg-[#f5f5f5] text-neutral-900 px-10 py-16">
            {/* BREADCRUMB */}
            <p className="text-xs text-neutral-500 mb-1 tracking-wide">
                Home / Products
            </p>

            {/* TITLE */}
            <h1 className="text-3xl font-extrabold tracking-tight uppercase mb-10">
                Products
            </h1>

            <div className="flex gap-14">
                {/* LEFT SIDEBAR */}
                <aside className="w-64 flex-shrink-0">
                    <h2 className="font-semibold text-sm text-neutral-700 mb-3">
                        Filters
                    </h2>

                    <Accordion type="multiple" className="space-y-3">
                        <AccordionItem value="size">
                            <AccordionTrigger className="text-xs uppercase tracking-wide text-neutral-500">
                                Size
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {["XS", "S", "M", "L", "XL", "2X"].map((size) => (
                                        <Button key={size} variant="outline" className="px-3 py-1 h-auto text-xs">
                                            {size}
                                        </Button>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="availability">
                            <AccordionTrigger className="text-xs uppercase tracking-wide text-neutral-500">
                                Availability
                            </AccordionTrigger>
                            <AccordionContent className="space-y-3 py-2">
                                <label className="flex items-center text-sm gap-2">
                                    <Checkbox />
                                    Availability
                                </label>
                                <label className="flex items-center text-sm gap-2">
                                    <Checkbox />
                                    Out of stock
                                </label>
                            </AccordionContent>
                        </AccordionItem>

                        {["Category", "Colors", "Price Range", "Collections", "Tags", "Ratings"].map((item) => (
                            <AccordionItem key={item} value={item.toLowerCase()}>
                                <AccordionTrigger className="text-xs uppercase tracking-wide text-neutral-500">
                                    {item}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-sm text-neutral-500 italic py-2">
                                        Options coming soon...
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </aside>

                {/* MAIN SECTION */}
                <section className="flex-1 max-w-[1150px]">

                    {/* SEARCH + TAGS */}
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

                        <div className="flex gap-2">
                            {["NEW", "BEST SELLERS", "T-SHIRTS", "JEANS", "JACKETS", "COATS"].map(
                                (tag) => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="px-3 py-1 text-[11px] uppercase tracking-wide cursor-pointer"
                                    >
                                        {tag}
                                    </Badge>
                                )
                            )}
                        </div>
                    </div>

                    <Separator className="mb-8" />

                    {/* GRID */}
                    {isLoading ? (
                        <p className="text-neutral-500">Loading products...</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-10">
                            {filtered.map((product) => (
                                <Link
                                    href={`/products/${product.id}`}
                                    key={product.id}
                                >
                                    <Card className="rounded-none border border-neutral-300 shadow-sm hover:shadow-md transition cursor-pointer">
                                        {/* FIXED IMAGE HEIGHT */}
                                        <div className="relative w-full h-[380px] bg-neutral-200 overflow-hidden">
                                            <Image
                                                src={product.imageUrl ?? "/placeholder.png"}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-300 hover:scale-105"
                                            />
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