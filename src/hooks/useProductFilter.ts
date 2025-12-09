import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export const useProductFilters = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Чтение страницы из URL
    const pageParam = searchParams.get("page");
    const [page, setPage] = useState(pageParam ? Number(pageParam) : 1);

    // Состояния фильтров
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryId, setCategoryId] = useState<string>("all");
    const [sort, setSort] = useState<string>("new");
    const [size, setSize] = useState<string>("all");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 3430]);
    const [debouncedPrice, setDebouncedPrice] = useState<[number, number]>([0, 3430]);

    // Синхронизация page при смене URL (назад/вперед в браузере)
    useEffect(() => {
        const p = searchParams.get("page");
        setPage(p ? Number(p) : 1);
    }, [searchParams]);

    // Дебаунс цены
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedPrice(priceRange);
            if (priceRange[0] !== 0 || priceRange[1] !== 3430) {
                setPage(1); // Сброс страницы при смене фильтра
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [priceRange]);

    const updateUrl = (newPage?: number) => {
        const params = new URLSearchParams(searchParams.toString());
        // Если это страница категорий, мы не должны менять id в url, только query params
        // Но Next.js usePathname уже содержит /categories/[id], так что всё ок.

        params.set("page", (newPage ?? 1).toString());
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        window.scrollTo({ top: 0, behavior: "auto" });
    };

    // Обертка для смены любого фильтра со сбросом страницы
    const handleFilterChange = (setter: (val: any) => void, value: any) => {
        setter(value);
        setPage(1);
        // В реальном приложении можно тут же обновлять URL параметры фильтров,
        // но пока оставим как у тебя было — обновление URL только для page
        updateUrl(1);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setCategoryId("all");
        setSort("new");
        setSize("all");
        setPriceRange([0, 3430]);
        setPage(1);
        updateUrl(1);
    };

    const hasActiveFilters =
        searchTerm ||
        (categoryId !== "all" && !pathname.includes("/categories/")) || // Не считаем категорию фильтром, если мы на стр. категории
        sort !== "new" ||
        size !== "all" ||
        priceRange[0] !== 0 ||
        priceRange[1] !== 3430;

    return {
        page,
        setPage,
        searchTerm,
        setSearchTerm,
        categoryId,
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
        hasActiveFilters,
        updateUrl,
    };
};