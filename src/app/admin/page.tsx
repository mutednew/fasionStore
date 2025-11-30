"use client";

import {
    useGetAdminProductsQuery,
    useGetOrdersQuery,
    useGetAdminCategoriesQuery,
} from "@/store/api/adminApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AdminSkeleton } from "@/app/admin/components/skeletons/AdminSkeleton";

export default function AdminDashboard() {
    const { data: productsRes, isLoading: loadingProducts } = useGetAdminProductsQuery();
    const { data: ordersRes, isLoading: loadingOrders } = useGetOrdersQuery();
    const { data: categoriesRes, isLoading: loadingCategories } = useGetAdminCategoriesQuery();

    if (loadingProducts || loadingOrders || loadingCategories)
        return <AdminSkeleton type="dashboard" />;

    const products = productsRes?.data.products ?? [];
    const orders = ordersRes?.data.orders ?? [];
    const categories = categoriesRes?.data.categories ?? [];

    const totalSales = orders.reduce((acc, order) => {
        if ("total" in order && typeof order.total === 'number') {
            return acc + order.total;
        }

        if (order.items && Array.isArray(order.items)) {
            const orderSum = order.items.reduce((sum, item) => {
                return sum + (Number(item.price) * item.quantity);
            }, 0);
            return acc + orderSum;
        }

        return acc;
    }, 0);

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