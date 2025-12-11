"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import { useGetCategoriesQuery } from "@/store/api/productsApi";
import { useGetProductsFilteredQuery } from "@/store/api/productsApi";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Collections() {
    const [activeCategory, setActiveCategory] = useState("all");

    const { data: categoriesRes } = useGetCategoriesQuery();
    const categories = categoriesRes?.categories ?? [];

    const { data: productsRes, isFetching } = useGetProductsFilteredQuery({
        categoryId: activeCategory === "all" ? undefined : activeCategory,
        limit: 3,
    });

    const products = productsRes?.products ?? [];

    return (
        <section className="w-full bg-[#111] text-white py-24 md:py-32">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col lg:flex-row items-start justify-between mb-16 gap-10">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
                            Curated <br />
                            <span className="text-neutral-500">Selections</span>
                        </h2>
                        <p className="text-neutral-400 max-w-sm text-sm">
                            Explore our latest drops organized by category.
                            Find the perfect piece to complete your look.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => setActiveCategory("all")}
                            className={cn(
                                "px-6 py-2 rounded-full border text-xs font-bold uppercase tracking-widest transition-all",
                                activeCategory === "all"
                                    ? "bg-white text-black border-white"
                                    : "border-neutral-700 text-neutral-400 hover:border-white hover:text-white"
                            )}
                        >
                            All Items
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    "px-6 py-2 rounded-full border text-xs font-bold uppercase tracking-widest transition-all",
                                    activeCategory === cat.id
                                        ? "bg-white text-black border-white"
                                        : "border-neutral-700 text-neutral-400 hover:border-white hover:text-white"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {isFetching ? (
                            [1, 2, 3].map((i) => (
                                <motion.div
                                    key={`skel-${i}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="aspect-[3/4] bg-neutral-800 animate-pulse"
                                />
                            ))
                        ) : products.length > 0 ? (
                            products.map((product, idx) => {
                                // --- ЛОГИКА СКИДКИ ---
                                const isOnSale = product.salePrice && Number(product.salePrice) < Number(product.price);

                                return (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    >
                                        <Link href={`/products/${product.id}`} className="group block h-full relative overflow-hidden">
                                            <div className="relative aspect-[3/4] w-full bg-neutral-800 overflow-hidden">
                                                <Image
                                                    src={product.imageUrl || "/placeholder.png"}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                                />

                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                                {/* --- БЕЙДЖ СКИДКИ --- */}
                                                {isOnSale && (
                                                    <div className="absolute top-4 left-4 bg-red-700 text-white text-[10px] font-bold uppercase py-1 px-3 tracking-widest z-10">
                                                        Sale
                                                    </div>
                                                )}

                                                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                    <div className="flex justify-between items-end border-b border-white/20 pb-4 mb-4">
                                                        <div className="pr-4">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
                                                                {product.category?.name}
                                                            </p>
                                                            <h3 className="text-xl font-bold text-white leading-tight line-clamp-1">
                                                                {product.name}
                                                            </h3>
                                                        </div>

                                                        {/* --- ЦЕНА --- */}
                                                        <div className="text-right shrink-0">
                                                            {isOnSale ? (
                                                                <>
                                                                    <span className="text-lg text-nowrap font-bold text-red-700 block">
                                                                        ${Number(product.salePrice).toFixed(2)}
                                                                    </span>
                                                                    <span className="text-xs text-nowrap text-white/50 line-through block">
                                                                        ${Number(product.price).toFixed(2)}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-lg text-nowrap font-medium text-white">
                                                                    ${Number(product.price).toFixed(2)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                        View Details <ArrowUpRight size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="col-span-3 h-64 flex items-center justify-center text-neutral-500">
                                No products found in this collection.
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-16 text-center">
                    <Link href="/products">
                        <Button variant="outline" className="cursor-pointer h-12 px-8 border-white text-black hover:text-white uppercase tracking-widest text-xs font-bold rounded-none bg-white hover:bg-transparent transition-colors">
                            View All Collections
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}