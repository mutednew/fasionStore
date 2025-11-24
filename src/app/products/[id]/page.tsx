"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetProductByIdQuery } from "@/store/api/productsApi";

import {motion, AnimatePresence, Variants} from "framer-motion";
import {X} from "lucide-react";

export default function ProductPage() {
    const { id } = useParams() as { id: string };
    const { data, isLoading } = useGetProductByIdQuery(id);

    const product = data?.data?.product;

    // ==== REAL DATA ====
    const images =
        product?.images?.length
            ? product.images
            : product?.imageUrl
                ? [product.imageUrl]
                : ["/placeholder.png"];

    const colors = product?.colors ?? [];
    const sizes = product?.sizes ?? [];
    const tags = product?.tags ?? [];

    // ==== LOCAL STATE ====
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(images[0]);

    const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
    const [selectedSize, setSelectedSize] = useState("");

    const [thumbIndex, setThumbIndex] = useState(0);
    const VISIBLE_THUMBS = 5;

    const [direction, setDirection] = useState<1 | -1>(1);

    // fullscreen
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
    const [fullscreenIndex, setFullscreenIndex] = useState(0);

    const visibleThumbs = images.slice(thumbIndex, thumbIndex + VISIBLE_THUMBS);

    const scrollUp = () => {
        if (thumbIndex > 0) setThumbIndex(i => i - 1);
    };

    const scrollDown = () => {
        if (thumbIndex < images.length - VISIBLE_THUMBS)
            setThumbIndex(i => i + 1);
    };

    const handleSelectImage = (i: number) => {
        if (i === selectedIndex) return;

        setDirection(i > selectedIndex ? 1 : -1);

        setSelectedIndex(i);
        setSelectedImage(images[i]);

        if (i === thumbIndex + VISIBLE_THUMBS - 1) scrollDown();
        if (i === thumbIndex) scrollUp();
    };

    // fullscreen
    const openFullscreen = (index: number) => {
        setFullscreenIndex(index);
        setIsFullscreenOpen(true);
    };

    const closeFullscreen = () => setIsFullscreenOpen(false);

    const goFullscreenNext = () => {
        setFullscreenIndex(prev => (prev + 1) % images.length);
    };

    const goFullscreenPrev = () => {
        setFullscreenIndex(prev => (prev - 1 + images.length) % images.length);
    };

    useEffect(() => {
        if (!isFullscreenOpen) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeFullscreen();
            if (e.key === "ArrowRight") goFullscreenNext();
            if (e.key === "ArrowLeft") goFullscreenPrev();
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isFullscreenOpen, images.length]);

    useEffect(() => {
        if (images.length > 0) {
            setSelectedImage(images[0]);
            setSelectedIndex(0);
        }
    }, [product]);

    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                Loading product...
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                Product not found
            </main>
        );
    }

    // NEXT IMAGE
    const nextIndex = (selectedIndex + 1) % images.length;
    const secondImage = images[nextIndex];

    const sliderVariants: Variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            transition: { duration: 0.35 }
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.45,
                ease: "easeOut"
            }
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
            transition: { duration: 0.35 }
        })
    };

    const sliderVariantsSecond: Variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            transition: { duration: 0.35, delay: 0.15 } // задержка
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.45,
                ease: "easeOut",
                delay: 0.1
            }
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
            transition: { duration: 0.35, delay: 0.05 }
        })
    };

    const fsBackdrop: Variants = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.2, ease: "linear" } },
        exit: { opacity: 0, transition: { duration: 0.15, ease: "linear" } },
    };

    const fsImage: Variants = {
        initial: { opacity: 0, scale: 0.92, y: 20 },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.3, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            scale: 0.92,
            y: 20,
            transition: { duration: 0.2, ease: "easeIn" },
        },
    };

    return (
        <main className="min-h-screen w-full bg-white text-neutral-900 px-8 md:px-20 lg:px-32 py-12">

            {/* Breadcrumb */}
            <p className="text-xs text-neutral-500 mb-6 tracking-wide">
                Home / Products / <span className="opacity-70">{product.name}</span>
            </p>

            {/* MAIN GRID */}
            <div className="grid grid-cols-12 gap-10 lg:gap-20">

                {/* LEFT SIDE — IMAGES */}
                <div className="col-span-12 lg:col-span-7 flex gap-6">

                    {/* THUMBNAILS */}
                    <div className="flex flex-col items-center w-20">

                        {images.length > VISIBLE_THUMBS && (
                            <button
                                onClick={scrollUp}
                                disabled={thumbIndex === 0}
                                className={`w-8 h-8 mb-2 text-neutral-600 hover:text-black transition ${
                                    thumbIndex === 0 ? "opacity-30 cursor-default" : ""
                                }`}
                            >
                                ▲
                            </button>
                        )}

                        <div className="flex flex-col gap-3">
                            {visibleThumbs.map((img) => {
                                const realIndex = images.indexOf(img);

                                return (
                                    <Card
                                        key={img}
                                        onClick={() => handleSelectImage(realIndex)}
                                        className={`relative w-full aspect-[3/4] overflow-hidden cursor-pointer border transition ${
                                            realIndex === selectedIndex
                                                ? "border-black ring-1 ring-black"
                                                : "border-neutral-300 hover:border-neutral-500"
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt=""
                                            fill
                                            className="object-cover"
                                        />
                                    </Card>
                                );
                            })}
                        </div>

                        {images.length > VISIBLE_THUMBS && (
                            <button
                                onClick={scrollDown}
                                disabled={thumbIndex >= images.length - VISIBLE_THUMBS}
                                className={`w-8 h-8 mt-2 text-neutral-600 hover:text-black transition ${
                                    thumbIndex >= images.length - VISIBLE_THUMBS
                                        ? "opacity-30 cursor-default"
                                        : ""
                                }`}
                            >
                                ▼
                            </button>
                        )}
                    </div>

                    {/* ==========================
                       TWO MAIN IMAGES (motion)
                       ========================== */}
                    <div className="grid grid-cols-2 gap-6 flex-1">

                        {/* IMAGE 1 */}
                        <div
                            className="relative w-full h-[700px] border border-neutral-200 rounded-md overflow-hidden shadow-sm cursor-zoom-in"
                            onClick={() => openFullscreen(selectedIndex)}
                        >
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={selectedImage}
                                    custom={direction}
                                    variants={sliderVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={selectedImage}
                                        alt={product.name}
                                        fill
                                        priority
                                        className="object-cover"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* IMAGE 2 */}
                        <div
                            className="relative w-full h-[700px] border border-neutral-200 rounded-md overflow-hidden shadow-sm cursor-zoom-in"
                            onClick={() => openFullscreen(nextIndex)}
                        >
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={secondImage}
                                    custom={direction}
                                    variants={sliderVariantsSecond}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={secondImage}
                                        alt="second"
                                        fill
                                        className="object-cover"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE — INFO */}
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-10 pr-4">

                    {/* NAME + PRICE */}
                    <div>
                        <h1 className="text-3xl font-light tracking-tight mb-2">
                            {product.name}
                        </h1>

                        <p className="text-lg font-medium mb-1">
                            {product.price} грн
                        </p>

                        <p className="text-[11px] text-neutral-500">
                            Added {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    {/* COLORS */}
                    <div>
                        <p className="text-xs text-neutral-500 uppercase mb-2">Color</p>

                        {colors.length > 0 ? (
                            <div className="flex gap-3">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        style={{ backgroundColor: color }}
                                        className={`w-8 h-8 rounded-sm border transition ${
                                            selectedColor === color
                                                ? "border-neutral-900 scale-105"
                                                : "border-neutral-300 hover:border-neutral-500"
                                        }`}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-neutral-400 italic">No colors available</p>
                        )}
                    </div>

                    {/*  SIZES  */}
                    <div>
                        <p className="text-xs text-neutral-500 uppercase mb-2">Size</p>

                        {sizes.length > 0 ? (
                            <div className="flex gap-2 flex-wrap">
                                {sizes.map((size) => (
                                    <Button
                                        key={size}
                                        variant={selectedSize === size ? "default" : "outline"}
                                        className={`px-4 py-1 h-auto text-xs rounded-none ${
                                            selectedSize === size
                                                ? "bg-neutral-900 text-white"
                                                : "border-neutral-300 hover:border-neutral-500"
                                        }`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-neutral-400 italic">No sizes available</p>
                        )}

                        <div className="flex justify-between text-[11px] text-neutral-500 mt-3">
                            <span className="cursor-pointer hover:text-neutral-700">Find your size</span>
                            <span className="cursor-pointer hover:text-neutral-700">Measurement guide</span>
                        </div>
                    </div>

                    {/* TAGS */}
                    {tags.length > 0 && (
                        <div>
                            <p className="text-xs text-neutral-500 uppercase mb-2">Tags</p>
                            <div className="flex gap-2 flex-wrap">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 text-xs border border-neutral-300 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <Separator />

                    <Button className="w-full rounded-none bg-neutral-900 text-white hover:bg-neutral-800 py-4">
                        Add to Cart
                    </Button>
                </div>
            </div>

            {/* =======================================================
                            DESCRIPTION
            ======================================================= */}
            <section className="mt-20">
                <h2 className="text-xl font-semibold mb-4">Description</h2>

                <div className="text-sm leading-relaxed text-neutral-700 whitespace-pre-line">
                    {product.description?.trim()
                        ? product.description
                        : "There is no description for this product yet."}
                </div>
            </section>

            {/* =======================================================
                        FULLSCREEN GALLERY (variant B)
            ======================================================= */}
            <AnimatePresence>
                {isFullscreenOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-[2px] flex flex-col"
                        variants={fsBackdrop}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        onClick={closeFullscreen}
                    >

                        {/* Top bar */}
                        <div className="flex items-center justify-end px-6 py-4 text-white">
                            <button
                                className="hover:opacity-80 transition"
                                onClick={closeFullscreen}
                            >
                                <X size={30} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* CENTER AREA */}
                        <div
                            className="flex-1 flex items-center justify-center relative px-6 md:px-16"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Left Arrow */}
                            {images.length > 1 && (
                                <button
                                    className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition text-4xl"
                                    onClick={goFullscreenPrev}
                                >
                                    ‹
                                </button>
                            )}

                            {/* IMAGE */}
                            <motion.div
                                variants={fsImage}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="relative flex items-center justify-center w-full"
                            >
                                <div className="relative max-w-[85vw] max-h-[70vh] flex items-center justify-center">
                                    <Image
                                        src={images[fullscreenIndex]}
                                        alt={`image-${fullscreenIndex}`}
                                        width={600}
                                        height={1100}
                                        className="object-contain select-none pointer-events-none"
                                    />
                                </div>
                            </motion.div>

                            {/* Right Arrow */}
                            {images.length > 1 && (
                                <button
                                    className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition text-4xl"
                                    onClick={goFullscreenNext}
                                >
                                    ›
                                </button>
                            )}
                        </div>

                        {/* THUMBNAILS */}
                        <div
                            className="w-full px-4 md:px-10 pb-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex gap-2 overflow-x-auto justify-center">
                                {images.map((img, idx) => (
                                    <button
                                        key={img + idx}
                                        onClick={() => setFullscreenIndex(idx)}
                                        className={`relative w-16 h-20 rounded-md overflow-hidden border ${
                                            fullscreenIndex === idx
                                                ? "border-white"
                                                : "border-white/40"
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`thumb-${idx}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}