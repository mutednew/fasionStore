"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from "@/store/api/adminApi";
import { format } from "date-fns";
import { Ticket } from "lucide-react"; // Иконка скидки
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { AdminSkeleton } from "@/app/admin/components/skeletons/AdminSkeleton";

interface OrderTableProps {
    status: string;
    sort: string;
}

export function OrderTable({ status, sort }: OrderTableProps) {
    const { data: ordersRes, isLoading } = useGetOrdersQuery();
    const [updateStatus] = useUpdateOrderStatusMutation();

    const orders = ordersRes?.data.orders ?? [];

    // Фильтрация и сортировка
    const filteredOrders = orders
        .filter((order) => status === "all" || order.status === status)
        .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sort === "date-desc" ? dateB - dateA : dateA - dateB;
        });

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await updateStatus({ id, status }).unwrap();
            toast.success("Order updated successfully.");
        } catch {
            toast.error("Failed to update status");
        }
    };

    if (isLoading) return <AdminSkeleton type="orders" />;

    return (
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/40">
                        <TableRow>
                            <TableHead className="w-[100px]">Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right w-[160px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <AnimatePresence mode="popLayout">
                            {filteredOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredOrders.map((order) => {
                                    // --- ЛОГИКА ОПРЕДЕЛЕНИЯ СКИДКИ ---
                                    const itemsTotal = order.items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

                                    // Стандартная логика доставки (как в корзине)
                                    const standardShipping = itemsTotal > 200 ? 0 : 15;

                                    const expectedTotal = itemsTotal + standardShipping;
                                    const paidTotal = Number(order.total);

                                    // Если заплатили меньше ожидаемого (> 1 цента разницы), значит была скидка
                                    const discountAmount = expectedTotal - paidTotal;
                                    const hasDiscount = discountAmount > 0.01;

                                    return (
                                        <motion.tr
                                            key={order.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                            // motion.tr рендерится как tr, но TS иногда ругается на layout пропсы, здесь безопасно
                                        >
                                            <TableCell className="font-medium font-mono text-xs">
                                                #{order.id.slice(0, 8).toUpperCase()}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">
                                                        {order.firstName ? `${order.firstName} ${order.lastName}` : (order.user?.name || "Anonymous")}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {order.email}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-sm text-muted-foreground">
                                                {format(new Date(order.createdAt), "MMM dd, yyyy")}
                                            </TableCell>

                                            <TableCell>
                                                <StatusBadge status={order.status} />
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex flex-col items-end">
                                                    {/* Старая цена (зачеркнуто) */}
                                                    {hasDiscount && (
                                                        <span className="text-[10px] text-muted-foreground line-through flex items-center gap-1 mb-0.5">
                                                            ${expectedTotal.toFixed(2)}
                                                        </span>
                                                    )}

                                                    {/* Итоговая цена */}
                                                    <span className={`font-bold ${hasDiscount ? "text-green-600" : ""}`}>
                                                        ${paidTotal.toFixed(2)}
                                                    </span>

                                                    {/* Бейджик промокода */}
                                                    {hasDiscount && (
                                                        <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full mt-1">
                                                            <Ticket size={10} />
                                                            Promo
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <Select
                                                    value={order.status}
                                                    onValueChange={(v) => handleStatusChange(order.id, v)}
                                                >
                                                    <SelectTrigger className="w-[130px] h-8 text-xs">
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="PENDING">Pending</SelectItem>
                                                        <SelectItem value="PAID">Paid</SelectItem>
                                                        <SelectItem value="SHIPPED">Shipped</SelectItem>
                                                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                                                        <SelectItem value="CANCELED">Canceled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PAID: "bg-green-100 text-green-700 hover:bg-green-200 border-transparent",
        PENDING: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-transparent",
        SHIPPED: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-transparent",
        DELIVERED: "bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent",
        CANCELED: "bg-red-100 text-red-700 hover:bg-red-200 border-transparent",
    };

    return (
        <Badge className={`shadow-none font-normal ${styles[status] || "bg-gray-100"}`}>
            {status}
        </Badge>
    );
}