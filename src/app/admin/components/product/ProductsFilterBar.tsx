"use client";

import { Search } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { AddProductModal } from "@/app/admin/components/modals/AddProductModal";
import { AddCategoryModal } from "@/app/admin/components/modals/AddCategoryModal";
import { Category } from "@/types";

interface ProductsFilterBarProps {
    filters: {
        searchTerm: string;
        filterCategory: string;
        stockStatus: string;
        priceRange: string;
        sortBy: string;
    };
    categories: Category[];
    setSearchTerm: (v: string) => void;
    setFilterCategory: (v: string) => void;
    setStockStatus: (v: string) => void;
    setPriceRange: (v: string) => void;
    setSortBy: (v: string) => void;
}

export function ProductsFilterBar({
  filters,
  categories,
  setSearchTerm,
  setFilterCategory,
  setStockStatus,
  setPriceRange,
  setSortBy,
}: ProductsFilterBarProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Filters & Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col lg:flex-row flex-wrap gap-4 items-start lg:items-center">

                <div className="relative w-full lg:w-auto lg:max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={filters.searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Select onValueChange={setFilterCategory} value={filters.filterCategory}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select onValueChange={setStockStatus} value={filters.stockStatus}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Stock" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Stock</SelectItem>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={setPriceRange} value={filters.priceRange}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Price" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Any Price</SelectItem>
                        <SelectItem value="low">Under $50</SelectItem>
                        <SelectItem value="mid">$50 - $200</SelectItem>
                        <SelectItem value="high">Above $200</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={setSortBy} value={filters.sortBy}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price-asc">Price: Low → High</SelectItem>
                        <SelectItem value="price-desc">Price: High → Low</SelectItem>
                        <SelectItem value="stock-desc">Stock: High → Low</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex gap-3 ml-auto w-full lg:w-auto">
                    <AddCategoryModal />
                    <AddProductModal />
                </div>
            </CardContent>
        </Card>
    );
}