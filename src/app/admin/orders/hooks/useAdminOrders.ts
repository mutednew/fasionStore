import { useState } from "react";
import { useGetOrderStatsQuery } from "@/store/api/adminApi";

export const useAdminOrders = () => {
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("date-desc");

    const { data, isLoading } = useGetOrderStatsQuery();

    const stats = data?.data?.stats ?? {
        total: 0,
        pending: 0,
        delivered: 0,
        canceled: 0,
    };

    const resetFilters = () => {
        setStatus("all");
        setSort("date-desc");
    };

    return {
        stats,
        isLoading,
        filters: {
            status,
            sort,
        },
        setStatus,
        setSort,
        resetFilters,
    };
};