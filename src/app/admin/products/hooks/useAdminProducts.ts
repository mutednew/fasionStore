import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
    useGetAdminProductsQuery,
    useDeleteProductMutation,
    useGetAdminCategoriesQuery,
    useApplyBulkDiscountMutation,
} from "@/store/api/adminApi";

export const useAdminProducts = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const page = Number(searchParams.get("page")) || 1;
    const filterCategory = searchParams.get("categoryId") || "all";
    const stockStatus = searchParams.get("stockStatus") || "all";
    const priceRange = searchParams.get("priceRange") || "all";
    const sortBy = searchParams.get("sort") || "newest";
    const urlSearch = searchParams.get("search") || "";
    const [localSearch, setLocalSearch] = useState(urlSearch);

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        setLocalSearch(urlSearch);
    }, [urlSearch]);

    const updateUrl = useCallback((key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all" && value !== "") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        if (key !== "page") params.set("page", "1");
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchParams, pathname, replace]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== urlSearch) updateUrl("search", localSearch);
        }, 300);
        return () => clearTimeout(timer);
    }, [localSearch, urlSearch, updateUrl]);

    const queryParams: any = { page, limit: 10, sort: sortBy };
    if (localSearch) queryParams.search = localSearch;
    if (filterCategory !== "all") queryParams.categoryId = filterCategory;
    if (stockStatus !== "all") queryParams.stockStatus = stockStatus;
    if (priceRange === "low") queryParams.maxPrice = 50;
    if (priceRange === "mid") { queryParams.minPrice = 50; queryParams.maxPrice = 200; }
    if (priceRange === "high") queryParams.minPrice = 200;

    const { data: productsRes, isLoading: isProductsLoading } = useGetAdminProductsQuery(queryParams);
    const { data: categoriesRes } = useGetAdminCategoriesQuery();
    const [deleteProduct] = useDeleteProductMutation();
    const [applyBulkDiscount, { isLoading: isBulkUpdating }] = useApplyBulkDiscountMutation();

    const products = productsRes?.data.products ?? [];
    const meta = productsRes?.data.meta ?? { total: 0, page: 1, limit: 10, totalPages: 1 };
    const categories = categoriesRes?.data.categories ?? [];

    const handleSelectOne = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const ids = products.map((p) => p.id);
            setSelectedIds(new Set(ids));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleBulkDiscount = async (percent: number) => {
        if (selectedIds.size === 0) return;
        try {
            await applyBulkDiscount({
                ids: Array.from(selectedIds),
                discountPercent: percent
            }).unwrap();

            toast.success("Discount applied successfully");
            setSelectedIds(new Set());
        } catch {
            toast.error("Failed to apply discount");
        }
    };

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
        products,
        meta,
        categories,
        isLoading: isProductsLoading,
        isBulkUpdating,

        selectedIds,
        handleSelectOne,
        handleSelectAll,
        handleBulkDiscount,

        filters: { searchTerm: localSearch, filterCategory, stockStatus, priceRange, sortBy, page },
        setSearchTerm: setLocalSearch,
        setFilterCategory: (v: string) => updateUrl("categoryId", v),
        setStockStatus: (v: string) => updateUrl("stockStatus", v),
        setPriceRange: (v: string) => updateUrl("priceRange", v),
        setSortBy: (v: string) => updateUrl("sort", v),
        setPage: (p: number) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", p.toString());
            replace(`${pathname}?${params.toString()}`, { scroll: false });
        },
        handleDelete
    };
};