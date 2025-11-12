"use client";

import { StatCard } from "../components/StatCard";
import { OrderChart } from "../components/OrderChart";
import { OrderActivity } from "../components/OrderActivity";
import { OrderFilters } from "../components/OrderFilters";
import { OrderTable } from "../components/OrderTable";
import { useGetOrderStatsQuery } from "@/store/api/adminApi";

export default function AdminOrders() {
    const { data, isLoading } = useGetOrderStatsQuery();

    const stats = data?.data?.stats ?? {
        total: 0,
        pending: 0,
        delivered: 0,
        canceled: 0,
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold">Orders</h1>

            {/* Карточки статистики */}
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

            {/* Контент и фильтры */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <OrderActivity />
                        <OrderChart />
                    </div>
                    <OrderTable />
                </div>

                <div className="xl:col-span-1">
                    <OrderFilters />
                </div>
            </div>
        </div>
    );
}