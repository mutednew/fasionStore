"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function EmptyCart() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] text-center px-4 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" as const, stiffness: 200, damping: 15 }}
                className="bg-white p-8 rounded-full mb-6 shadow-sm border border-gray-100"
            >
                <ShoppingBag size={48} className="text-neutral-300" />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h1 className="text-2xl font-bold text-neutral-900 mb-2">Your bag is empty</h1>
                <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
                    Looks like you haven't added anything to your cart yet. Explore our products to find something you love.
                </p>
                <Button asChild size="lg" className="px-8 rounded-full bg-black hover:bg-neutral-800 text-white transition-all hover:scale-105">
                    <Link href="/products">Start Shopping</Link>
                </Button>
            </motion.div>
        </main>
    );
}

export function CartSkeleton() {
    return (
        <main className="min-h-screen w-full bg-[#f9f9f9] px-6 md:px-10 lg:px-20 py-16">
            <Skeleton className="h-10 w-48 mb-12" />

            <div className="flex flex-col lg:flex-row gap-12 items-start">

                <div className="flex-1 w-full space-y-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex gap-6 bg-white p-5 border border-gray-200 rounded-lg">
                            <Skeleton className="shrink-0 w-28 h-36 rounded-md" />

                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div className="space-y-2">
                                    <div className="flex justify-between gap-4">
                                        <Skeleton className="h-6 w-3/4" />
                                    </div>
                                    <Skeleton className="h-4 w-24" />

                                    <div className="flex gap-2 mt-2">
                                        <Skeleton className="h-6 w-16 rounded" />
                                        <Skeleton className="h-6 w-16 rounded" />
                                    </div>
                                </div>

                                <div className="flex justify-between items-end mt-4">
                                    <div className="flex flex-col items-end gap-1">
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full lg:w-[380px]">
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                </div>
            </div>
        </main>
    );
}