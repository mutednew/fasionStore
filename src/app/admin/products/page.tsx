"use client";

import { useMemo, useState } from "react";
import {
    useGetProductsQuery,
    useDeleteProductMutation,
    useGetCategoriesQuery,
} from "@/store/api/adminApi";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import type { Product } from "@/types";
import { AddProductModal } from "@/app/admin/components/modals/AddProductModal";
import { EditProductModal } from "@/app/admin/components/modals/EditProductModal";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProducts() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [stockStatus, setStockStatus] = useState("all");
    const [priceRange, setPriceRange] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const { data: productsRes, isLoading } = useGetProductsQuery();
    const { data: categoriesRes } = useGetCategoriesQuery();
    const [deleteProduct] = useDeleteProductMutation();
    const { toast } = useToast();

    const products = productsRes?.data.products ?? [];
    const categories = categoriesRes?.data.categories ?? [];

    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        if (searchTerm) {
            filtered = filtered.filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCategory !== "all") {
            filtered = filtered.filter((p) => p.categoryId === filterCategory);
        }

        if (stockStatus === "in-stock") {
            filtered = filtered.filter((p) => p.stock > 0);
        } else if (stockStatus === "out-of-stock") {
            filtered = filtered.filter((p) => p.stock <= 0);
        }

        filtered = filtered.filter((p) => {
            const price = Number(p.price);
            if (priceRange === "low") return price < 50;
            if (priceRange === "mid") return price >= 50 && price <= 200;
            if (priceRange === "high") return price > 200;
            return true;
        });

        filtered.sort((a, b) => {
            if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
            if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
            if (sortBy === "stock-desc") return (b.stock ?? 0) - (a.stock ?? 0);
            if (sortBy === "newest")
                return new Date(b.createdAt ?? "").getTime() -
                    new Date(a.createdAt ?? "").getTime();
            return 0;
        });

        return filtered;
    }, [products, searchTerm, filterCategory, stockStatus, priceRange, sortBy]);

    const handleDelete = async (id: string) => {
        if (confirm("Delete this product?")) {
            try {
                await deleteProduct(id).unwrap();
                toast({
                    title: "Product deleted",
                    description: "The product was removed successfully.",
                });
            } catch {
                toast({
                    variant: "destructive",
                    title: "Failed to delete product",
                    description: "Something went wrong, please try again.",
                });
            }
        }
    };

    if (isLoading)
        return <div className="p-8 text-gray-500">Loading products...</div>;

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h1 className="text-3xl font-semibold">Products</h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4 items-center">
                        <Input
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-xs"
                        />

                        <Select onValueChange={setFilterCategory} value={filterCategory}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All categories</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select onValueChange={setStockStatus} value={stockStatus}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Stock Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="in-stock">In Stock</SelectItem>
                                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select onValueChange={setPriceRange} value={priceRange}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Price Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All prices</SelectItem>
                                <SelectItem value="low">Under $50</SelectItem>
                                <SelectItem value="mid">$50 - $200</SelectItem>
                                <SelectItem value="high">Above $200</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select onValueChange={setSortBy} value={sortBy}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="price-asc">Price: Low → High</SelectItem>
                                <SelectItem value="price-desc">Price: High → Low</SelectItem>
                                <SelectItem value="stock-desc">Stock: High → Low</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="ml-auto">
                            <AddProductModal />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <Card>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-muted/40 text-left">
                        <tr>
                            <th className="px-4 py-3">Image</th>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                        </thead>
                        <AnimatePresence>
                            <tbody>
                            {filteredProducts.map((p) => (
                                <motion.tr
                                    key={p.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    className="border-t hover:bg-muted/20 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        {p.imageUrl ? (
                                            <motion.img
                                                src={
                                                    p.imageUrl.startsWith("http")
                                                        ? p.imageUrl
                                                        : `${process.env.NEXT_PUBLIC_BASE_URL || ""}${p.imageUrl}`
                                                }
                                                alt={p.name}
                                                className="w-12 h-12 object-cover rounded-md border"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-gray-400 text-xs">
                                                —
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium">{p.name}</td>
                                    <td className="px-4 py-3">
                                        {categories.find((c) => c.id === p.categoryId)?.name ?? "—"}
                                    </td>
                                    <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                                    <td className="px-4 py-3">{p.stock ?? 0}</td>
                                    <td className="px-4 py-3">
                                        {p.stock && p.stock > 0 ? (
                                            <Badge variant="success">Active</Badge>
                                        ) : (
                                            <Badge variant="destructive">Out of stock</Badge>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <EditProductModal product={p} />
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(p.id)}
                                                asChild
                                            >
                                                <motion.div whileTap={{ scale: 0.9 }}>
                                                    <Trash2 className="w-4 h-4" />
                                                </motion.div>
                                            </Button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            </tbody>
                        </AnimatePresence>
                    </table>

                    {filteredProducts.length === 0 && (
                        <motion.div
                            className="p-6 text-center text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            No products found
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}