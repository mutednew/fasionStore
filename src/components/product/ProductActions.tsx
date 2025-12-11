"use client";

import { Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
    stock: number;
    isAdding: boolean;
    onAddToCart: () => void;
}

export function ProductActions({ stock, isAdding, onAddToCart }: ProductActionsProps) {
    return (
        <div className="space-y-4">
            <Button
                onClick={onAddToCart}
                disabled={isAdding || stock <= 0}
                className="w-full h-12 text-sm font-bold uppercase tracking-widest rounded-md bg-black hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                isLoading={isAdding}
            >
                {stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </Button>

            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mt-2">
                <div className="flex items-center gap-2">
                    <Truck size={16} />
                    <span>Free shipping over $200</span>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} />
                    <span>Secure checkout</span>
                </div>
            </div>
        </div>
    );
}