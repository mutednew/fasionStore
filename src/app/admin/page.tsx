"use client";

import {
    useGetAdminProductsQuery,
    useGetOrdersQuery,
    useGetAdminCategoriesQuery,
    useGetOrderStatsQuery,
} from "@/store/api/adminApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AdminSkeleton } from "@/app/admin/components/skeletons/AdminSkeleton";
import { DollarSign, Package, ShoppingBag, Clock } from "lucide-react";
import { DashboardChart } from "@/app/admin/components/dashboard/DashboardChart";
import { OrderActivity } from "@/app/admin/components/order/OrderActivity";

export default function AdminDashboard() {
    const { data: productsRes, isLoading: loadingProducts } = useGetAdminProductsQuery();
    const { data: ordersRes, isLoading: loadingOrders } = useGetOrdersQuery();
    const { data: categoriesRes, isLoading: loadingCategories } = useGetAdminCategoriesQuery();
    const { data: statsRes, isLoading: loadingStats } = useGetOrderStatsQuery();

    if (loadingProducts || loadingOrders || loadingCategories || loadingStats)
        return <AdminSkeleton type="dashboard" />;

    const products = productsRes?.data.products ?? [];
    const orders = ordersRes?.data.orders ?? [];
    const categories = categoriesRes?.data.categories ?? [];

    const stats = statsRes?.data?.stats ?? {
        pending: 0,
        paid: 0,
        shipped: 0,
        delivered: 0,
        canceled: 0,
        total: 0
    };

    // --- ИСПРАВЛЕННЫЙ РАСЧЕТ ---
    const totalSales = orders.reduce((acc, order) => {
        // Не учитываем отмененные заказы в выручке (по желанию)
        if (order.status === "CANCELED") return acc;

        // Главное исправление:
        // 1. Приводим к числу (так как может быть string)
        // 2. Доверяем order.total, так как он включает промокоды и доставку
        const finalTotal = Number(order.total);

        return acc + (isNaN(finalTotal) ? 0 : finalTotal);
    }, 0);

    const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{products.length}</div>
                        <p className="text-xs text-muted-foreground">{categories.length} categories</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingOrders}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                <div className="lg:col-span-4">
                    <DashboardChart stats={stats} />
                </div>
                <div className="lg:col-span-3">
                    <OrderActivity />
                </div>
            </div>
        </div>
    );
}