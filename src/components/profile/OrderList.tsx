"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Package, Clock, CheckCircle, XCircle, Truck, ExternalLink } from "lucide-react";
import { Order } from "@/types";
import { format } from "date-fns";

const getStatusBadge = (status: string) => {
    switch (status) {
        case "PAID": return <Badge className="bg-green-600 hover:bg-green-700">Paid</Badge>;
        case "PENDING": return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>;
        case "SHIPPED": return <Badge className="bg-blue-600 hover:bg-blue-700">Shipped</Badge>;
        case "DELIVERED": return <Badge className="bg-gray-900 hover:bg-gray-800">Delivered</Badge>;
        case "CANCELED": return <Badge variant="destructive">Canceled</Badge>;
        default: return <Badge variant="secondary">{status}</Badge>;
    }
};

export function OrdersList({ orders }: { orders: Order[] }) {
    if (orders.length === 0) {
        return (
            <div className="text-center py-12 bg-white border border-dashed rounded-xl">
                <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900">No orders yet</h3>
                <p className="text-neutral-500 text-sm mb-6">You haven't placed any orders yet.</p>
                <Button asChild variant="outline">
                    <Link href="/products">Start Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <Card key={order.id} className="overflow-hidden border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="bg-neutral-50 border-b border-neutral-100 p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-sm tracking-wide text-neutral-900">
                                        ORDER #{order.id.slice(0, 8).toUpperCase()}
                                    </h3>
                                    {getStatusBadge(order.status)}
                                </div>
                                <p className="text-xs text-neutral-500 flex items-center gap-2">
                                    <Clock size={12} />
                                    {format(new Date(order.createdAt), "MMMM dd, yyyy")}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-neutral-500">Total Amount</p>
                                <p className="text-xl font-bold text-neutral-900">${Number(order.total).toFixed(2)}</p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="items" className="border-none">
                                <AccordionTrigger className="px-6 py-3 hover:bg-neutral-50 hover:no-underline text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    View {order.items?.length} Items
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6">
                                    <div className="space-y-4 pt-2">
                                        {order.items?.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 py-2 border-b border-neutral-100 last:border-0">
                                                <div className="relative w-16 h-20 bg-neutral-100 rounded overflow-hidden shrink-0 border">
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
                                                    <p className="text-xs text-neutral-500 mt-0.5">
                                                        {item.size && <span className="bg-neutral-100 px-1.5 py-0.5 rounded mr-2">{item.size}</span>}
                                                        {item.color && <span className="capitalize">{item.color}</span>}
                                                    </p>
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

                                    <div className="mt-6 bg-neutral-50 p-4 rounded-lg text-sm text-neutral-600 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="font-bold text-neutral-900 text-xs uppercase mb-1">Shipping Address</p>
                                            <p>{order.address}</p>
                                            <p>{order.city}, {order.zip}</p>
                                            <p>{order.country}</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-900 text-xs uppercase mb-1">Contact</p>
                                            <p>{order.email}</p>
                                            <p>{order.phone}</p>
                                        </div>
                                    </div>

                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}