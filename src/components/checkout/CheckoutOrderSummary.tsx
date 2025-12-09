"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { CartItem } from "@/types";

interface CheckoutOrderSummaryProps {
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
}

export function CheckoutOrderSummary({ items, subtotal, shipping, total }: CheckoutOrderSummaryProps) {
    return (
        <Card className="border border-gray-200 bg-white p-6 shadow-sm rounded-lg overflow-hidden">
            <h2 className="text-xs font-bold mb-6 uppercase tracking-wider text-gray-500">
                Order Summary ({items.length})
            </h2>
            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                        <div className="relative w-16 h-20 border border-gray-100 rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                            {item.product.imageUrl && (
                                <Image
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                />
                            )}
                            <span className="absolute top-0 right-0 bg-gray-900 text-white text-[9px] w-4 h-4 flex items-center justify-center">
                                {item.quantity}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{item.product.name}</p>
                            <p className="text-xs text-neutral-500 mb-1">
                                {item.size} {item.color ? `/ ${item.color}` : ""}
                            </p>
                            <p className="text-xs font-medium">
                                ${(Number(item.product.price) * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <Separator className="my-5" />

            <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium text-black">
                        {shipping === 0 ? "Free" : `$${shipping}`}
                    </span>
                </div>
            </div>

            <Separator className="my-5" />

            <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-xl">${total.toFixed(2)}</span>
            </div>
        </Card>
    );
}