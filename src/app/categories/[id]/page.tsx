"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, PackageX, ArrowLeft, ChevronLeft, ChevronRight, Search, SlidersHorizontal, X, Filter, Check } from "lucide-react";
import { toast } from "sonner";

import {
    useGetCategoryByIdQuery,
    useGetProductsFilteredQuery
} from "@/store/api/productsApi";
import { useAddToCartMutation } from "@/store/api/cartApi";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

export default function CategoryPage() {
    const params = useParams();
    const categoryId = params?.id as string;

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // --- STATE FILTERS ---
    const pageParam = searchParams.get("page");
    // Используем useState, чтобы был доступен setPage
    const [page, setPage] = useState(pageParam ? Number(pageParam) : 1);

    // Синхронизируем состояние страницы с URL (для навигации Назад/Вперед)
    useEffect(() => {
        const p = searchParams.get("page");
        setPage(p ? Number(p) : 1);
    }, [searchParams]);

    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState<string>("all");
    const [sort, setSort] = useState<string>("new");
    const [size, setSize] = useState<string>("all");

    const LIMIT = 9;

    const handleFilterChange = (setter: any, value: any) => {
        setter(value);
        setPage(1); // Теперь setPage доступен

        // Сбрасываем параметр страницы в URL при изменении фильтров
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setPriceRange("all");
        setSort("new");
        setSize("all");
        setPage(1);

        // Сбрасываем параметр страницы в URL
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const hasActiveFilters = searchTerm || priceRange !== "all" || sort !== "new" || size !== "all";

    // --- ЗАПРОСЫ ---
    const { data: catData, isLoading: loadingCat } = useGetCategoryByIdQuery(categoryId);

    const {
        data: prodData,
        isLoading: loadingProd,
        isFetching: isFetchingProd
    } = useGetProductsFilteredQuery({
        categoryId,
        page,
        limit: LIMIT,
        search: searchTerm || undefined,
        price: priceRange === "all" ? undefined : priceRange,
        sort: sort === "new" ? undefined : sort,
        size: size === "all" ? undefined : size,
    });

    const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

    const category = catData?.category;
    const products = prodData?.products ?? [];
    const meta = prodData?.meta;

    const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await addToCart({
                productId: product.id,
                quantity: 1,
                size: product.sizes?.[0],
                color: product.colors?.[0],
            }).unwrap();
            toast.success("Added to cart");
        } catch {
            toast.error("Failed to add to cart");
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && (!meta || newPage <= meta.totalPages)) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", newPage.toString());
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // --- ЛОГИКА ЗАГРУЗКИ ---
    if (loadingCat) {
        return <CategorySkeletonFull />;
    }

    if (!category) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-500">
                <div className="bg-neutral-100 p-6 rounded-full mb-6">
                    <PackageX size={48} className="text-neutral-400" />
                </div>
                <h1 className="text-3xl font-bold text-neutral-900">Category not found</h1>
                <Button className="mt-8 gap-2" asChild>
                    <Link href="/products">
                        <ArrowLeft size={16} />
                        Back to Catalog
                    </Link>
                </Button>
            </div>
        );
    }

    const showSkeletons = isFetchingProd || loadingProd;
    const showProducts = !showSkeletons && products.length > 0;
    const showEmpty = !showSkeletons && products.length === 0;

    return (
        <main className="min-h-screen bg-[#fafafa] py-12 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto space-y-8">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2 pb-6 border-b border-gray-200"
                >
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-black transition-colors">Products</Link>
                        <span>/</span>
                        <span className="text-neutral-900 font-medium">{category.name}</span>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
                                {category.name}
                            </h1>
                            <div className="text-neutral-500 mt-2 min-h-[24px]">
                                {isFetchingProd ? (
                                    <Skeleton className="h-5 w-24" />
                                ) : (
                                    <span className="font-medium text-sm">
                                        {meta?.total ?? 0} items found
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* LAYOUT */}
                <div className="flex flex-col lg:flex-row gap-10 items-start">

                    {/* --- FILTERS SIDEBAR (ACCORDION) --- */}
                    <aside className="w-full lg:w-64 shrink-0 space-y-6 lg:sticky lg:top-28">

                        {/* Filter Header */}
                        <div className="flex items-center justify-between pb-2">
                            <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                                <SlidersHorizontal size={18} />
                                <span>Filters</span>
                            </div>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline transition-colors"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Search Input (Always Visible) */}
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                            <Input
                                placeholder="Search..."
                                className="pl-9 bg-white border-gray-200 focus-visible:ring-black h-10"
                                value={searchTerm}
                                onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)}
                            />
                        </div>

                        {/* Accordion Filters */}
                        <Accordion type="multiple" defaultValue={["sort", "price", "size"]} className="w-full">

                            {/* 1. Sort By */}
                            <AccordionItem value="sort" className="border-gray-200">
                                <AccordionTrigger className="text-sm font-semibold text-neutral-800 hover:no-underline py-3">
                                    Sort By
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-1">
                                        {[
                                            { value: "new", label: "Newest Arrivals" },
                                            { value: "price-asc", label: "Price: Low to High" },
                                            { value: "price-desc", label: "Price: High to Low" },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleFilterChange(setSort, option.value)}
                                                className={cn(
                                                    "flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md transition-colors",
                                                    sort === option.value
                                                        ? "bg-neutral-100 text-black font-medium"
                                                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                                                )}
                                            >
                                                {option.label}
                                                {sort === option.value && <Check size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* 2. Price Range */}
                            <AccordionItem value="price" className="border-gray-200">
                                <AccordionTrigger className="text-sm font-semibold text-neutral-800 hover:no-underline py-3">
                                    Price Range
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-1">
                                        {[
                                            { value: "all", label: "All Prices" },
                                            { value: "low", label: "Under 50₴" },
                                            { value: "mid", label: "50₴ - 200₴" },
                                            { value: "high", label: "200₴+" },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleFilterChange(setPriceRange, option.value)}
                                                className={cn(
                                                    "flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md transition-colors",
                                                    priceRange === option.value
                                                        ? "bg-neutral-100 text-black font-medium"
                                                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                                                )}
                                            >
                                                {option.label}
                                                {priceRange === option.value && <Check size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* 3. Size */}
                            <AccordionItem value="size" className="border-gray-200">
                                <AccordionTrigger className="text-sm font-semibold text-neutral-800 hover:no-underline py-3">
                                    Size
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-4 gap-2 pt-1">
                                        {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => handleFilterChange(setSize, size === s ? "all" : s)}
                                                className={cn(
                                                    "h-9 rounded-md border text-sm font-medium transition-all",
                                                    size === s
                                                        ? "bg-black text-white border-black"
                                                        : "bg-white text-neutral-600 border-gray-200 hover:border-neutral-300 hover:text-black"
                                                )}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>
                    </aside>

                    {/* --- PRODUCT GRID (RIGHT) --- */}
                    <div className="flex-1 w-full min-h-[500px]">

                        {/* SKELETONS */}
                        {showSkeletons && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                                {[...Array(6)].map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        )}

                        {/* PRODUCTS */}
                        {showProducts && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {products.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <ProductCard
                                            product={product}
                                            onAdd={(e) => handleAddToCart(e, product)}
                                            isAdding={isAdding}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* EMPTY STATE */}
                        {showEmpty && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-24 text-center border border-dashed border-gray-200 rounded-xl bg-white"
                            >
                                <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Search className="text-gray-400" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold text-neutral-900">No products found</h3>
                                <p className="text-neutral-500 mt-2 max-w-xs mx-auto">
                                    We couldn't find matches for your filters. Try creating a less specific search.
                                </p>
                                <Button variant="outline" className="mt-6" onClick={clearFilters}>
                                    Clear All Filters
                                </Button>
                            </motion.div>
                        )}

                        {/* PAGINATION */}
                        {!showSkeletons && meta && meta.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 pt-10 mt-8 border-t border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page <= 1}
                                    className="gap-2 pl-2.5"
                                >
                                    <ChevronLeft size={16} />
                                    Previous
                                </Button>

                                <div className="text-sm font-medium text-neutral-600 bg-white px-4 py-2 rounded-md border border-gray-200">
                                    Page {page} of {meta.totalPages}
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page >= meta.totalPages}
                                    className="gap-2 pr-2.5"
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

// --- КОМПОНЕНТ КАРТОЧКИ ТОВАРА ---
function ProductCard({ product, onAdd, isAdding }: { product: Product, onAdd: (e: any) => void, isAdding: boolean }) {
    return (
        <Link href={`/products/${product.id}`} className="block h-full group">
            <Card className="h-full overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white flex flex-col rounded-xl ring-1 ring-neutral-200/50">
                <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300 bg-neutral-50">
                            No Image
                        </div>
                    )}

                    {product.stock > 0 && (
                        <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out z-10">
                            <Button
                                className="w-full shadow-lg font-semibold bg-white text-black hover:bg-neutral-100"
                                onClick={onAdd}
                                disabled={isAdding}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Quick Add
                            </Button>
                        </div>
                    )}

                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        {product.stock <= 0 && (
                            <Badge variant="destructive" className="shadow-sm">Out of Stock</Badge>
                        )}
                        {(new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                            <Badge className="bg-blue-600 hover:bg-blue-700 shadow-sm">New</Badge>
                        )}
                    </div>
                </div>

                <CardContent className="p-5 flex flex-col flex-grow">
                    <div className="mb-2">
                        <h3 className="font-semibold text-neutral-900 text-lg leading-tight truncate group-hover:text-blue-600 transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1 line-clamp-1">
                            {product.description || "Fashion Item"}
                        </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2">
                        <span className="text-xl font-bold text-neutral-900">
                            {Number(product.price).toFixed(2)} ₴
                        </span>

                        {product.colors && product.colors.length > 0 && (
                            <div className="flex -space-x-1.5">
                                {product.colors.slice(0, 3).map((c, idx) => (
                                    <div
                                        key={idx}
                                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-neutral-100"
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                                {product.colors.length > 3 && (
                                    <div className="w-5 h-5 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center text-[9px] font-bold text-neutral-500 ring-1 ring-neutral-100">
                                        +{product.colors.length - 3}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

// --- СКЕЛЕТОН ОДНОЙ КАРТОЧКИ ---
function ProductCardSkeleton() {
    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-gray-100 h-full">
            <Skeleton className="h-[320px] w-full rounded-lg" />
            <div className="space-y-3 px-1 flex-grow">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between pt-4 mt-auto">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
            </div>
        </div>
    );
}

// --- СКЕЛЕТОН ВСЕЙ СТРАНИЦЫ ---
function CategorySkeletonFull() {
    return (
        <div className="min-h-screen bg-[#fafafa] py-12 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto space-y-8">
                <div className="space-y-4 border-b pb-6">
                    <Skeleton className="h-4 w-48 rounded" />
                    <Skeleton className="h-12 w-64 md:w-96 rounded-lg" />
                    <Skeleton className="h-6 w-32 rounded-md" />
                </div>
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="hidden lg:block w-64 space-y-6">
                        <Skeleton className="h-8 w-full rounded" />
                        <Skeleton className="h-20 w-full rounded" />
                        <Skeleton className="h-20 w-full rounded" />
                        <Skeleton className="h-32 w-full rounded" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}