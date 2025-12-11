"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductSelectorsProps {
    colors: string[];
    sizes: string[];
    selectedColor: string | null;
    selectedSize: string | null;
    quantity: number;
    setColor: (color: string) => void;
    setSize: (size: string) => void;
    setQuantity: (q: number) => void;
}

export function ProductSelectors({
    colors,
    sizes,
    selectedColor,
    selectedSize,
    quantity,
    setColor,
    setSize,
    setQuantity,
}: ProductSelectorsProps) {
    const handleQuantity = (type: "inc" | "dec") => {
        setQuantity(type === "inc" ? quantity + 1 : Math.max(1, quantity - 1));
    };

    return (
        <div className="space-y-6">
            {colors.length > 0 && (
                <div className="space-y-3">
                    <span className="text-sm font-semibold text-gray-900">Color</span>
                    <div className="flex flex-wrap gap-3">
                        {colors.map((c) => (
                            <button
                                key={c}
                                onClick={() => setColor(c)}
                                className={cn(
                                    "w-8 h-8 rounded-full border mt-2 border-gray-200 shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black relative",
                                    selectedColor === c && "ring-1 ring-offset-2 ring-black scale-110"
                                )}
                                style={{ backgroundColor: c }}
                                title={c}
                            />
                        ))}
                    </div>
                </div>
            )}

            {sizes.length > 0 && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-900">Size</span>
                        <button className="text-xs text-gray-500 underline hover:text-black">
                            Size Guide
                        </button>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {sizes.map((s) => (
                            <button
                                key={s}
                                onClick={() => setSize(s)}
                                className={cn(
                                    "h-10 border rounded-md text-sm font-medium transition-all hover:border-gray-400",
                                    selectedSize === s
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-gray-900 border-gray-200"
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-3">
                <span className="text-sm font-semibold text-gray-900">Quantity</span>
                <div className="flex items-center w-32 border border-gray-300 rounded-md">
                    <button
                        onClick={() => handleQuantity("dec")}
                        className="px-3 py-2 hover:bg-gray-100 transition text-gray-600"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="flex-1 text-center font-medium text-sm">
                        {quantity}
                    </span>
                    <button
                        onClick={() => handleQuantity("inc")}
                        className="px-3 py-2 hover:bg-gray-100 transition text-gray-600"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}