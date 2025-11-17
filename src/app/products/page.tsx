"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const mockProducts = [
    {
        id: "1",
        name: "Basic Slim Fit T-Shirt",
        category: "Cotton T Shirt",
        price: 199,
        image:
            "https://img2.ans-media.com/i/542x813/AW25-TSM139-00X_F1_PRM.webp?v=1758779988",
    },
    {
        id: "2",
        name: "Basic Heavy Weight T-Shirt",
        category: "Crewneck T Shirt",
        price: 199,
        image:
            "https://img2.ans-media.com/i/628x942/AW25-BUU002-83X_F1_PRM.webp?v=1758607723",
    },
    {
        id: "3",
        name: "Full Sleeve Zipper",
        category: "Cotton T Shirt",
        price: 199,
        image:
            "https://img2.ans-media.com/i/628x942/AW25-TSM0AT-99X_F1_PRM.webp?v=1758011804",
    },
    {
        id: "4",
        name: "Basic Heavy Weight T-Shirt",
        category: "Cotton T Shirt",
        price: 199,
        image:
            "https://img2.ans-media.com/i/628x942/AW25-TSM0ZG-99X_F1_PRM.webp?v=1752828626",
    },
];

export default function ProductsPage() {
    const [search, setSearch] = useState("");

    return (
        <main className="w-full min-h-screen bg-[#f5f5f5] text-neutral-900 px-10 py-16">

            {/* ===== BREADCRUMB ===== */}
            <p className="text-xs text-neutral-500 mb-1 tracking-wide">
                Home / Products
            </p>

            {/* ===== TITLE ===== */}
            <h1 className="text-3xl font-extrabold tracking-tight uppercase mb-10">
                Products
            </h1>

            <div className="flex gap-14">

                {/* ========== LEFT SIDEBAR ========== */}
                <aside className="w-64 flex-shrink-0">

                    <h2 className="font-semibold text-sm text-neutral-700 mb-3">Filters</h2>

                    <Accordion type="multiple" className="space-y-3">

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
                                            variant="outline"
                                            className="px-3 py-1 h-auto text-xs"
                                        >
                                            {size}
                                        </Button>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* AVAILABILITY */}
                        <AccordionItem value="availability">
                            <AccordionTrigger className="text-xs uppercase tracking-wide text-neutral-500">
                                Availability
                            </AccordionTrigger>
                            <AccordionContent className="space-y-3 py-2">
                                <label className="flex items-center text-sm gap-2">
                                    <Checkbox />
                                    Availability <span className="ml-auto text-neutral-400">(450)</span>
                                </label>
                                <label className="flex items-center text-sm gap-2">
                                    <Checkbox />
                                    Out of Stock <span className="ml-auto text-neutral-400">(18)</span>
                                </label>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Other Filter Categories */}
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

                {/* ========== MAIN SECTION ========== */}
                <section className="flex-1">

                    {/* SEARCH & TAGS */}
                    <div className="flex items-center justify-between mb-8">
                        {/* search */}
                        <div className="relative w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-4 w-4" />
                            <Input
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-white border-neutral-300"
                            />
                        </div>

                        {/* tags */}
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

                    {/* ====== PRODUCTS GRID ====== */}
                    <div className="grid grid-cols-3 gap-10">
                        {mockProducts.map((product) => (
                            <Card
                                key={product.id}
                                className="rounded-none border border-neutral-300 shadow-sm hover:shadow-md transition cursor-pointer"
                            >
                                <div className="relative overflow-hidden aspect-[3/4] bg-neutral-200">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>

                                <CardContent className="p-4">
                                    <p className="text-xs text-neutral-500 uppercase tracking-wide">
                                        {product.category}
                                    </p>
                                    <h3 className="text-sm mt-1 tracking-wide font-semibold">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm font-medium mt-1">
                                        ${product.price}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}