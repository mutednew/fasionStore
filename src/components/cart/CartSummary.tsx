"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
    subtotal: number;
    shipping: number;
    total: number;
}

export function CartSummary({ subtotal, shipping, total }: CartSummaryProps) {
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
                <div className="flex justify-between items-center h-8 overflow-hidden">
                    <span>Subtotal</span>
                    <div className="relative flex items-center justify-end min-w-[80px] h-full">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                                key={subtotal}
                                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="font-medium text-black absolute right-0 flex items-center h-full"
                            >
                                ${subtotal.toFixed(2)}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex justify-between items-center h-8 overflow-hidden">
                    <span>Shipping</span>
                    <div className="relative flex items-center justify-end min-w-[80px] h-full">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                                key={shipping}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                className={`absolute right-0 flex items-center h-full ${shipping === 0 ? "text-green-600 font-medium" : "font-medium text-black"}`}
                            >
                                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="pt-2">
                    <p className="text-xs text-gray-400 mb-2 uppercase font-bold tracking-wide">Promo Code</p>
                    <div className="flex gap-2">
                        <Input placeholder="Enter code" className="h-10 text-sm bg-gray-50 border-gray-200 focus-visible:ring-black" />
                        <Button variant="outline" className="h-10 px-4 border-gray-200 hover:bg-gray-100 hover:text-black">Apply</Button>
                    </div>
                </div>
            </div>

            <Separator className="my-6 bg-gray-200" />

            <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-lg text-neutral-900">Total</span>
                <div className="text-right flex flex-col items-end">
                    <div className="relative h-10 min-w-[120px] overflow-hidden flex justify-end">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                                key={total}
                                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="font-extrabold text-2xl leading-none text-neutral-900 absolute right-0 flex items-center h-full"
                            >
                                ${total.toFixed(2)}
                            </motion.span>
                        </AnimatePresence>
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-1 block">Including VAT</span>
                </div>
            </div>

            <Link href="/checkout">
                <Button
                    className="w-full h-12 text-sm font-bold uppercase tracking-widest rounded-md gap-2 group transition-all bg-black hover:bg-neutral-800 text-white shadow-lg shadow-neutral-200"
                >
                    Checkout
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
            </Link>

            <div className="mt-6 space-y-2 text-[11px] text-gray-400 text-center font-medium">
                <p>Secure Checkout - SSL Encrypted</p>
                <p>30-Day Money Back Guarantee</p>
            </div>
        </motion.div>
    );
}