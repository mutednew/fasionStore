import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
    useGetAdminProductsQuery,
    useDeleteProductMutation,
    useGetAdminCategoriesQuery,
} from "@/store/api/adminApi";

export const useAdminProducts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [stockStatus, setStockStatus] = useState("all");
    const [priceRange, setPriceRange] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const { data: productsRes, isLoading: isProductsLoading } = useGetAdminProductsQuery();
    const { data: categoriesRes } = useGetAdminCategoriesQuery();
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

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
                return new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime();
            return 0;
        });

        return filtered;
    }, [products, searchTerm, filterCategory, stockStatus, priceRange, sortBy]);

    const handleDelete = async (id: string) => {
        if (confirm("Delete this product?")) {
            try {
                await deleteProduct(id).unwrap();
                toast.success("Product deleted");
            } catch {
                toast.error("Failed to delete product");
            }
        }
    };

    return {
        products: filteredProducts,
        categories,
        isLoading: isProductsLoading,
        isDeleting,

        filters: {
            searchTerm,
            filterCategory,
            stockStatus,
            priceRange,
            sortBy
        },

        setSearchTerm,
        setFilterCategory,
        setStockStatus,
        setPriceRange,
        setSortBy,

        handleDelete
    };
};