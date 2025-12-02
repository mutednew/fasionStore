"use client";

import { Search, SlidersHorizontal, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useGetCategoriesQuery } from "@/store/api/productsApi";

interface ProductFiltersProps {
    // Values
    searchTerm: string;
    categoryId: string;
    sort: string;
    size: string;
    priceRange: [number, number];

    // Handlers
    setSearchTerm: (val: string) => void;
    setCategoryId: (val: string) => void;
    setSort: (val: string) => void;
    setSize: (val: string) => void;
    setPriceRange: (val: [number, number]) => void;
    onClear: () => void;

    // Options
    hideCategory?: boolean; // Скрыть выбор категории
}

export function ProductFilters({
   searchTerm,
   categoryId,
   sort,
   size,
   priceRange,
   setSearchTerm,
   setCategoryId,
   setSort,
   setSize,
   setPriceRange,
   onClear,
   hideCategory = false,
}: ProductFiltersProps) {

    const { data: catData } = useGetCategoriesQuery();
    const categories = catData?.categories ?? [];

    const hasActiveFilters =
        searchTerm ||
        (!hideCategory && categoryId !== "all") ||
        sort !== "new" ||
        size !== "all" ||
        priceRange[0] !== 0 ||
        priceRange[1] !== 50000;

    // Хендлеры для ручного ввода цены
    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (!isNaN(val) && val >= 0 && val <= 50000) {
            setPriceRange([val, priceRange[1]]);
        }
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (!isNaN(val) && val >= 0 && val <= 50000) {
            setPriceRange([priceRange[0], val]);
        }
    };

    return (
        <aside className="w-full lg:w-64 shrink-0 space-y-6 lg:sticky lg:top-28">
            <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2 text-neutral-900 font-semibold">
                    <SlidersHorizontal size={18} />
                    <span>Filters</span>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={onClear}
                        className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <Input
                    placeholder="Search..."
                    className="pl-9 bg-white border-gray-200 focus-visible:ring-black h-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* УБРАЛИ defaultValue. Теперь все секции закрыты по умолчанию.
               Если нужно открыть какую-то конкретную, передайте defaultValue={["price"]}
            */}
            <Accordion type="multiple" className="w-full">

                {/* Category Filter (Optional) */}
                {!hideCategory && (
                    <AccordionItem value="category" className="border-gray-200">
                        <AccordionTrigger className="text-sm font-semibold text-neutral-800 hover:no-underline py-3">
                            Category
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-1 pt-1">
                                <button
                                    onClick={() => setCategoryId("all")}
                                    className={cn(
                                        "flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md transition-colors",
                                        categoryId === "all" ? "bg-neutral-100 text-black font-medium" : "text-neutral-500 hover:bg-neutral-50"
                                    )}
                                >
                                    All Categories
                                    {categoryId === "all" && <Check size={14} />}
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategoryId(cat.id)}
                                        className={cn(
                                            "flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md transition-colors capitalize",
                                            categoryId === cat.id ? "bg-neutral-100 text-black font-medium" : "text-neutral-500 hover:bg-neutral-50"
                                        )}
                                    >
                                        {cat.name}
                                        {categoryId === cat.id && <Check size={14} />}
                                    </button>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Sort */}
                <AccordionItem value="sort" className="border-gray-200">
                    <AccordionTrigger className="text-sm font-semibold text-neutral-800 hover:no-underline py-3">
                        Sort By
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-1 pt-1">
                            {[
                                { value: "new", label: "Newest Arrivals" },
                                { value: "price-asc", label: "Price: Low to High" },
                                { value: "price-desc", label: "Price: High to Low" },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setSort(option.value)}
                                    className={cn(
                                        "flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md transition-colors",
                                        sort === option.value ? "bg-neutral-100 text-black font-medium" : "text-neutral-500 hover:bg-neutral-50"
                                    )}
                                >
                                    {option.label}
                                    {sort === option.value && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Price Filter */}
                <AccordionItem value="price" className="border-gray-200">
                    <AccordionTrigger className="text-sm font-semibold text-neutral-800 hover:no-underline py-3">
                        Price Range
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 px-2">
                        <div className="space-y-4">
                            <Slider
                                defaultValue={[0, 50000]}
                                value={priceRange}
                                max={50000}
                                step={100}
                                min={0}
                                onValueChange={(val) => setPriceRange(val as [number, number])}
                                className="my-2"
                            />
                            <div className="flex items-center justify-between gap-3">
                                <div className="relative w-full">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400">₴</span>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={50000}
                                        value={priceRange[0]}
                                        onChange={handleMinPriceChange}
                                        className="h-8 pl-5 text-xs bg-white border-neutral-200 focus-visible:ring-black"
                                    />
                                </div>
                                <span className="text-neutral-300">–</span>
                                <div className="relative w-full">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400">₴</span>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={50000}
                                        value={priceRange[1]}
                                        onChange={handleMaxPriceChange}
                                        className="h-8 pl-5 text-xs bg-white border-neutral-200 focus-visible:ring-black"
                                    />
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Size */}
                <AccordionItem value="size" className="border-gray-200">
                    <AccordionTrigger className="text-sm font-semibold text-neutral-800 hover:no-underline py-3">
                        Size
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-4 gap-2 pt-2">
                            {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSize(size === s ? "all" : s)}
                                    className={cn(
                                        "h-9 rounded-md border text-sm font-medium transition-all",
                                        size === s ? "bg-black text-white border-black" : "bg-white text-neutral-600 border-gray-200 hover:border-black"
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
    );
}