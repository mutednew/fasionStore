"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react"; // Import ArrowRight
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import {
    useGetCartQuery,
    useUpdateCartQuantityMutation,
    useRemoveFromCartMutation
} from "@/store/api/cartApi";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function CartPage() {
    // 1. Данные корзины
    const { data: cartData, isLoading } = useGetCartQuery();
    const items = cartData?.items ?? [];

    // 2. Мутации
    const [updateQuantity, { isLoading: isUpdating }] = useUpdateCartQuantityMutation();
    const [removeItem] = useRemoveFromCartMutation();

    // Локальный стейт для "Оптимистичного удаления"
    const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

    // Очистка removingIds при обновлении данных с сервера
    useEffect(() => {
        if (removingIds.size > 0 && items.length > 0) {
            setRemovingIds(prev => {
                const next = new Set(prev);
                const currentIds = new Set(items.map(i => i.id));
                let changed = false;
                next.forEach(id => {
                    if (!currentIds.has(id)) {
                        next.delete(id);
                        changed = true;
                    }
                });
                return changed ? next : prev;
            });
        }
    }, [items, removingIds.size]);

    // Фильтруем товары
    const visibleItems = items.filter(item => !removingIds.has(item.id));

    // --- ЛОГИКА ПУСТОГО ЭКРАНА С ЗАДЕРЖКОЙ ---
    const [showEmptyScreenDelay, setShowEmptyScreenDelay] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (visibleItems.length === 0 && !isLoading) {
            // Если товаров нет визуально, ждем окончания анимации
            timer = setTimeout(() => setShowEmptyScreenDelay(true), 300);
        } else {
            setShowEmptyScreenDelay(false);
        }
        return () => clearTimeout(timer);
    }, [visibleItems.length, isLoading]);


    // 3. Подсчет суммы
    const subtotal = useMemo(() => {
        return visibleItems.reduce((acc, item) => {
            const price = Number(item.product.price);
            return acc + price * item.quantity;
        }, 0);
    }, [visibleItems]);

    const shipping = subtotal > 3000 ? 0 : 150;
    const total = subtotal + shipping;

    // --- HANDLERS ---

    const handleQuantityChange = async (itemId: string, currentQty: number, delta: number) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;

        try {
            await updateQuantity({ itemId, quantity: newQty }).unwrap();
        } catch {
            toast.error("Failed to update quantity");
        }
    };

    const handleRemove = async (itemId: string) => {
        setRemovingIds((prev) => {
            const next = new Set(prev);
            next.add(itemId);
            return next;
        });

        try {
            await removeItem(itemId).unwrap();
            toast.success("Item removed");
        } catch {
            setRemovingIds((prev) => {
                const next = new Set(prev);
                next.delete(itemId);
                return next;
            });
            toast.error("Failed to remove item");
        }
    };

    // --- RENDER STATES ---

    if (isLoading) return <CartSkeleton />;

    // ИСПРАВЛЕНИЕ: Если данных с сервера нет (items.length === 0), показываем пустой экран СРАЗУ.
    // Это убирает задержку при первом открытии корзины.
    if (items.length === 0) {
        return <EmptyCartView />;
    }

    // Если мы удалили товары "оптимистично" и таймер анимации истек -> показываем пустой экран
    if (showEmptyScreenDelay) {
        return <EmptyCartView />;
    }

    return (
        <main className="min-h-screen w-full bg-[#f9f9f9] text-gray-900 px-6 md:px-10 lg:px-20 py-16 font-sans">
            <h1 className="text-3xl font-extrabold mb-12 tracking-tight uppercase flex items-baseline gap-3">
                Shopping Bag
                <span className="text-neutral-400 text-lg font-medium normal-case">
                    ({visibleItems.length} {visibleItems.length === 1 ? 'item' : 'items'})
                </span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-12 items-start">

                {/* ==== LEFT: СПИСОК ТОВАРОВ ==== */}
                <div className="flex-1 w-full space-y-6">
                    <AnimatePresence initial={false} mode="popLayout">
                        {visibleItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                className="group relative flex gap-6 bg-white p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg overflow-hidden"
                            >
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 z-10"
                                    title="Remove item"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <Link href={`/products/${item.product.id}`} className="shrink-0 w-28 h-36 bg-gray-100 overflow-hidden relative rounded-md border border-gray-100">
                                    {item.product.imageUrl ? (
                                        <Image
                                            src={item.product.imageUrl}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
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

                                        <p className="text-sm text-gray-500 mt-1 capitalize font-medium">
                                            {item.product.category?.name || "Category"}
                                        </p>

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
                                                    <div
                                                        className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                                        <div className="flex items-center bg-white border border-gray-300 rounded-md shadow-sm h-9">
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                                disabled={item.quantity <= 1 || isUpdating}
                                                className="h-full px-3 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition text-neutral-600 border-r border-gray-200"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <div className="w-10 flex justify-center">
                                                <span className="text-sm font-semibold text-neutral-900 select-none block">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                                disabled={isUpdating}
                                                className="h-full px-3 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition text-neutral-600 border-l border-gray-200"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-lg font-bold text-neutral-900">
                                                {(Number(item.product.price) * item.quantity).toFixed(2)} ₴
                                            </p>
                                            {item.quantity > 1 && (
                                                <p className="text-xs text-gray-400 font-medium">
                                                    ${Number(item.product.price)} each
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* ==== RIGHT: ORDER SUMMARY ==== */}
                <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-28">
                    <motion.div
                        layout
                        className="bg-white border border-gray-200 p-8 shadow-sm rounded-lg"
                    >
                        <h2 className="text-lg font-bold mb-6 uppercase tracking-wider border-b border-gray-100 pb-4">
                            Order Summary
                        </h2>

                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-medium text-black">{subtotal.toFixed(2)} ₴</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                {shipping === 0 ? (
                                    <span className="text-green-600 font-medium">Free</span>
                                ) : (
                                    <span className="font-medium text-black">{shipping.toFixed(2)} ₴</span>
                                )}
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
                            <div className="text-right">
                                <span className="font-extrabold text-2xl block leading-none text-neutral-900">{total.toFixed(2)} ₴</span>
                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-1 block">Including VAT</span>
                            </div>
                        </div>

                        <Link href="/checkout" className="block">
                            <Button className="w-full h-12 text-sm font-bold uppercase tracking-widest rounded-md gap-2 hover:gap-3 transition-all bg-black hover:bg-neutral-800 text-white shadow-lg shadow-neutral-200">
                                Checkout <ArrowRight size={16} />
                            </Button>
                        </Link>

                        <div className="mt-6 space-y-2 text-[11px] text-gray-400 text-center font-medium">
                            <p>Secure Checkout - SSL Encrypted</p>
                            <p>30-Day Money Back Guarantee</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

// --- ОТДЕЛЬНЫЙ КОМПОНЕНТ ДЛЯ ПУСТОЙ КОРЗИНЫ ---
function EmptyCartView() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] text-center px-4 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
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

function CartSkeleton() {
    return (
        <main className="min-h-screen w-full bg-[#f9f9f9] px-6 md:px-20 py-16">
            <Skeleton className="h-10 w-48 mb-12" />
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-1 space-y-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex gap-6 bg-white p-5 border border-gray-200 h-48 rounded-lg">
                            <Skeleton className="w-28 h-full rounded-md" />
                            <div className="flex-1 py-2 space-y-4">
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-4 w-1/4" />
                                <div className="flex gap-2 mt-4">
                                    <Skeleton className="h-8 w-24 rounded-md" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full lg:w-[380px]">
                    <Skeleton className="h-[500px] w-full rounded-lg" />
                </div>
            </div>
        </main>
    );
}