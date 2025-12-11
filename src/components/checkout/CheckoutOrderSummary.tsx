"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { CartItem, PromoCode } from "@/types";
import { Ticket } from "lucide-react";

interface CheckoutOrderSummaryProps {
    items: CartItem[];
    subtotal: number;
    shipping: number;
    total: number;
    discountAmount?: number;
    appliedPromo?: PromoCode | null;
}

export function CheckoutOrderSummary({
    items,
    subtotal,
    shipping,
    total,
    discountAmount = 0,
    appliedPromo
}: CheckoutOrderSummaryProps) {
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
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-medium">
                                    ${(Number(item.product.salePrice ?? item.product.price) * item.quantity).toFixed(2)}
                                </p>
                                {item.product.salePrice && (
                                    <span className="text-[10px] text-red-500 bg-red-50 px-1 rounded">Sale</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Separator className="my-5" />

            <div className="space-y-4 text-sm text-gray-600">
                <div className="flex justify-between items-center h-5">
                    <span>Subtotal</span>
                    <span className="font-medium text-black">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center h-5">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium text-black"}>
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                </div>

                {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-green-600 font-medium h-5">
                        <span className="flex items-center gap-1.5">
                            <Ticket size={14} />
                            Discount
                        </span>
                        <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                )}
            </div>

            <Separator className="my-5" />

            <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <div className="relative h-8 min-w-[100px] overflow-hidden flex justify-end items-center">
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                            key={total}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="font-bold text-xl text-neutral-900 absolute right-0"
                        >
                            ${total.toFixed(2)}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>

            {appliedPromo && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-center text-xs text-green-700 font-medium flex items-center justify-center gap-2"
                >
                    <Ticket size={14} />
                    Code <b>{appliedPromo.code}</b> applied
                </motion.div>
            )}
        </Card>
    );
}