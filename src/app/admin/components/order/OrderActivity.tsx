"use client";

import { useGetOrdersQuery } from "@/store/api/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Order } from "@/types";

// Расширяем тип Order локально или глобально, чтобы TS знал про user
interface OrderWithUser extends Order {
    user?: {
        name: string;
        email: string;
    };
}

// маленькая функция для "2h ago"
function timeAgo(dateString: string) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "recently";

    const diff = (Date.now() - date.getTime()) / 1000;

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}

export function OrderActivity() {
    const { data, isLoading } = useGetOrdersQuery();
    // Приводим к нужному типу
    const orders = (data?.data?.orders ?? []) as OrderWithUser[];

    // создаём "историю" активности
    const activity = orders.slice(0, 8).map((o) => {
        let text = "";
        // Используем имя, если есть, иначе email, иначе ID
        const userName = o.user?.name || o.user?.email || "Customer";
        const orderId = o.id.slice(0, 8).toUpperCase();

        switch (o.status) {
            case "PENDING":
                text = `New order #${orderId} placed by ${userName}`;
                break;
            case "PAID":
                text = `Order #${orderId} was paid successfully`;
                break;
            case "SHIPPED":
                text = `Order #${orderId} has been shipped`;
                break;
            case "DELIVERED":
                text = `Order #${orderId} delivered to customer`;
                break;
            case "CANCELED":
                text = `Order #${orderId} was canceled`;
                break;
            default:
                text = `Order #${orderId} updated to ${o.status}`;
        }

        return {
            id: o.id,
            text,
            time: timeAgo(o.createdAt),
            status: o.status
        };
    });

    return (
        <Card className="shadow-sm border-none">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-neutral-800">Recent Activity</CardTitle>
            </CardHeader>

            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-3 animate-pulse">
                                <div className="h-2 w-2 mt-2 rounded-full bg-gray-200" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {activity.length === 0 ? (
                            <p className="text-sm text-neutral-500">No recent activity</p>
                        ) : (
                            activity.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-start gap-3 relative pl-2"
                                >
                                    <div
                                        className={`shrink-0 h-2.5 w-2.5 mt-1.5 rounded-full ring-4 ring-white ${
                                            item.status === "DELIVERED" ? "bg-green-500"
                                                : item.status === "CANCELED" ? "bg-red-500"
                                                    : item.status === "SHIPPED" ? "bg-blue-500"
                                                        : item.status === "PAID" ? "bg-indigo-500"
                                                            : "bg-yellow-500"
                                        }`}
                                    />
                                    <div>
                                        <p className="text-sm text-neutral-700 leading-snug">{item.text}</p>
                                        <p className="text-[11px] font-medium text-neutral-400 mt-1">{item.time}</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}