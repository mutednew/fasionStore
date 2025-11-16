"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminSkeletonProps {
    type?:
        | "products"
        | "orders"
        | "categories"
        | "dashboard"
}

export function AdminSkeleton({ type = "dashboard" }: AdminSkeletonProps) {
    switch (type) {

        /* ===========================
                PRODUCTS PAGE
        ============================ */
        case "products":
            return (
                <div className="space-y-6">
                    <Skeleton className="h-8 w-40" />

                    <Card>
                        <CardContent className="p-4 flex gap-4 flex-wrap">
                            <Skeleton className="h-10 w-48" />
                            <Skeleton className="h-10 w-48" />
                            <Skeleton className="h-10 w-40" />
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-32" />
                        </CardContent>
                    </Card>

                    <ProductsTableSkeleton />
                </div>
            );

        /* ===========================
                ORDERS PAGE
        ============================ */
        case "orders":
            return (
                <div className="space-y-6">
                    <Skeleton className="h-8 w-40" />

                    {/* Статистика */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4">
                                    <Skeleton className="h-6 w-24 mb-2" />
                                    <Skeleton className="h-8 w-20" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Контент */}
                    <Card>
                        <CardContent className="p-4">
                            <Skeleton className="h-80 w-full" />
                        </CardContent>
                    </Card>
                </div>
            );

        /* ===========================
                CATEGORIES PAGE
        ============================ */
        case "categories":
            return (
                <div className="space-y-6">
                    <Skeleton className="h-8 w-40" />
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            );

        /* ===========================
                DASHBOARD PAGE
        ============================ */
        case "dashboard":
            return (
                <div className="space-y-6">
                    <Skeleton className="h-8 w-40" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4">
                                    <Skeleton className="h-6 w-24 mb-2" />
                                    <Skeleton className="h-8 w-16" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card>
                        <CardContent className="p-4">
                            <Skeleton className="h-80 w-full" />
                        </CardContent>
                    </Card>
                </div>
            );

        default:
            return null;
    }
}

/* =========================
    Products Table Skeleton
========================= */

function ProductsTableSkeleton() {
    return (
        <Card>
            <CardContent className="p-0">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-muted/40">
                    <tr>
                        {Array.from({ length: 7 }).map((_, i) => (
                            <th key={i} className="px-4 py-3">
                                <Skeleton className="h-4 w-24" />
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {Array.from({ length: 7 }).map((_, rowIndex) => (
                        <tr key={rowIndex} className="border-t">
                            <td className="px-4 py-3">
                                <Skeleton className="h-12 w-12 rounded-md" />
                            </td>
                            <td className="px-4 py-3">
                                <Skeleton className="h-4 w-32" />
                            </td>
                            <td className="px-4 py-3">
                                <Skeleton className="h-4 w-28" />
                            </td>
                            <td className="px-4 py-3">
                                <Skeleton className="h-4 w-20" />
                            </td>
                            <td className="px-4 py-3">
                                <Skeleton className="h-4 w-10" />
                            </td>
                            <td className="px-4 py-3">
                                <Skeleton className="h-4 w-20" />
                            </td>
                            <td className="px-4 py-3 text-right">
                                <Skeleton className="h-8 w-20 ml-auto" />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}