"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Package, Clock, MapPin, Phone, Mail, Ticket } from "lucide-react";
import { Order } from "@/types";
import { format } from "date-fns";

const getStatusBadge = (status: string) => {
    switch (status) {
        case "PAID": return <Badge className="bg-green-600 hover:bg-green-700">Paid</Badge>;
        case "PENDING": return <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-yellow-50">Pending</Badge>;
        case "SHIPPED": return <Badge className="bg-blue-600 hover:bg-blue-700">Shipped</Badge>;
        case "DELIVERED": return <Badge className="bg-black hover:bg-neutral-800">Delivered</Badge>;
        case "CANCELED": return <Badge variant="destructive">Canceled</Badge>;
        default: return <Badge variant="secondary">{status}</Badge>;
    }
};

export function OrdersList({ orders }: { orders: Order[] }) {
    if (orders.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 bg-white border border-dashed border-neutral-200 rounded-xl"
            >
                <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900">No orders yet</h3>
                <p className="text-neutral-500 text-sm mb-6">You haven't placed any orders yet.</p>
                <Button asChild variant="outline">
                    <Link href="/products">Start Shopping</Link>
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.map((order, index) => {
                // 1. Сумма товаров
                const itemsTotal = order.items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

                // 2. Ожидаемая доставка (стандартная логика магазина)
                const standardShipping = itemsTotal > 200 ? 0 : 15;

                // 3. Ожидаемая сумма БЕЗ промокода
                const expectedTotal = itemsTotal + standardShipping;

                // 4. Реальная сумма, которую заплатил юзер
                const paidTotal = Number(order.total);

                // 5. Если заплатил МЕНЬШЕ, чем ожидалось — значит был промокод
                // (используем 0.01 для погрешности float)
                const discountAmount = expectedTotal - paidTotal;
                const isDiscounted = discountAmount > 0.01;

                return (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                        <Card className="overflow-hidden border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 p-4 md:p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-sm tracking-wide text-neutral-900">
                                                ORDER #{order.id.slice(0, 8).toUpperCase()}
                                            </h3>
                                            {getStatusBadge(order.status)}
                                        </div>
                                        <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                                            <Clock size={12} />
                                            {format(new Date(order.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Total</p>
                                        <div className="flex flex-col items-end">
                                            {/* Если была скидка, показываем зачеркнутую полную цену (товары + доставка) */}
                                            {isDiscounted && (
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <Ticket size={12} className="text-green-600" />
                                                    <span className="text-xs text-neutral-400 line-through decoration-neutral-400">
                                                        ${expectedTotal.toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                            <p className={`text-xl font-bold ${isDiscounted ? 'text-green-700' : 'text-neutral-900'}`}>
                                                ${paidTotal.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="items" className="border-none">
                                        <AccordionTrigger className="px-6 py-3 hover:bg-neutral-50/50 hover:no-underline text-xs font-medium text-neutral-500 uppercase tracking-wider group">
                                            <span className="group-hover:text-black transition-colors">
                                                Order Details & {order.items?.length} Items
                                            </span>
                                        </AccordionTrigger>

                                        <AccordionContent className="px-6 pb-6">
                                            {/* СПИСОК ТОВАРОВ */}
                                            <div className="space-y-4 pt-2">
                                                {order.items?.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-4 py-2 border-b border-neutral-100 last:border-0">
                                                        <div className="relative w-16 h-20 bg-neutral-100 rounded overflow-hidden shrink-0 border border-neutral-200">
                                                            {item.product.imageUrl ? (
                                                                <Image
                                                                    src={item.product.imageUrl}
                                                                    alt={item.product.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">Img</div>
                                                            )}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <Link href={`/products/${item.product.id}`} className="font-semibold text-sm text-neutral-900 hover:underline truncate block">
                                                                {item.product.name}
                                                            </Link>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {item.size && (
                                                                    <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600 font-medium">
                                                                        Size: {item.size}
                                                                    </span>
                                                                )}
                                                                {item.color && (
                                                                    <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600 font-medium">
                                                                        Color: {item.color}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-sm font-medium text-neutral-900">
                                                                ${Number(item.price).toFixed(2)}
                                                            </p>
                                                            <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* ИНФОРМАЦИЯ О ДОСТАВКЕ */}
                                            <div className="mt-6 bg-neutral-50 p-5 rounded-lg border border-neutral-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                                <div>
                                                    <p className="font-bold text-neutral-900 text-xs uppercase mb-3 flex items-center gap-2">
                                                        <MapPin size={14} /> Shipping Address
                                                    </p>
                                                    <div className="text-neutral-600 space-y-1 pl-1">
                                                        <p className="font-medium text-neutral-900">
                                                            {order.firstName} {order.lastName}
                                                        </p>
                                                        <p>{order.address}</p>
                                                        <p>{order.city}, {order.zip}</p>
                                                        <p>{order.country}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="font-bold text-neutral-900 text-xs uppercase mb-3 flex items-center gap-2">
                                                        <Phone size={14} /> Contact Info
                                                    </p>
                                                    <div className="text-neutral-600 space-y-2 pl-1">
                                                        <div className="flex items-center gap-2">
                                                            <Mail size={14} className="text-neutral-400" />
                                                            <span>{order.email}</span>
                                                        </div>
                                                        {order.phone && (
                                                            <div className="flex items-center gap-2">
                                                                <Phone size={14} className="text-neutral-400" />
                                                                <span>{order.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}