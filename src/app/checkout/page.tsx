"use client";

import Image from "next/image";
import { useState } from "react";

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
    const [step, setStep] = useState<"information" | "shipping" | "payment">(
        "information"
    );

    const subtotal = mockOrder.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    return (
        <main className="min-h-screen bg-[#f9f9f9] text-gray-800 px-20 py-16 font-[Poppins]">
            {/* Back arrow */}
            <button className="text-xl mb-6 text-gray-500 hover:text-black">←</button>

            <h1 className="text-2xl font-extrabold mb-10 tracking-tight uppercase">
                Checkout
            </h1>

            <div className="flex gap-10">
                {/* ==== LEFT SIDE ==== */}
                <div className="flex-1">
                    {/* Tabs */}
                    <div className="flex gap-6 mb-8 text-sm font-medium uppercase tracking-wide">
                        <button
                            onClick={() => setStep("information")}
                            className={`pb-1 ${
                                step === "information"
                                    ? "border-b-2 border-black text-black"
                                    : "text-gray-400 hover:text-black"
                            }`}
                        >
                            Information
                        </button>
                        <button
                            onClick={() => setStep("shipping")}
                            className={`pb-1 ${
                                step === "shipping"
                                    ? "border-b-2 border-black text-black"
                                    : "text-gray-400 hover:text-black"
                            }`}
                        >
                            Shipping
                        </button>
                        <button
                            onClick={() => setStep("payment")}
                            className={`pb-1 ${
                                step === "payment"
                                    ? "border-b-2 border-black text-black"
                                    : "text-gray-400 hover:text-black"
                            }`}
                        >
                            Payment
                        </button>
                    </div>

                    {/* === INFORMATION FORM === */}
                    {step === "information" && (
                        <form className="flex flex-col gap-6 max-w-xl">
                            {/* Contact Info */}
                            <div>
                                <p className="text-xs font-semibold mb-2 uppercase text-gray-500">
                                    Contact Info
                                </p>
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="border border-gray-300 px-3 py-2 w-full text-sm focus:outline-none focus:border-gray-500"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone"
                                        className="border border-gray-300 px-3 py-2 w-full text-sm focus:outline-none focus:border-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <p className="text-xs font-semibold mb-2 uppercase text-gray-500">
                                    Shipping Address
                                </p>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        className="border border-gray-300 px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        className="border border-gray-300 px-3 py-2 text-sm"
                                    />
                                </div>

                                <input
                                    type="text"
                                    placeholder="Country"
                                    className="border border-gray-300 px-3 py-2 w-full text-sm mb-3"
                                />
                                <input
                                    type="text"
                                    placeholder="State / Region"
                                    className="border border-gray-300 px-3 py-2 w-full text-sm mb-3"
                                />
                                <input
                                    type="text"
                                    placeholder="Address"
                                    className="border border-gray-300 px-3 py-2 w-full text-sm mb-3"
                                />
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        className="border border-gray-300 px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Postal Code"
                                        className="border border-gray-300 px-3 py-2 text-sm"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep("shipping")}
                                    className="mt-4 w-[150px] bg-black text-white py-3 text-sm uppercase font-semibold hover:bg-gray-800 transition"
                                >
                                    Shipping →
                                </button>
                            </div>
                        </form>
                    )}

                    {/* === SHIPPING === */}
                    {step === "shipping" && (
                        <div className="text-gray-500 mt-8 text-sm">
                            (макет для Shipping будет добавлен после подключения данных)
                        </div>
                    )}

                    {/* === PAYMENT === */}
                    {step === "payment" && (
                        <div className="text-gray-500 mt-8 text-sm">
                            (макет для Payment будет добавлен позже)
                        </div>
                    )}
                </div>

                {/* ==== RIGHT SIDE ==== */}
                <div className="w-[360px] border border-gray-200 bg-white p-6 self-start">
                    <h2 className="text-xs font-semibold mb-6 uppercase tracking-wider">
                        Your Order <span className="text-gray-400">(2)</span>
                    </h2>

                    <div className="flex flex-col gap-6 mb-6">
                        {mockOrder.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-[70px] h-[90px] border border-gray-200">
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
                                    <p className="text-gray-500 text-xs mb-2">{item.variant}</p>
                                    <p className="text-xs text-gray-500">
                                        ({item.quantity}) ${item.price}
                                    </p>
                                </div>

                                <button className="text-xs text-gray-400 hover:text-black">
                                    Change
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="text-sm border-t border-gray-200 pt-3">
                        <div className="flex justify-between mb-1">
                            <span>Subtotal</span>
                            <span>${subtotal}</span>
                        </div>
                        <div className="flex justify-between mb-1 text-gray-500">
                            <span>Shipping</span>
                            <span>Calculated at next step</span>
                        </div>

                        <div className="flex justify-between mt-3 font-semibold">
                            <span>Total</span>
                            <span>${subtotal}</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}