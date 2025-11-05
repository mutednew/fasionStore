"use client";

import Image from "next/image";
import {useState} from "react";

const mockCart = [
    {
        id: "1",
        name: "Full Sleeve Zipper",
        category: "Cotton T Shirt",
        color: "#000000",
        size: "L",
        price: 99,
        image:
            "https://cdn.shopify.com/s/files/1/0680/4150/7113/files/model-1.jpg?v=1687286371",
        quantity: 1,
    },
    {
        id: "2",
        name: "Basic Slim Fit T-Shirt",
        category: "Cotton T Shirt",
        color: "#000000",
        size: "L",
        price: 99,
        image:
            "https://cdn.shopify.com/s/files/1/0680/4150/7113/files/model-2.jpg?v=1687286372",
        quantity: 1,
    },
];

export default function CartPage() {
    const [cart, setCart] = useState(mockCart);

    const handleQuantity = (id: string, delta: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {...item, quantity: Math.max(1, item.quantity + delta)}
                    : item
            )
        );
    };

    const subtotal = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const shipping = 10;
    const total = subtotal + shipping;

    return (
        <main className="min-h-screen w-full bg-[#f9f9f9] text-gray-800 px-20 py-16 font-[Poppins]">
            <h1 className="text-2xl font-extrabold mb-12 tracking-tight">
                SHOPPING BAG
            </h1>

            <div className="flex gap-10">
                {/* ==== LEFT: CART ITEMS ==== */}
                <div className="flex-1">
                    <div className="grid grid-cols-2 gap-10">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="border border-gray-200 p-4 bg-white relative"
                            >
                                <button className="absolute top-3 right-3 text-gray-400 hover:text-black text-lg">
                                    ×
                                </button>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-[260px] h-[340px] border border-gray-100">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={260}
                                            height={340}
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* size + color */}
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="flex items-center gap-1 text-xs uppercase">
                                            <span>L</span>
                                            <div
                                                className="w-3 h-3 border border-gray-400 ml-1"
                                                style={{backgroundColor: item.color}}
                                            />
                                        </div>
                                    </div>

                                    {/* quantity controls */}
                                    <div className="flex items-center gap-3 border border-gray-300 px-2 py-1">
                                        <button
                                            onClick={() => handleQuantity(item.id, -1)}
                                            className="text-sm"
                                        >
                                            −
                                        </button>
                                        <span className="w-6 text-center text-sm">
                      {item.quantity}
                    </span>
                                        <button
                                            onClick={() => handleQuantity(item.id, 1)}
                                            className="text-sm"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* title */}
                                    <div className="text-center mt-4">
                                        <p className="text-xs text-gray-400">{item.category}</p>
                                        <h3 className="text-[13px] font-semibold">
                                            {item.name}
                                        </h3>
                                        <p className="text-[13px] font-medium">${item.price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ==== RIGHT: ORDER SUMMARY ==== */}
                <div className="w-[320px] border border-gray-200 p-6 bg-white self-start">
                    <h2 className="text-sm font-semibold mb-6 uppercase tracking-wider">
                        ORDER SUMMARY
                    </h2>

                    <div className="flex justify-between text-sm mb-1">
                        <span>Subtotal</span>
                        <span>${subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                        <span>Shipping</span>
                        <span>${shipping}</span>
                    </div>

                    <div className="border-t border-gray-200 mt-4 pt-4">
                        <div className="flex justify-between text-sm font-semibold">
                            <span>
                                TOTAL
                                <span className="text-xs text-gray-400">(TAX INCL.)</span>
                            </span>

                            <span>${total}</span>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                        <input type="checkbox" className="accent-black"/>
                        <p>I agree to the Terms and Conditions</p>
                    </div>

                    <button
                        className="mt-6 w-full bg-[#e5e5e5] text-[13px] font-semibold py-3 hover:bg-black hover:text-white transition">
                        CONTINUE
                    </button>
                </div>
            </div>
        </main>
    );
}