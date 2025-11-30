"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {Minus, Plus, Star, Truck, ShieldCheck, User} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { useGetProductByIdQuery } from "@/store/api/productsApi";
import { useAddToCartMutation } from "@/store/api/cartApi";
import { useAppSelector } from "@/store/hooks";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import AuthModal from "@/components/modals/auth/AuthModal";
import { Separator } from "@/components/ui/separator";

export default function ProductPage() {
    const params = useParams();
    const id = params?.id as string;

    // --- ЗАПРОСЫ ---
    const { data: productRes, isLoading } = useGetProductByIdQuery(id);
    const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

    // Auth check
    const { profile } = useAppSelector((state) => state.user);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    // --- ЛОКАЛЬНЫЙ СТЕЙТ ---
    const product = productRes?.data?.product;

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [color, setColor] = useState<string | null>(null);
    const [size, setSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    // Сброс стейта при смене продукта
    useEffect(() => {
        if (product) {
            setSelectedImageIndex(0);
            setColor(product.colors?.[0] || null);
            setSize(null);
            setQuantity(1);
        }
    }, [product]);

    const images = product?.images?.length ? product.images : product?.imageUrl ? [product.imageUrl] : [];
    const hasColors = product?.colors && product.colors.length > 0;
    const hasSizes = product?.sizes && product.sizes.length > 0;

    // --- HANDLERS ---

    const handleQuantity = (type: "inc" | "dec") => {
        setQuantity((prev) => (type === "inc" ? prev + 1 : Math.max(1, prev - 1)));
    };

    const handleAddToCart = async () => {
        if (!profile) {
            setIsLoginOpen(true);
            return;
        }

        if (hasSizes && !size) {
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

    // --- LOADING STATE ---
    if (isLoading) return <ProductSkeleton />;

    // --- NOT FOUND ---
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Product not found
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white py-12 px-4 md:px-10 lg:px-20 font-sans">
            <AuthModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

            {/* ВАЖНО: items-start выравнивает колонки по верху, чтобы они не растягивались */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">

                {/* ==== LEFT: GALLERY ==== */}
                {/* ВАЖНО: h-fit и self-start гарантируют, что высота блока не будет зависеть от соседа */}
                <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-6 lg:sticky lg:top-24 h-fit self-start">

                    {/* THUMBNAILS */}
                    {images.length > 1 && (
                        <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible no-scrollbar">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImageIndex(idx)}
                                    className={cn(
                                        "relative w-20 h-24 lg:w-24 lg:h-32 flex-shrink-0 border rounded-md overflow-hidden transition-all",
                                        selectedImageIndex === idx
                                            ? "border-black ring-1 ring-black"
                                            : "border-transparent hover:border-gray-300"
                                    )}
                                >
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${idx}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* MAIN IMAGE */}
                    <div className="flex-1 relative aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden group">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                            >
                                {images[selectedImageIndex] ? (
                                    <Image
                                        src={images[selectedImageIndex]}
                                        alt={product.name}
                                        fill
                                        priority
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {product.stock <= 0 && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">
                                OUT OF STOCK
                            </div>
                        )}
                    </div>
                </div>

                {/* ==== RIGHT: DETAILS ==== */}
                <div className="lg:col-span-5 flex flex-col gap-8 pt-4">

                    {/* HEADER */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                {product.name}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-2xl font-medium text-gray-900">
                                {Number(product.price).toFixed(2)} ₴
                            </span>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <div className="flex text-yellow-400">
                                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <span className="ml-1">(42 reviews)</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* SELECTORS */}
                    <div className="space-y-6">

                        {/* COLOR */}
                        {hasColors && (
                            <div className="space-y-3">
                                <span className="text-sm font-semibold text-gray-900">Color</span>
                                <div className="flex flex-wrap gap-3">
                                    {product.colors.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={cn(
                                                "w-8 h-8 rounded-full border border-gray-200 shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black relative",
                                                color === c && "ring-1 ring-offset-2 ring-black scale-110"
                                            )}
                                            style={{ backgroundColor: c }}
                                            title={c}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SIZE */}
                        {hasSizes && (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-900">Size</span>
                                    <button className="text-xs text-gray-500 underline hover:text-black">
                                        Size Guide
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                    {product.sizes.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setSize(s)}
                                            className={cn(
                                                "h-10 border rounded-md text-sm font-medium transition-all hover:border-gray-400",
                                                size === s
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

                        {/* QUANTITY */}
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

                    <Button
                        onClick={handleAddToCart}
                        disabled={isAdding || product.stock <= 0}
                        className="w-full h-12 text-sm font-bold uppercase tracking-widest rounded-md bg-black hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAdding ? "Adding..." : product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>

                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-2">
                            <Truck size={16} />
                            <span>Free shipping over 200 ₴</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={16} />
                            <span>Secure checkout</span>
                        </div>
                    </div>

                    {/* ACCORDION INFO (Без отзывов) */}
                    <Accordion type="single" collapsible className="w-full border-t pt-4">
                        <AccordionItem value="desc" className="border-b-0">
                            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
                                Description
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                                {product.description || "No description available for this product."}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="shipping" className="border-b-0">
                            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
                                Shipping & Returns
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                                Free standard shipping on orders over $200. Returns accepted within 30 days of purchase.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="care" className="border-b-0">
                            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
                                Care Instructions
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                                Machine wash cold. Do not bleach. Tumble dry low. Iron low heat.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                </div>
            </div>

            {/* --- REVIEWS SECTION (FULL WIDTH) --- */}
            <div className="max-w-7xl mx-auto pt-16 border-t border-gray-200">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customer Reviews</h2>
                    <Button variant="outline">Write a Review</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Summary Rating */}
                    <div className="col-span-1 bg-gray-50 p-6 rounded-lg h-fit">
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-5xl font-bold text-gray-900">4.8</span>
                            <span className="text-gray-500 mb-2">/ 5</span>
                        </div>
                        <div className="flex text-yellow-400 mb-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} size={20} fill="currentColor" />
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">Based on 42 reviews</p>

                        <div className="mt-6 space-y-2">
                            {[5, 4, 3, 2, 1].map((stars) => (
                                <div key={stars} className="flex items-center gap-2 text-xs">
                                    <span className="w-3">{stars}</span>
                                    <Star size={10} className="text-gray-400" />
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400"
                                            style={{ width: stars === 5 ? '70%' : stars === 4 ? '20%' : '5%' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Review List Placeholder */}
                    <div className="col-span-1 md:col-span-2 space-y-8">
                        {/* Mock Review 1 */}
                        <div className="border-b border-gray-100 pb-8">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User size={16} className="text-gray-500" />
                                    </div>
                                    <span className="font-semibold text-sm">Alex M.</span>
                                    <span className="text-xs text-gray-400 px-2 border-l border-gray-300">Verified Buyer</span>
                                </div>
                                <span className="text-xs text-gray-400">2 days ago</span>
                            </div>
                            <div className="flex text-yellow-400 mb-2">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">Great quality!</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Absolutely love this product. The material feels premium and the fit is perfect. Highly recommend!
                            </p>
                        </div>

                        {/* Mock Review 2 */}
                        <div className="border-b border-gray-100 pb-8">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User size={16} className="text-gray-500" />
                                    </div>
                                    <span className="font-semibold text-sm">Sarah J.</span>
                                </div>
                                <span className="text-xs text-gray-400">1 week ago</span>
                            </div>
                            <div className="flex text-yellow-400 mb-2">
                                {[1, 2, 3, 4].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                <Star size={14} className="text-gray-300" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">Good, but runs small</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Really nice design but I had to size up. Delivery was super fast though.
                            </p>
                        </div>

                        <div className="text-center pt-4">
                            <Button variant="outline" disabled>Load More Reviews</Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

// --- SKELETON ---
function ProductSkeleton() {
    return (
        <main className="min-h-screen bg-white py-12 px-4 md:px-20 font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 flex gap-6">
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="w-24 h-32 rounded-md" />)}
                    </div>
                    <Skeleton className="flex-1 aspect-[3/4] rounded-lg" />
                </div>
                <div className="lg:col-span-5 flex flex-col gap-8 pt-4">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-8 w-1/4" />
                    </div>
                    <Skeleton className="h-px w-full" />
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-12" />
                            <div className="flex gap-3"><Skeleton className="w-8 h-8 rounded-full" /><Skeleton className="w-8 h-8 rounded-full" /></div>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-12" />
                            <div className="grid grid-cols-5 gap-2">
                                {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 rounded-md" />)}
                            </div>
                        </div>
                    </div>
                    <Skeleton className="h-12 w-full rounded-md mt-4" />
                </div>
            </div>
        </main>
    )
}