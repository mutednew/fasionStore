"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
    name: string;
    stock: number;
}

export function ProductGallery({ images, name, stock }: ProductGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    return (
        <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-6 lg:sticky lg:top-24 h-fit self-start">
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
                                alt={name}
                                fill
                                priority
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                No Image
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {stock <= 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded">
                        OUT OF STOCK
                    </div>
                )}
            </div>
        </div>
    );
}