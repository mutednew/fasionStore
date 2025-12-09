"use client";

import Link from "next/link";
import NextImage from "next/image";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import { useAddToCartMutation } from "@/store/api/cartApi";
import { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AuthModal from "@/components/modals/auth/AuthModal";
import { useState } from "react";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { profile } = useAppSelector((state) => state.user);
    const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const handleQuickAdd = async (e: React.MouseEvent) => {
        e.preventDefault(); // Чтобы не переходить по ссылке
        e.stopPropagation();

        if (!profile) {
            setIsLoginOpen(true);
            return;
        }

        try {
            await addToCart({
                productId: product.id,
                quantity: 1,
                size: product.sizes?.[0], // Берем первый доступный размер для Quick Add
                color: product.colors?.[0],
            }).unwrap();
            toast.success("Added to cart");
        } catch (err) {
            toast.error("Failed to add to cart");
        }
    };

    return (
        <>
            <AuthModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

            <Link href={`/products/${product.id}`} className="block h-full group">
                <Card className="h-full overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white flex flex-col rounded-xl ring-1 ring-neutral-200/50">
                    <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                        {product.imageUrl ? (
                            <NextImage
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-300 bg-neutral-50">
                                No Image
                            </div>
                        )}

                        {product.stock > 0 && (
                            <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                <Button
                                    className="w-full shadow-lg font-semibold bg-white text-black hover:bg-neutral-100"
                                    onClick={handleQuickAdd}
                                    disabled={isAdding}
                                    isLoading={isAdding} // Используем твою новую умную кнопку
                                >
                                    {!isAdding && <ShoppingCart className="w-4 h-4 mr-2" />}
                                    Quick Add
                                </Button>
                            </div>
                        )}

                        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                            {product.stock <= 0 && (
                                <Badge variant="destructive" className="shadow-sm">Out of Stock</Badge>
                            )}
                            {(new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                                <Badge className="bg-blue-600 hover:bg-blue-700 shadow-sm">New</Badge>
                            )}
                        </div>
                    </div>

                    <CardContent className="p-5 flex flex-col flex-grow">
                        <div className="mb-2">
                            <h3 className="font-semibold text-neutral-900 text-lg leading-tight truncate group-hover:text-blue-600 transition-colors">
                                {product.name}
                            </h3>
                            <p className="text-sm text-neutral-500 mt-1 line-clamp-1">
                                {product.description || "Fashion Item"}
                            </p>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-2">
                            <span className="text-xl font-bold text-neutral-900">
                                ${Number(product.price).toFixed(2)}
                            </span>

                            {product.colors && product.colors.length > 0 && (
                                <div className="flex -space-x-1.5">
                                    {product.colors.slice(0, 3).map((c, idx) => (
                                        <div
                                            key={idx}
                                            className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-neutral-100"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                    {product.colors.length > 3 && (
                                        <div className="w-5 h-5 rounded-full border-2 border-white bg-neutral-100 flex items-center justify-center text-[9px] font-bold text-neutral-500 ring-1 ring-neutral-100">
                                            +{product.colors.length - 3}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-gray-100 h-full">
            <Skeleton className="h-[320px] w-full rounded-lg" />
            <div className="space-y-3 px-1 flex-grow">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between pt-4 mt-auto">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
            </div>
        </div>
    );
}