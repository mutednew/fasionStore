"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import { useGetCategoryByIdQuery, useGetProductsFilteredQuery } from "@/store/api/productsApi";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductFilters } from "@/components/product/ProductFilters";
import { useProductFilters } from "@/hooks/useProductFilter";
import {ProductCard, ProductCardSkeleton} from "@/components/product/ProductCart";

export default function CategoryPage() {
    const params = useParams();
    const categoryId = params?.id as string;

    const {
        page,
        setPage,
        searchTerm,
        setSearchTerm,
        setCategoryId,
        sort,
        setSort,
        size,
        setSize,
        priceRange,
        setPriceRange,
        debouncedPrice,
        handleFilterChange,
        clearFilters,
        updateUrl,
    } = useProductFilters();

    const LIMIT = 9;

    const { data: catData, isLoading: loadingCat } = useGetCategoryByIdQuery(categoryId);
    const category = catData?.category;

    const {
        data: prodData,
        isLoading: loadingProd,
        isFetching: isFetchingProd
    } = useGetProductsFilteredQuery({
        categoryId,
        page,
        limit: LIMIT,
        search: searchTerm || undefined,
        sort: sort === "new" ? undefined : sort,
        size: size === "all" ? undefined : size,
        minPrice: debouncedPrice[0],
        maxPrice: debouncedPrice[1],
    });

    const products = prodData?.products ?? [];
    const meta = prodData?.meta;

    const productsKey = useMemo(() => {
        return JSON.stringify({ page, categoryId, sort, size, minPrice: debouncedPrice[0], maxPrice: debouncedPrice[1], searchTerm });
    }, [page, categoryId, sort, size, debouncedPrice, searchTerm]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && (!meta || newPage <= meta.totalPages)) {
            setPage(newPage);
            updateUrl(newPage);
        }
    };

    if (loadingCat) return <CategorySkeletonFull />;

    if (!category && !loadingCat) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl font-bold text-neutral-900">Category not found</h1>
                <Button className="mt-8" asChild><Link href="/products">Back to Catalog</Link></Button>
            </div>
        );
    }

    const showSkeletons = isFetchingProd;
    const showProducts = !showSkeletons && products.length > 0;
    const showEmpty = !showSkeletons && products.length === 0;

    return (
        <main className="min-h-screen bg-[#fafafa] py-12 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto space-y-8">
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
                        <span className="text-neutral-900 font-medium">{category?.name}</span>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
                                {category?.name}
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

                <div className="flex flex-col lg:flex-row gap-10 items-start">

                    <ProductFilters
                        searchTerm={searchTerm}
                        setSearchTerm={(v) => handleFilterChange(setSearchTerm, v)}
                        categoryId={categoryId}
                        setCategoryId={() => {}}
                        hideCategory={true}
                        sort={sort}
                        setSort={(v) => handleFilterChange(setSort, v)}
                        size={size}
                        setSize={(v) => handleFilterChange(setSize, v)}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        onClear={clearFilters}
                    />

                    <div className="flex-1 w-full min-h-[500px]">

                        {showSkeletons && (
                            <div key="skeletons" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                                {[...Array(9)].map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        )}

                        {showProducts && (
                            <motion.div
                                key={productsKey}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </motion.div>
                        )}

                        {showEmpty && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-24 text-center border border-dashed border-gray-200 rounded-xl bg-white"
                            >
                                <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Search className="text-gray-400" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold text-neutral-900">No products found</h3>
                                <p className="text-neutral-500 mt-2 max-w-xs mx-auto">
                                    This category seems empty or no items match your filters.
                                </p>
                                <Button variant="outline" className="mt-6" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            </motion.div>
                        )}

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