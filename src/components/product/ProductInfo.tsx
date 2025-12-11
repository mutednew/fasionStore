"use client";

import { Star } from "lucide-react";
import { Product } from "@/types";
import { ProductPrice } from "./ProductPrice";

interface ProductInfoProps {
    product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    {product.name}
                </h1>
            </div>
            <div className="flex items-center gap-4 mb-6">
                <div className="text-2xl">
                    <ProductPrice price={product.price} salePrice={product.salePrice} />
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                    <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} size={14} fill="currentColor" />
                        ))}
                    </div>
                    <span className="ml-1">(42 reviews)</span>
                </div>
            </div>
        </div>
    );
}