"use client";

import { motion } from "framer-motion";
import { AdminSkeleton } from "@/app/admin/components/skeletons/AdminSkeleton";
import { useAdminOrders } from "./hooks/useAdminOrders";

import { OrderChart } from "../components/order/OrderChart";
import { OrderActivity } from "../components/order/OrderActivity";
import { OrderFilters } from "../components/order/OrderFilters";
import { OrderTable } from "../components/order/OrderTable";
import {OrderStats} from "@/app/admin/components/order/OrderStats";

export default function AdminOrders() {
    const {
        stats,
        isLoading,
        filters,
        setStatus,
        setSort,
        resetFilters
    } = useAdminOrders();

    if (isLoading) {
        return <AdminSkeleton type="orders" />;
    }

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <h1 className="text-3xl font-semibold">Orders</h1>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <OrderStats stats={stats} isLoading={isLoading} />
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                <div className="xl:col-span-3 space-y-6">
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <OrderActivity />
                        <OrderChart />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <OrderTable
                            status={filters.status}
                            sort={filters.sort}
                        />
                    </motion.div>
                </div>

                <motion.div
                    className="xl:col-span-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <OrderFilters
                        status={filters.status}
                        sort={filters.sort}
                        onStatusChange={setStatus}
                        onSortChange={setSort}
                        onReset={resetFilters}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
}