"use client";

import { useEffect, useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import { useGetProductsFilteredQuery } from "@/store/api/productsApi";
import { Product } from "@/types";

export default function ThisWeek() {
    const { data } = useGetProductsFilteredQuery({
        limit: 12, // Берем больше товаров для разнообразия
        // sort: "new",
    });

    const products = data?.products ?? [];

    // Стейт для перемешанных товаров
    const [shuffledProducts, setShuffledProducts] = useState<Product[]>([]);

    // Перемешиваем товары при загрузке (только на клиенте)
    useEffect(() => {
        if (products.length > 0) {
            const shuffled = [...products].sort(() => 0.5 - Math.random());
            setShuffledProducts(shuffled);
        }
    }, [products]);

    // Дублируем 3 раза для длинной ленты (бесконечный эффект)
    // Используем уже перемешанный массив
    const items = shuffledProducts.length > 0
        ? [...shuffledProducts, ...shuffledProducts, ...shuffledProducts]
        : [];

    // Управление анимацией
    const [isHovered, setIsHovered] = useState(false);

    // Вычисляем длительность анимации (чем больше товаров, тем медленнее, чтобы скорость была постоянной)
    const duration = items.length * 2.5; // 2.5 секунды на 1 товар

    return (
        <section className="w-full bg-white py-24 border-b border-neutral-100 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 mb-12 flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <p className="text-xs font-bold text-red-500 tracking-widest uppercase">
                            Live Feed
                        </p>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold uppercase leading-none tracking-tight text-neutral-900">
                        Trending Now
                    </h2>
                </div>

                <Link href="/products">
                    <Button variant="link" className="uppercase tracking-widest font-bold text-xs h-auto p-0 hover:no-underline hover:opacity-50 transition hidden md:flex items-center gap-2">
                        View All <ArrowRight size={14} />
                    </Button>
                </Link>
            </div>

            {/* ===== INFINITE SLIDER ===== */}
            <div className="relative w-full group">

                {/* Градиенты */}
                <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                {items.length > 0 ? (
                    <div
                        className="flex overflow-hidden"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div
                            className="flex gap-6 md:gap-8 pr-6 md:pr-8"
                            style={{
                                animationName: "marquee",
                                animationDuration: `${duration}s`,
                                animationTimingFunction: "linear",
                                animationIterationCount: "infinite",
                                animationPlayState: isHovered ? "paused" : "running",
                            }}
                        >
                            {items.map((product, idx) => (
                                <ProductCard key={`${product.id}-${idx}`} product={product} />
                            ))}
                        </div>
                    </div>
                ) : (
                    // Skeleton
                    <div className="flex gap-6 px-6 overflow-hidden">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="min-w-[280px] h-[400px] bg-neutral-100 animate-pulse" />
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); } /* Сдвигаем на 1/3 (один набор из трех) */
                }
            `}</style>

            <div className="mt-12 text-center md:hidden">
                <Link href="/products">
                    <Button variant="outline" className="uppercase tracking-widest font-bold text-xs">
                        View All Arrivals
                    </Button>
                </Link>
            </div>
        </section>
    );
}

function ProductCard({ product }: { product: Product }) {
    return (
        <Link
            href={`/products/${product.id}`}
            className="group/card block relative min-w-[260px] md:min-w-[320px] h-[400px] md:h-[480px] bg-neutral-50 cursor-pointer"
        >
            <div className="relative w-full h-full overflow-hidden">
                <Image
                    src={product.imageUrl || "/placeholder.png"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 260px, 320px"
                    className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                />

                <div className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10">
                    <Button size="icon" className="rounded-full bg-white text-black hover:bg-black hover:text-white shadow-lg w-10 h-10">
                        <Plus className="w-5 h-5" />
                    </Button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
                    <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">
                        {product.category?.name ?? "Collection"}
                    </p>
                    <h3 className="text-white font-bold text-lg leading-tight mb-1 line-clamp-1">
                        {product.name}
                    </h3>
                    <p className="text-white font-medium">
                        {product.price} ₴
                    </p>
                </div>
            </div>
        </Link>
    );
}