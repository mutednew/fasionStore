"use client";

import { Card } from "@/components/ui/card";

export default function ApproachSection() {
    return (
        <section className="w-full bg-[#f5f5f5] py-28 text-center border-t border-neutral-200">

            {/* ===== HEADER ===== */}
            <div className="max-w-2xl mx-auto px-6 mb-20">
                <h2 className="uppercase font-extrabold tracking-tight text-neutral-900
                               text-3xl md:text-4xl leading-tight mb-5">
                    Our Approach To Fashion Design
                </h2>

                <p className="text-neutral-600 text-[15px] leading-relaxed">
                    At Elegant Vogue, we blend creativity with craftsmanship to produce designs
                    that transcend trends and stand the test of time. Each piece is meticulously
                    crafted to ensure premium quality and an exquisite finish.
                </p>
            </div>

            {/* ===== IMAGES GRID ===== */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-8">
                {[1, 2, 3, 4].map((i) => (
                    <Card
                        key={i}
                        className="aspect-[3/4] border border-neutral-200 bg-white flex items-center justify-center shadow-sm hover:shadow-md transition rounded-sm"
                    >
                        <span className="text-neutral-400 text-sm">Image {i}</span>
                    </Card>
                ))}
            </div>
        </section>
    );
}