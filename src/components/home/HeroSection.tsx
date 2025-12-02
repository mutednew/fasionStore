"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, ArrowRight, MoveRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { useGetProductsFilteredQuery } from "@/store/api/productsApi";
import { Product } from "@/types";

export default function HeroSection() {
    // 1. Увеличили лимит и убрали жесткую сортировку "new", чтобы получить больше разнообразия
    const { data } = useGetProductsFilteredQuery({
        limit: 24,
        sort: "new", // Можно убрать или оставить, если хотите именно новинки
    });

    const allProducts = useMemo(() => data?.products ?? [], [data]);

    const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
    const [cycle, setCycle] = useState(0);

    // Улучшенная функция перемешивания (Fisher-Yates Shuffle)
    const pickRandomProducts = useCallback((products: Product[]) => {
        if (products.length === 0) return [];

        const shuffled = [...products];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled.slice(0, 2);
    }, []);

    // Инициализация
    useEffect(() => {
        if (allProducts.length > 0 && visibleProducts.length === 0) {
            setVisibleProducts(pickRandomProducts(allProducts));
        }
    }, [allProducts, pickRandomProducts, visibleProducts.length]);

    // Таймер ротации
    useEffect(() => {
        if (allProducts.length === 0) return;

        const intervalTime = 6000;

        const timer = setInterval(() => {
            setVisibleProducts(pickRandomProducts(allProducts));
            setCycle(prev => prev + 1);
        }, intervalTime);

        return () => clearInterval(timer);
    }, [allProducts, pickRandomProducts]);

    return (
        <section className="w-full bg-[#EAEAEA] relative overflow-hidden">

            {/* Декоративный фон */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none select-none">
                <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-l from-white/60 to-transparent" />
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl mix-blend-multiply" />
                <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-red-100/30 rounded-full blur-3xl mix-blend-multiply" />
            </div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-8 pb-20 relative z-10">

                {/* TOP BAR */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 md:mb-24">
                    <nav className="flex gap-8">
                        {["Men", "Women", "Sale"].map((item) => (
                            <Link
                                key={item}
                                href={`/products?category=${item.toLowerCase()}`}
                                className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors relative group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    <div className="relative w-full md:w-64 group">
                        <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
                        <Input
                            placeholder="Search store..."
                            className="pl-0 pr-8 bg-transparent border-0 border-b border-neutral-300 rounded-none focus-visible:ring-0 focus-visible:border-black placeholder:text-neutral-400 text-sm text-right transition-all"
                        />
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-12 gap-y-12 md:gap-x-12 items-end">

                    {/* --- LEFT: TEXT CONTENT --- */}
                    <div className="col-span-12 lg:col-span-5 space-y-10 lg:mb-12">

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="w-12 h-[1px] bg-red-600" />
                                <p className="text-xs font-bold tracking-widest text-red-600 uppercase">
                                    New Season 2025
                                </p>
                            </div>

                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-neutral-900 leading-[0.9] tracking-tighter uppercase">
                                Urban <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-neutral-800 to-neutral-500">
                                    Refined
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-sm md:text-base text-neutral-600 leading-relaxed max-w-sm border-l-2 border-neutral-300 pl-6"
                        >
                            Explore the intersection of brutalist architecture and fluid fashion.
                            Designed for those who move with the city.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="pt-4 flex flex-col items-start gap-6"
                        >
                            <Button
                                asChild
                                className="h-14 px-10 rounded-none bg-neutral-900 text-white hover:bg-black hover:scale-105 transition-all duration-300 uppercase tracking-widest text-xs font-bold shadow-xl"
                            >
                                <Link href="/products">
                                    Shop Collection <ArrowRight className="ml-3 h-4 w-4" />
                                </Link>
                            </Button>

                            {/* --- OPTIMIZED TIMER --- */}
                            <div className="flex items-center gap-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Next Drop</p>
                                <div className="w-24 h-[2px] bg-neutral-200 rounded-full overflow-hidden">
                                    <motion.div
                                        key={cycle}
                                        className="h-full bg-red-500"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 6, ease: "linear" }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* --- RIGHT: DYNAMIC CARDS --- */}
                    <div className="col-span-12 lg:col-span-7 relative h-[500px] md:h-[600px] flex gap-4 md:gap-8">

                        {/* Static text */}
                        <div className="absolute -top-20 -right-20 text-[200px] font-black text-white/40 select-none z-0 leading-none overflow-hidden pointer-events-none hidden xl:block">
                            01
                        </div>

                        {/* Убрали mode="popLayout", так как он часто вызывает проблемы с позиционированием при выходе элементов в Grid/Flex.
                           Обычный AnimatePresence с mode="wait" (или параллельный, если настроить absolute) работает стабильнее.
                           В данном случае мы делаем хитрость: убираем `layout` проп, чтобы Framer не пытался пересчитывать позиции DOM.
                        */}
                        <AnimatePresence mode="popLayout">
                            {visibleProducts.map((product, idx) => (
                                <motion.div
                                    key={`${product.id}-${cycle}`}
                                    // Убрал prop 'layout', так как он вызывал дерганье при смене контента
                                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.4 } }}
                                    transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.1 }}
                                    className={`relative z-10 w-1/2 h-full ${idx === 1 ? 'mt-16 md:mt-24 h-[85%]' : ''}`}
                                >
                                    <Link href={`/products/${product.id}`} className="block w-full h-full group perspective-1000">
                                        <div className="w-full h-full relative overflow-hidden bg-white shadow-2xl transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]">

                                            {/* Image */}
                                            <div className="absolute inset-0 bg-neutral-200">
                                                <Image
                                                    src={product.imageUrl || "/placeholder.png"}
                                                    alt={product.name}
                                                    fill
                                                    priority={idx === 0}
                                                    sizes="(max-width: 768px) 50vw, 33vw"
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
                                                />
                                            </div>

                                            {/* Overlay Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                                            {/* Content */}
                                            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                                <div className="flex items-end justify-between border-b border-white/30 pb-4 mb-4">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">
                                                            {product.category?.name || "New Arrival"}
                                                        </p>
                                                        <h3 className="text-white text-xl md:text-2xl font-bold leading-tight uppercase tracking-tight line-clamp-2">
                                                            {product.name}
                                                        </h3>
                                                    </div>
                                                    <div className="text-white text-lg font-medium whitespace-nowrap ml-2">
                                                        {product.price} ₴
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                                                    View Product <MoveRight className="w-4 h-4" />
                                                </div>
                                            </div>

                                            {/* Top Label */}
                                            {idx === 0 && (
                                                <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-bold uppercase py-2 px-4 tracking-widest z-20">
                                                    Trending
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Skeleton Loading State */}
                        {visibleProducts.length === 0 && (
                            <>
                                <div className="w-1/2 h-full bg-neutral-200 animate-pulse" />
                                <div className="w-1/2 h-[85%] mt-24 bg-neutral-200 animate-pulse" />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}