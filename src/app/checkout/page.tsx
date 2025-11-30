"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, CreditCard, Truck, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { useGetCartQuery, useCheckoutMutation } from "@/store/api/cartApi";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutPage() {
    const router = useRouter();

    // 1. Данные корзины
    const { data: cartData, isLoading: loadingCart } = useGetCartQuery();
    const items = cartData?.items ?? [];

    // 2. Мутация заказа
    const [checkout, { isLoading: isProcessing }] = useCheckoutMutation();

    // 3. Состояние формы (Tabs)
    const [activeTab, setActiveTab] = useState("information");

    // 4. Расчет суммы
    const subtotal = useMemo(() => {
        return items.reduce((acc, item) => {
            return acc + Number(item.product.price) * item.quantity;
        }, 0);
    }, [items]);

    const shipping = subtotal > 200 ? 0 : 15;
    const total = subtotal + shipping;

    // --- HANDLERS ---

    const handleCheckout = async () => {
        try {
            await checkout().unwrap();
            toast.success("Order placed successfully!");
            // Редирект в профиль к истории заказов
            router.push("/profile");
        } catch (error: any) {
            console.error(error);
            toast.error(error?.data?.message || "Checkout failed. Please try again.");
        }
    };

    // --- VALIDATION (Basic) ---
    const goToShipping = () => setActiveTab("shipping");
    const goToPayment = () => setActiveTab("payment");

    if (loadingCart) return <CheckoutSkeleton />;

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] text-center px-4">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Button asChild><Link href="/products">Continue Shopping</Link></Button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f9f9f9] text-neutral-900 px-6 md:px-10 lg:px-20 py-12 font-sans">

            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
                <Link href="/cart" className="inline-flex items-center text-sm text-neutral-500 hover:text-black transition mb-6">
                    <ArrowLeft size={16} className="mr-2" /> Back to Cart
                </Link>
                <h1 className="text-3xl font-extrabold tracking-tight uppercase">Checkout</h1>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-start">

                {/* ==== LEFT: FORM ==== */}
                <div className="flex-1 w-full">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

                        {/* STEPS INDICATOR */}
                        <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 mb-8 border-b border-gray-200">
                            <TabsTrigger
                                value="information"
                                className="uppercase tracking-wide text-xs font-semibold data-[state=active]:border-b-2 border-black rounded-none pb-3 data-[state=active]:text-black text-gray-400 transition-all"
                            >
                                1. Information
                            </TabsTrigger>
                            <TabsTrigger
                                value="shipping"
                                disabled={activeTab === "information"}
                                className="uppercase tracking-wide text-xs font-semibold data-[state=active]:border-b-2 border-black rounded-none pb-3 data-[state=active]:text-black text-gray-400 transition-all"
                            >
                                2. Shipping
                            </TabsTrigger>
                            <TabsTrigger
                                value="payment"
                                disabled={activeTab !== "payment"}
                                className="uppercase tracking-wide text-xs font-semibold data-[state=active]:border-b-2 border-black rounded-none pb-3 data-[state=active]:text-black text-gray-400 transition-all"
                            >
                                3. Payment
                            </TabsTrigger>
                        </TabsList>

                        <div className="min-h-[400px]">
                            {/* ИСПРАВЛЕНИЕ: Условный рендеринг внутри AnimatePresence */}
                            <AnimatePresence mode="wait">

                                {/* --- STEP 1: INFO --- */}
                                {activeTab === "information" && (
                                    <TabsContent value="information" asChild key="information">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-8"
                                        >
                                            <section>
                                                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                                                    <CheckCircle size={16} /> Contact Info
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs text-gray-500">Email</Label>
                                                        <Input placeholder="you@example.com" className="bg-white" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs text-gray-500">Phone</Label>
                                                        <Input placeholder="+1 (555) 000-0000" className="bg-white" />
                                                    </div>
                                                </div>
                                            </section>

                                            <section>
                                                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                                                    <MapPin size={16} /> Shipping Address
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <Input placeholder="First Name" className="bg-white" />
                                                        <Input placeholder="Last Name" className="bg-white" />
                                                    </div>
                                                    <Input placeholder="Address" className="bg-white" />
                                                    <Input placeholder="Apartment, suite, etc. (optional)" className="bg-white" />
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                        <Input placeholder="City" className="bg-white" />
                                                        <Input placeholder="Country" className="bg-white" />
                                                        <Input placeholder="Postal Code" className="bg-white" />
                                                    </div>
                                                </div>
                                            </section>

                                            <div className="flex justify-end pt-4">
                                                <Button onClick={goToShipping} className="px-8 bg-black text-white hover:bg-neutral-800">
                                                    Continue to Shipping
                                                </Button>
                                            </div>
                                        </motion.div>
                                    </TabsContent>
                                )}

                                {/* --- STEP 2: SHIPPING --- */}
                                {activeTab === "shipping" && (
                                    <TabsContent value="shipping" asChild key="shipping">
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            <div className="bg-white p-4 border rounded-md text-sm text-gray-600 mb-6">
                                                <div className="flex justify-between border-b pb-2 mb-2">
                                                    <span>Contact</span>
                                                    <span className="text-black font-medium">user@example.com</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Ship to</span>
                                                    <span className="text-black font-medium">123 Main St, New York, NY</span>
                                                </div>
                                            </div>

                                            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                                                <Truck size={16} /> Shipping Method
                                            </h3>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-4 border rounded-md bg-white cursor-pointer hover:border-black transition">
                                                    <div className="flex items-center gap-3">
                                                        <input type="radio" name="shipping" defaultChecked className="accent-black w-4 h-4" />
                                                        <span className="text-sm font-medium">Standard Shipping (5-7 days)</span>
                                                    </div>
                                                    <span className="font-bold text-sm">{shipping === 0 ? "Free" : `$${shipping}`}</span>
                                                </div>
                                                <div className="flex items-center justify-between p-4 border rounded-md bg-white cursor-pointer hover:border-black transition opacity-60">
                                                    <div className="flex items-center gap-3">
                                                        <input type="radio" name="shipping" disabled className="accent-black w-4 h-4" />
                                                        <span className="text-sm font-medium">Express Shipping (1-2 days)</span>
                                                    </div>
                                                    <span className="font-bold text-sm">$25.00</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-6">
                                                <Button variant="ghost" onClick={() => setActiveTab("information")}>
                                                    <ArrowLeft size={14} className="mr-2" /> Back
                                                </Button>
                                                <Button onClick={goToPayment} className="px-8 bg-black text-white hover:bg-neutral-800">
                                                    Continue to Payment
                                                </Button>
                                            </div>
                                        </motion.div>
                                    </TabsContent>
                                )}

                                {/* --- STEP 3: PAYMENT --- */}
                                {activeTab === "payment" && (
                                    <TabsContent value="payment" asChild key="payment">
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                                                <CreditCard size={16} /> Payment
                                            </h3>

                                            <div className="bg-blue-50 text-blue-700 p-4 text-sm rounded-md border border-blue-100">
                                                For this demo, payment is simulated. No real card required.
                                            </div>

                                            <div className="space-y-4 pt-4">
                                                <div className="p-4 border rounded-md bg-white flex items-center gap-3 border-black ring-1 ring-black">
                                                    <input type="radio" checked readOnly className="accent-black w-4 h-4" />
                                                    <span className="font-medium text-sm">Credit Card (Simulated)</span>
                                                </div>
                                                <div className="p-4 border rounded-md bg-white flex items-center gap-3 text-gray-400">
                                                    <input type="radio" disabled className="w-4 h-4" />
                                                    <span className="font-medium text-sm">PayPal (Unavailable)</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-6">
                                                <Button variant="ghost" onClick={() => setActiveTab("shipping")}>
                                                    <ArrowLeft size={14} className="mr-2" /> Back
                                                </Button>

                                                <Button
                                                    onClick={handleCheckout}
                                                    disabled={isProcessing}
                                                    className="px-8 bg-black text-white hover:bg-neutral-800 w-full sm:w-auto"
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                                                        </>
                                                    ) : (
                                                        `Pay $${total.toFixed(2)}`
                                                    )}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    </TabsContent>
                                )}
                            </AnimatePresence>
                        </div>
                    </Tabs>
                </div>

                {/* ==== RIGHT: ORDER SUMMARY ==== */}
                <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-10">
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
                                {shipping === 0 ? (
                                    <span className="text-green-600 font-medium">Free</span>
                                ) : (
                                    <span className="font-medium text-black">${shipping.toFixed(2)}</span>
                                )}
                            </div>
                        </div>

                        <Separator className="my-5" />

                        <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">Total</span>
                            <div className="text-right">
                                <span className="font-bold text-xl block leading-none">${total.toFixed(2)}</span>
                                <span className="text-[10px] text-gray-400">USD</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}

function CheckoutSkeleton() {
    return (
        <main className="min-h-screen bg-[#f9f9f9] px-20 py-16">
            <Skeleton className="h-8 w-48 mb-12" />
            <div className="flex gap-14">
                <div className="flex-1 space-y-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="w-[360px]">
                    <Skeleton className="h-[400px] w-full" />
                </div>
            </div>
        </main>
    )
}