"use client";

import { AnimatePresence } from "framer-motion";
import { useCartPage } from "@/hooks/useCartPage";

import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { CartSkeleton, EmptyCart } from "@/components/cart/CartStates";

export default function CartPage() {
    const {
        isLoading,
        visibleItems,
        showEmptyScreenDelay,
        subtotal,
        shipping,
        total,
        isUpdating,
        handleQuantityChange,
        handleRemove
    } = useCartPage();

    if (isLoading) return <CartSkeleton />;

    if (showEmptyScreenDelay) return <EmptyCart />;

    return (
        <main className="min-h-screen w-full bg-[#f9f9f9] text-gray-900 px-6 md:px-10 lg:px-20 py-16 font-sans">
            <h1 className="text-3xl font-extrabold mb-12 tracking-tight uppercase flex items-baseline gap-3">
                Shopping Bag
                <span className="text-neutral-400 text-lg font-medium normal-case">
                    ({visibleItems.length} {visibleItems.length === 1 ? 'item' : 'items'})
                </span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="flex-1 w-full space-y-6">
                    <AnimatePresence initial={false} mode="popLayout">
                        {visibleItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                isUpdating={isUpdating}
                                onUpdateQuantity={handleQuantityChange}
                                onRemove={handleRemove}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-28">
                    <CartSummary
                        subtotal={subtotal}
                        shipping={shipping}
                        total={total}
                    />
                </div>
            </div>
        </main>
    );
}