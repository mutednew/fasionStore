"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSkeleton } from "@/app/admin/components/skeletons/AdminSkeleton";
import { useAdminProducts } from "@/app/admin/products/hooks/useAdminProducts";
import { ProductsFilterBar } from "@/app/admin/components/product/ProductsFilterBar";
import { ProductsTable } from "@/app/admin/components/product/ProductsTable";

export default function AdminProducts() {
    const {
        products, meta, categories, isLoading, filters,
        setSearchTerm, setFilterCategory, setStockStatus, setPriceRange, setSortBy, setPage,
        handleDelete,
        // Новые свойства для массовых действий
        selectedIds, handleSelectOne, handleSelectAll, handleBulkDiscount, isBulkUpdating
    } = useAdminProducts();

    if (isLoading) return <AdminSkeleton type="products" />;

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Products Management</h1>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ProductsFilterBar
                    filters={filters}
                    categories={categories}
                    setSearchTerm={setSearchTerm}
                    setFilterCategory={setFilterCategory}
                    setStockStatus={setStockStatus}
                    setPriceRange={setPriceRange}
                    setSortBy={setSortBy}
                />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="space-y-4">
                    <ProductsTable
                        products={products}
                        categories={categories}
                        onDelete={handleDelete}
                        // Передаем новые пропсы
                        selectedIds={selectedIds}
                        onSelectOne={handleSelectOne}
                        onSelectAll={handleSelectAll}
                        onBulkDiscount={handleBulkDiscount}
                        isBulkUpdating={isBulkUpdating}
                    />

                    {meta.totalPages > 1 && (
                        <div className="flex items-center justify-between px-2 border-t pt-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {(meta.page - 1) * meta.limit + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} entries
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(meta.page - 1)}
                                    disabled={meta.page <= 1}
                                    className="h-8 gap-1"
                                >
                                    <ChevronLeft className="h-4 w-4" /> Previous
                                </Button>
                                <div className="text-sm font-medium min-w-[80px] text-center">
                                    Page {meta.page} of {meta.totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(meta.page + 1)}
                                    disabled={meta.page >= meta.totalPages}
                                    className="h-8 gap-1"
                                >
                                    Next <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}