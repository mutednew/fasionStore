"use client";

import {
    useGetOrdersQuery,
    useUpdateOrderStatusMutation,
} from "@/store/api/adminApi";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import type { Order } from "@/types";
import {toast} from "sonner";

interface OrderTableProps {
    status: string;   // "all", "PENDING", "DELIVERED"...
    sort: string;     // "date-desc", "date-asc"
}

export function OrderTable({ status, sort }: OrderTableProps) {
    const { data: ordersRes, isLoading } = useGetOrdersQuery();
    const [updateStatus] = useUpdateOrderStatusMutation();

    const orders: Order[] = ordersRes?.data.orders ?? [];

    // --------------------------
    // FILTERING
    // --------------------------
    let filtered = [...orders];

    if (status !== "all") {
        filtered = filtered.filter((o) => o.status === status);
    }

    // --------------------------
    // SORTING
    // --------------------------
    if (sort === "date-desc") {
        filtered.sort(
            (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
    } else if (sort === "date-asc") {
        filtered.sort(
            (a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
        );
    }

    // --------------------------
    // UPDATE STATUS
    // --------------------------
    const handleStatusChange = async (id: string, status: string) => {
        try {
            await updateStatus({ id, status }).unwrap();
            toast.success("Order updated successfully.");
        } catch {
            toast.error("Failed to update statu")
        }
    };

    // --------------------------
    // HELPERS
    // --------------------------
    const calcTotal = (order: Order) => {
        if (!order.items) return 0;
        return order.items.reduce((sum, item) => {
            return sum + Number(item.price) * item.quantity;
        }, 0);
    };

    if (isLoading)
        return <div className="text-gray-500 p-6">Loading orders...</div>;

    if (filtered.length === 0)
        return <div className="text-center p-6 text-gray-500">No orders found</div>;

    // --------------------------
    // TABLE JSX
    // --------------------------
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Orders List</CardTitle>
            </CardHeader>

            <CardContent className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-muted/40 text-left">
                    <tr>
                        <th className="px-4 py-3">Order ID</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                    </thead>

                    <AnimatePresence>
                        <tbody>
                        {filtered.map((order) => (
                            <motion.tr
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                                className="border-t hover:bg-muted/20 transition-colors"
                            >
                                <td className="px-4 py-3 font-medium">
                                    #{order.id.slice(0, 6)}
                                </td>

                                <td className="px-4 py-3">
                                    {order.user?.name || "Anonymous"}
                                </td>

                                <td className="px-4 py-3 font-semibold">
                                    ${calcTotal(order).toFixed(2)}
                                </td>

                                <td className="px-4 py-3">
                                    <Badge
                                        variant={
                                            order.status === "DELIVERED"
                                                ? "success"
                                                : order.status === "CANCELED"
                                                    ? "destructive"
                                                    : "secondary"
                                        }
                                    >
                                        {order.status}
                                    </Badge>
                                </td>

                                <td className="px-4 py-3 text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>

                                <td className="px-4 py-3 text-right">
                                    <Select
                                        onValueChange={(v) =>
                                            handleStatusChange(order.id, v)
                                        }
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue
                                                placeholder={order.status}
                                            />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="PAID">Paid</SelectItem>
                                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                                            <SelectItem value="CANCELED">Canceled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </td>
                            </motion.tr>
                        ))}
                        </tbody>
                    </AnimatePresence>
                </table>
            </CardContent>
        </Card>
    );
}