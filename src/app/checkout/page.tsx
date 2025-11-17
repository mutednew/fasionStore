"use client";

import Image from "next/image";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const mockOrder = [
    {
        id: "1",
        name: "Basic Heavy T-Shirt",
        variant: "Black / L",
        price: 99,
        image:
            "https://cdn.shopify.com/s/files/1/0680/4150/7113/files/model-1.jpg?v=1687286371",
        quantity: 1,
    },
    {
        id: "2",
        name: "Basic Fit T-Shirt",
        variant: "Black / L",
        price: 99,
        image:
            "https://cdn.shopify.com/s/files/1/0680/4150/7113/files/model-2.jpg?v=1687286372",
        quantity: 1,
    },
];

export default function CheckoutPage() {
    const subtotal = mockOrder.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    return (
        <main className="min-h-screen bg-[#f9f9f9] text-neutral-900 px-20 py-16">

            {/* back arrow */}
            <button className="text-xl mb-6 text-neutral-500 hover:text-neutral-800 transition">
                ←
            </button>

            {/* title */}
            <h1 className="text-3xl font-extrabold mb-12 tracking-tight uppercase">
                Checkout
            </h1>

            <div className="flex gap-14 items-start">

                {/* LEFT SIDE */}
                <div className="flex-1 max-w-xl">

                    <Tabs defaultValue="information" className="w-full">

                        {/* TABS HEADER */}
                        <TabsList className="flex gap-6 bg-transparent p-0 mb-8">
                            <TabsTrigger
                                value="information"
                                className="uppercase tracking-wide text-sm data-[state=active]:border-b-2 border-neutral-900 rounded-none pb-1"
                            >
                                Information
                            </TabsTrigger>

                            <TabsTrigger
                                value="shipping"
                                className="uppercase tracking-wide text-sm data-[state=active]:border-b-2 border-neutral-900 rounded-none pb-1"
                            >
                                Shipping
                            </TabsTrigger>

                            <TabsTrigger
                                value="payment"
                                className="uppercase tracking-wide text-sm data-[state=active]:border-b-2 border-neutral-900 rounded-none pb-1"
                            >
                                Payment
                            </TabsTrigger>
                        </TabsList>

                        {/* ------------ INFORMATION FORM ------------ */}
                        <TabsContent value="information" className="space-y-10">

                            {/* CONTACT INFO */}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-2">
                                    Contact Info
                                </p>

                                <div className="flex flex-col gap-4">
                                    <div>
                                        <Input placeholder="Email" className="bg-white" />
                                    </div>
                                    <div>
                                        <Input placeholder="Phone" className="bg-white" />
                                    </div>
                                </div>
                            </div>

                            {/* SHIPPING ADDRESS */}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 mb-3">
                                    Shipping Address
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <Input placeholder="First Name" className="bg-white" />
                                    <Input placeholder="Last Name" className="bg-white" />
                                </div>

                                <Input placeholder="Country" className="bg-white mb-4" />
                                <Input placeholder="State / Region" className="bg-white mb-4" />
                                <Input placeholder="Address" className="bg-white mb-4" />

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <Input placeholder="City" className="bg-white" />
                                    <Input placeholder="Postal Code" className="bg-white" />
                                </div>

                                <Button
                                    className="mt-3 bg-neutral-900 text-white hover:bg-neutral-700"
                                >
                                    Continue to Shipping →
                                </Button>
                            </div>
                        </TabsContent>

                        {/* ------------ SHIPPING ------------ */}
                        <TabsContent value="shipping">
                            <p className="text-neutral-500 text-sm">
                                (Shipping details UI will be added when backend is connected)
                            </p>
                        </TabsContent>

                        {/* ------------ PAYMENT ------------ */}
                        <TabsContent value="payment">
                            <p className="text-neutral-500 text-sm">
                                (Payment section will be added later)
                            </p>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* ------------ RIGHT SIDE — ORDER SUMMARY ------------ */}
                <Card className="w-[360px] border border-neutral-200 bg-white p-6 shadow-sm">

                    <h2 className="text-xs font-semibold mb-6 uppercase tracking-wider">
                        Your Order <span className="text-neutral-400">(2)</span>
                    </h2>

                    <div className="flex flex-col gap-6">
                        {mockOrder.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-[70px] h-[90px] border border-neutral-200 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={70}
                                        height={90}
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex-1 text-sm">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-neutral-500 text-xs mb-1">{item.variant}</p>
                                    <p className="text-xs text-neutral-500">
                                        ({item.quantity}) ${item.price}
                                    </p>
                                </div>

                                <button className="text-xs text-neutral-400 hover:text-black transition">
                                    Change
                                </button>
                            </div>
                        ))}
                    </div>

                    <Separator className="my-5" />

                    <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subtotal}</span>
                        </div>

                        <div className="flex justify-between text-neutral-500">
                            <span>Shipping</span>
                            <span>Calculated at next step</span>
                        </div>

                        <div className="flex justify-between font-semibold pt-2">
                            <span>Total</span>
                            <span>${subtotal}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </main>
    );
}