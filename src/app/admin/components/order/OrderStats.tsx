"use client";

import { StatCard } from "@/app/admin/components/order/StatCard";

interface OrderStatsProps {
    stats: {
        total: number;
        pending: number;
        delivered: number;
        canceled: number;
    };
    isLoading: boolean;
}

export function OrderStats({ stats, isLoading }: OrderStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Total Orders"
                value={isLoading ? "..." : stats.total.toString()}
            />
            <StatCard
                title="Pending"
                value={isLoading ? "..." : stats.pending.toString()}
                color="text-yellow-500"
            />
            <StatCard
                title="Completed"
                value={isLoading ? "..." : stats.delivered.toString()}
                color="text-green-600"
            />
            <StatCard
                title="Cancelled"
                value={isLoading ? "..." : stats.canceled.toString()}
                color="text-red-500"
            />
        </div>
    );
}