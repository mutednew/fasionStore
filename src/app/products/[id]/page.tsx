"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { useGetProductByIdQuery } from "@/store/api/productsApi";
import { useAddToCartMutation } from "@/store/api/cartApi";
import { useAppSelector } from "@/store/hooks";

import AuthModal from "@/components/modals/auth/AuthModal";
import { Separator } from "@/components/ui/separator";

import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductSelectors } from "@/components/product/ProductSelectors";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";

export default function ProductPage() {
    const params = useParams();
    const id = params?.id as string;

    const { data: productRes, isLoading } = useGetProductByIdQuery(id);
    const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

    const { profile } = useAppSelector((state) => state.user);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const product = productRes?.data?.product;

    const [color, setColor] = useState<string | null>(null);
    const [size, setSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (product) {
            setColor(product.colors?.[0] || null);
            setSize(null);
            setQuantity(1);
        }
    }, [product]);

    const handleAddToCart = async () => {
        if (!profile) {
            setIsLoginOpen(true);
            return;
        }

        if (product?.sizes && product.sizes.length > 0 && !size) {
            toast.error("Please select a size", { position: "top-center" });
            return;
        }

        try {
            await addToCart({
                productId: product!.id,
                quantity,
                size: size || undefined,
                color: color || undefined,
            }).unwrap();
            toast.success("Added to cart");
        } catch {
            toast.error("Failed to add to cart");
        }
    };

    if (isLoading) return <ProductSkeleton />;

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Product not found
            </div>
        );
    }

    const images = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];

    return (
        <main className="min-h-screen bg-white py-12 px-4 md:px-10 lg:px-20 font-sans">
            <AuthModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">

                <ProductGallery
                    images={images}
                    name={product.name}
                    stock={product.stock}
                />

                <div className="lg:col-span-5 flex flex-col gap-8 pt-4">
                    <ProductInfo product={product} />

                    <Separator />

                    <ProductSelectors
                        colors={product.colors}
                        sizes={product.sizes}
                        selectedColor={color}
                        selectedSize={size}
                        quantity={quantity}
                        setColor={setColor}
                        setSize={setSize}
                        setQuantity={setQuantity}
                    />

                    <ProductActions
                        stock={product.stock}
                        isAdding={isAdding}
                        onAddToCart={handleAddToCart}
                    />

                    <ProductAccordion description={product.description} />
                </div>
            </div>

            <ProductReviews />
        </main>
    );
}