"use client";

import { useState, useMemo, useEffect } from "react";
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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import { useGetProductsFilteredQuery } from "@/store/api/productsApi";
import { useGetCategoriesQuery } from "@/store/api/adminApi";

function shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [priceRange, setPriceRange] = useState<"all" | "low" | "mid" | "high">("all");

    const [currentPage, setCurrentPage] = useState(1);

    const { data: categoriesRes } = useGetCategoriesQuery();
    const categories = categoriesRes?.data?.categories ?? [];

    const { data } = useGetProductsFilteredQuery({
        categoryId: categoryId || undefined,
        size: selectedSize || undefined,
        tag: selectedTag || undefined,
    });

    const rawProducts = data?.products ?? [];

    const shuffledProducts = useMemo(() => {
        return shuffleArray(rawProducts);
    }, [rawProducts]);

    const allTags = useMemo(() => {
        const set = new Set<string>();
        rawProducts.forEach((p) => p.tags?.forEach((t) => set.add(t)));
        return Array.from(set);
    }, [rawProducts]);

    const visibleProducts = useMemo(() => {
        return shuffledProducts
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
    }, [shuffledProducts, search, priceRange]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, categoryId, selectedSize, selectedTag, priceRange]);

    const totalPages = Math.ceil(visibleProducts.length / ITEMS_PER_PAGE);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return visibleProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [visibleProducts, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const safeImage = (url?: string | null) =>
        url && url.trim().length > 0 ? url : "/placeholder.png";

    return (
        <main className="w-full min-h-screen bg-[#f5f5f5] text-neutral-900 px-10 py-16">
            <p className="text-xs text-neutral-500 mb-1 tracking-wide">Home / Products</p>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase mb-10">
                Products
            </h1>

            <div className="flex gap-14">
                {/* SIDEBAR */}
                <aside className="w-64 flex-shrink-0">
                    <h2 className="font-semibold text-sm text-neutral-700 mb-3">Filters</h2>
                    <Accordion type="multiple" className="space-y-3">
                        {/* Filters content same as before... */}
                        <AccordionItem value="categories">
                            <AccordionTrigger className="text-xs uppercase tracking-wide text-neutral-500">Category</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-2 py-2">
                                <Button variant={categoryId === "" ? "default" : "outline"} className="py-1 text-xs" onClick={() => setCategoryId("")}>All</Button>
                                {categories.map((cat) => (
                                    <Button key={cat.id} variant={categoryId === cat.id ? "default" : "outline"} className="py-1 text-xs justify-start" onClick={() => setCategoryId(categoryId === cat.id ? "" : cat.id)}>{cat.name}</Button>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="tags">
                            <AccordionTrigger className="text-xs uppercase tracking-wide text-neutral-500">Tags</AccordionTrigger>
                            <AccordionContent className="flex flex-wrap gap-2 mt-2">
                                {allTags.map((tag) => (
                                    <Button key={tag} variant={selectedTag === tag ? "default" : "outline"} className="px-3 py-1 h-auto text-xs" onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}>{tag}</Button>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="size">
                            <AccordionTrigger className="text-xs uppercase tracking-wide text-neutral-500">Size</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {["XS", "S", "M", "L", "XL", "2X"].map((size) => (
                                        <Button key={size} variant={selectedSize === size ? "default" : "outline"} onClick={() => setSelectedSize(size === selectedSize ? "" : size)} className="px-3 py-1 h-auto text-xs">{size}</Button>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="price">
                            <AccordionTrigger className="text-xs uppercase tracking-wide text-neutral-500">Price Range</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-2 py-2">
                                {["all", "low", "mid", "high"].map((p) => (
                                    <Button key={p} variant={priceRange === p ? "default" : "outline"} onClick={() => setPriceRange(p as any)} className="py-1 text-xs">{p === "all" && "All"}{p === "low" && "Under $50"}{p === "mid" && "$50 – $200"}{p === "high" && "Above $200"}</Button>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </aside>

                {/* MAIN CONTENT: УБРАЛИ max-w-[1150px], теперь w-full занимает все место */}
                <section className="flex-1 w-full flex flex-col">
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

                    {paginatedProducts.length === 0 ? (
                        <p className="text-neutral-500">No products found</p>
                    ) : (
                        <>
                            {/* GRID: Добавил xl:grid-cols-4 и уменьшил gap до 6, чтобы влезло */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr mb-12">
                                {paginatedProducts.map((product) => (
                                    <Link href={`/products/${product.id}`} key={product.id} className="block h-full">
                                        <Card className="rounded-none border border-neutral-300 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
                                            <div className="relative w-full aspect-[3/4] bg-neutral-200 overflow-hidden group flex-shrink-0">
                                                <Image
                                                    src={safeImage(product.imageUrl)}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                {product.sizes?.length > 0 && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 justify-center py-2">
                                                        {product.sizes.map((s) => (
                                                            <span key={s} className="text-[10px] px-2 py-1 border border-neutral-400 rounded-sm">{s}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <CardContent className="p-4 flex flex-col flex-1 justify-between">
                                                <div>
                                                    <p className="text-[10px] font-medium text-neutral-500 tracking-wide uppercase">
                                                        {categories.find((cat) => cat.id === product.categoryId)?.name ?? "Category"}
                                                    </p>
                                                    <h3 className="text-sm mt-1 font-semibold tracking-wide text-neutral-900 line-clamp-2" title={product.name}>
                                                        {product.name}
                                                    </h3>
                                                </div>
                                                <p className="text-sm font-medium mt-3 text-neutral-800">{product.price} ₴</p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage > 1) handlePageChange(currentPage - 1);
                                                }}
                                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <PaginationItem key={page}>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={currentPage === page}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handlePageChange(page);
                                                    }}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                                }}
                                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}