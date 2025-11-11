"use client";

import {
    useGetProductsQuery,
    useGetOrdersQuery,
    useGetCategoriesQuery,
} from "@/store/api/adminApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
    const { data: productsRes, isLoading: loadingProducts } = useGetProductsQuery();
    const { data: ordersRes, isLoading: loadingOrders } = useGetOrdersQuery();
    const { data: categoriesRes, isLoading: loadingCategories } = useGetCategoriesQuery();

    // 🌀 Общее состояние загрузки
    if (loadingProducts || loadingOrders || loadingCategories)
        return <div className="p-8 text-gray-500">Loading data...</div>;

    // 🧩 Распаковываем данные из типизированных ApiResponse
    const products = productsRes?.data.products ?? [];
    const orders = ordersRes?.data.orders ?? [];
    const categories = categoriesRes?.data.categories ?? [];

    // 💰 Подсчёт общей суммы продаж
    const totalSales = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);

    // ⏳ Подсчёт заказов в статусе Pending
    const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Products</CardTitle>
                    </CardHeader>
                    <CardContent className="text-lg font-medium">{products.length}</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="text-lg font-medium">{orders.length}</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="text-lg font-medium">{categories.length}</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pending Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="text-lg font-medium">{pendingOrders}</CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Total Sales</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-semibold">
                    ${totalSales.toFixed(2)}
                </CardContent>
            </Card>
        </div>
    );
}