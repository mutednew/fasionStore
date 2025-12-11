"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Ticket, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PromoCode } from "@/types";

interface CartSummaryProps {
    subtotal: number;
    shipping: number;
    total: number;
    discountAmount: number;

    appliedPromo: PromoCode | null;
    isPromoLoading: boolean;
    onApply: (code: string) => void;
    onRemove: () => void;
}

export function CartSummary({
                                subtotal, shipping, total, discountAmount,
                                appliedPromo, isPromoLoading, onApply, onRemove
                            }: CartSummaryProps) {

    const [code, setCode] = useState("");

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white border border-gray-200 p-8 shadow-sm rounded-lg sticky top-28"
        >
            <h2 className="text-lg font-bold mb-6 uppercase tracking-wider border-b border-gray-100 pb-4">
                Order Summary
            </h2>

            <div className="space-y-4 text-sm text-gray-600">
                <div className="flex justify-between items-center h-9 overflow-hidden">
                    <span>Subtotal</span>
                    <div className="relative flex items-center justify-end min-w-[100px] h-full">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                                key={subtotal}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="font-medium text-black absolute right-0 flex items-center h-full"
                            >
                                ${subtotal.toFixed(2)}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex justify-between items-center h-9 overflow-hidden">
                    <span>Shipping</span>
                    <div className="relative flex items-center justify-end min-w-[100px] h-full">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                                key={shipping}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`absolute right-0 flex items-center h-full ${shipping === 0 ? "text-green-600 font-medium" : "font-medium text-black"}`}
                            >
                                {shipping === 0
                                    ? (appliedPromo?.type === 'FREE_SHIPPING' ? "Free (Promo)" : "Free")
                                    : `$${shipping.toFixed(2)}`
                                }
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </div>

                {/* БЛОК СКИДКИ */}
                <AnimatePresence>
                    {discountAmount > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex justify-between items-center text-green-600 font-medium overflow-hidden"
                        >
                            <span>Discount</span>
                            <span>-${discountAmount.toFixed(2)}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* PROMO INPUT */}
                <div className="pt-2">
                    {appliedPromo ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-2 px-3"
                        >
                            <div className="flex items-center gap-2">
                                <Ticket size={16} className="text-green-600" />
                                <span className="font-bold text-green-700 text-xs tracking-wide">{appliedPromo.code}</span>
                            </div>
                            <button onClick={() => { onRemove(); setCode(""); }} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X size={14} />
                            </button>
                        </motion.div>
                    ) : (
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter code"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                className="h-10 text-sm bg-gray-50 border-gray-200 focus-visible:ring-black uppercase"
                            />
                            <Button
                                variant="outline"
                                onClick={() => onApply(code)}
                                disabled={isPromoLoading || !code}
                                className="h-10 px-4 border-gray-200 hover:bg-gray-100 hover:text-black min-w-[70px]"
                            >
                                {isPromoLoading ? <Loader2 size={16} className="animate-spin" /> : "Apply"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Separator className="my-6 bg-gray-200" />

            <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-lg text-neutral-900">Total</span>
                <div className="text-right flex flex-col items-end">
                    <div className="relative h-11 min-w-[140px] overflow-hidden flex justify-end">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                                key={total}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="font-extrabold text-3xl leading-none text-neutral-900 absolute right-0 flex items-center h-full"
                            >
                                ${total.toFixed(2)}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-1 block">Including VAT</span>
                </div>
            </div>

            <Link href={`/checkout?promo=${appliedPromo?.code || ''}`}>
                <Button className="w-full h-12 text-sm font-bold uppercase tracking-widest rounded-md gap-2 group transition-all bg-black hover:bg-neutral-800 text-white shadow-lg">
                    Checkout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>
        </motion.div>
    );
}