"use client";

import { motion } from "framer-motion";
import { AdminSkeleton } from "@/app/admin/components/skeletons/AdminSkeleton";
import { useAdminProducts } from "@/app/admin/products/hooks/useAdminProducts";
import { ProductsFilterBar } from "@/app/admin/components/product/ProductsFilterBar";
import { ProductsTable } from "@/app/admin/components/product/ProductsTable";

export default function AdminProducts() {
    const {
        products,
        categories,
        isLoading,
        filters,
        setSearchTerm,
        setFilterCategory,
        setStockStatus,
        setPriceRange,
        setSortBy,
        handleDelete
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

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
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

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <ProductsTable
                    products={products}
                    categories={categories}
                    onDelete={handleDelete}
                />
            </motion.div>
        </motion.div>
    );
}