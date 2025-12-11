"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, Loader2, Tag } from "lucide-react";
import { CartItem as ICartItem, PromoCode } from "@/types";

interface CartItemProps {
    item: ICartItem;
    isUpdating: boolean;
    onUpdateQuantity: (id: string, currentQty: number, delta: number) => void;
    onRemove: (id: string) => void;
    promo?: PromoCode | null;
}

const counterVariants = {
    initial: (direction: number) => ({ y: direction > 0 ? 20 : -20, opacity: 0 }),
    animate: { y: 0, opacity: 1 },
    exit: (direction: number) => ({ y: direction > 0 ? -20 : 20, opacity: 0 }),
};
const springTransition = { type: "spring" as const, stiffness: 400, damping: 25, mass: 0.5 };

export function CartItem({ item, isUpdating, onUpdateQuantity, onRemove, promo }: CartItemProps) {
    const [localQty, setLocalQty] = useState(item.quantity);
    const [direction, setDirection] = useState(0);

    useEffect(() => { setLocalQty(item.quantity); }, [item.quantity]);

    useEffect(() => {
        if (localQty === item.quantity) return;
        const timer = setTimeout(() => {
            const delta = localQty - item.quantity;
            if (delta !== 0) onUpdateQuantity(item.id, item.quantity, delta);
        }, 600);
        return () => clearTimeout(timer);
    }, [localQty, item.quantity, item.id, onUpdateQuantity]);

    const handleIncrement = () => { setDirection(1); setLocalQty((prev) => prev + 1); };
    const handleDecrement = () => { setDirection(-1); setLocalQty((prev) => Math.max(1, prev - 1)); };

    const basePrice = item.product.salePrice ? Number(item.product.salePrice) : Number(item.product.price);

    let finalPrice = basePrice;
    const isPromoApplied = promo && promo.type === "PERCENT";

    if (isPromoApplied) {
        finalPrice = basePrice * (1 - promo.value / 100);
    }

    const isOnSale = item.product.salePrice && Number(item.product.salePrice) < Number(item.product.price);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="group relative flex gap-6 bg-white p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg overflow-hidden"
        >
            <button
                onClick={() => onRemove(item.id)}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 z-10"
            >
                <Trash2 size={18} />
            </button>

            <Link href={`/products/${item.product.id}`} className="shrink-0 w-28 h-36 bg-gray-100 overflow-hidden relative rounded-md border border-gray-100">
                {item.product.imageUrl ? (
                    <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                )}
            </Link>

            <div className="flex flex-col justify-between flex-1 py-1 min-w-0">
                <div>
                    <div className="flex justify-between pr-10">
                        <h3 className="font-bold text-lg leading-tight text-neutral-900 truncate">
                            <Link href={`/products/${item.product.id}`} className="hover:underline decoration-1 underline-offset-2">
                                {item.product.name}
                            </Link>
                        </h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 capitalize font-medium">{item.product.category?.name || "Category"}</p>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        {item.size && (
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Size</span>
                                <span className="text-xs font-semibold text-neutral-900">{item.size}</span>
                            </div>
                        )}
                        {item.color && (
                            <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Color</span>
                                <div className="w-3 h-3 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: item.color }} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                    <div className="flex items-center bg-white border border-gray-300 rounded-md shadow-sm h-9">
                        <button onClick={handleDecrement} disabled={localQty <= 1} className="h-full px-3 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition text-neutral-600 border-r border-gray-200 active:bg-gray-200"><Minus size={14} /></button>
                        <div className="w-10 h-full flex justify-center items-center relative overflow-hidden">
                            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                                <motion.span key={localQty} custom={direction} variants={counterVariants} initial="initial" animate="animate" exit="exit" transition={springTransition} className={`text-sm font-semibold text-neutral-900 select-none absolute ${isUpdating ? "opacity-30" : "opacity-100"}`}>{localQty}</motion.span>
                            </AnimatePresence>
                            {isUpdating && <div className="absolute inset-0 flex items-center justify-center z-10"><Loader2 size={14} className="animate-spin text-black" /></div>}
                        </div>
                        <button onClick={handleIncrement} className="h-full px-3 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition text-neutral-600 border-l border-gray-200 active:bg-gray-200"><Plus size={14} /></button>
                    </div>

                    <div className="text-right">
                        <div className="relative h-7 overflow-hidden min-w-[80px] flex justify-end">
                            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                                <motion.p
                                    key={`${localQty}-${finalPrice}`}
                                    custom={direction}
                                    variants={counterVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={springTransition}
                                    className={`text-lg font-bold absolute right-0 ${isPromoApplied ? "text-purple-600" : isOnSale ? "text-red-600" : "text-neutral-900"}`}
                                >
                                    ${(finalPrice * localQty).toFixed(2)}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-col items-end">
                            {isPromoApplied && (
                                <div className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded mb-0.5">
                                    <Tag size={10} />
                                    -{promo!.value}% Promo
                                </div>
                            )}

                            {(localQty > 1 || isPromoApplied) && (
                                <div className="flex items-baseline gap-1">
                                    {isPromoApplied && (
                                        <span className="text-[10px] text-gray-400 line-through">
                                            ${basePrice.toFixed(2)}
                                        </span>
                                    )}
                                    <p className="text-xs text-gray-400 font-medium">
                                        ${finalPrice.toFixed(2)} each
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}