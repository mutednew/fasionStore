"use client";

import {
    useGetOrdersQuery
} from "@/store/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

// маленькая функция для "2h ago"
function timeAgo(dateString: string) {
    const diff = (Date.now() - new Date(dateString).getTime()) / 1000;

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}

export function OrderActivity() {
    const { data, isLoading } = useGetOrdersQuery();
    const orders = data?.data.orders ?? [];

    // создаём "историю" активности
    const activity = orders.slice(0, 8).map((o) => {
        let text = "";

        switch (o.status) {
            case "PENDING":
                text = `New order #${o.id.slice(0, 6)} created by ${o.user?.name || "Customer"}`;
                break;
            case "PAID":
                text = `Order #${o.id.slice(0, 6)} was paid`;
                break;
            case "SHIPPED":
                text = `Order #${o.id.slice(0, 6)} shipped`;
                break;
            case "DELIVERED":
                text = `Order #${o.id.slice(0, 6)} delivered`;
                break;
            case "CANCELED":
                text = `Order #${o.id.slice(0, 6)} canceled`;
                break;
        }

        return {
            id: o.id,
            text,
            time: timeAgo(o.createdAt),
            status: o.status
        };
    });

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : (
                    <AnimatePresence>
                        <div className="space-y-4">
                            {activity.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-start gap-3"
                                >
                                    <div
                                        className={`h-2 w-2 mt-2 rounded-full ${
                                            item.status === "DELIVERED"
                                                ? "bg-green-500"
                                                : item.status === "CANCELED"
                                                    ? "bg-red-500"
                                                    : item.status === "SHIPPED"
                                                        ? "bg-blue-500"
                                                        : "bg-yellow-500"
                                        }`}
                                    />
                                    <div>
                                        <p className="text-sm">{item.text}</p>
                                        <p className="text-xs text-muted-foreground">{item.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </CardContent>
        </Card>
    );
}