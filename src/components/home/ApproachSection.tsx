"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ApproachSection() {
    return (
        <section className="w-full bg-[#f9f9f9] py-32 overflow-hidden border-t border-neutral-200">
            <div className="max-w-[1440px] mx-auto px-6 md:px-10">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-10 mb-32 border-b border-neutral-300 pb-10">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-neutral-900 leading-[0.9]"
                        >
                            The Art of <br/>
                            <span className="text-neutral-400">Design</span>
                        </motion.h2>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="max-w-sm text-sm text-neutral-600 leading-relaxed"
                    >
                        <p>
                            A unique perspective on essential silhouettes. We blend architecture,
                            texture, and movement into a new generation of wearable art.
                        </p>
                    </motion.div>
                </div>

                {/* CONTENT BLOCKS */}
                <div className="space-y-32">
                    <FeatureBlock
                        num="01"
                        title="Precision & Craft"
                        text="Each garment is designed through a lens of sculptural discipline. We believe the future of fashion lies in purity—clean lines, honest materials, and silhouettes that frame the human form without distraction."
                        img="https://img2.ans-media.com/i/542x813/AW25-BLM0PK-99X_F1_PRM.webp?v=1758779933"
                        align="left"
                    />

                    <FeatureBlock
                        num="02"
                        title="Material First"
                        text="From organic cotton blends to structured knits and soft-touch jersey—every fabric is selected for longevity and movement. Fashion should not only be beautiful but also sustainable."
                        img="https://img2.ans-media.com/i/542x813/AW25-BLM0PK-99X_F5_PRM.webp?v=1758779933"
                        align="right"
                    />

                    <FeatureBlock
                        num="03"
                        title="Movement & Flow"
                        text="Clothing should move like a second skin. Every collection explores the tension between structure and fluidity, drawing inspiration from contemporary dance and architectural geometry."
                        img="https://img2.ans-media.com/i/542x813/AW25-BLM0PK-99X_F4_PRM.webp?v=1758780874"
                        align="left"
                    />
                </div>

                {/* FOOTER CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mt-32 text-center"
                >
                    <h3 className="text-3xl font-bold uppercase tracking-tight mb-6">Ready to explore?</h3>
                    <Link href="/products">
                        <Button variant="outline" className="h-14 px-10 rounded-full border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white uppercase tracking-widest text-xs font-bold transition-all">
                            View Full Collection
                        </Button>
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}

function FeatureBlock({ num, title, text, img, align }: { num: string, title: string, text: string, img: string, align: "left" | "right" }) {
    const isLeft = align === "left";

    return (
        <div className={`flex flex-col ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}>

            {/* IMAGE */}
            <motion.div
                className="w-full lg:w-1/2 relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden bg-neutral-200"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
            >
                <Image
                    src={img}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-1000 hover:scale-105"
                />
            </motion.div>

            {/* TEXT */}
            <div className="w-full lg:w-1/2 relative">
                {/* Big Background Number */}
                <motion.span
                    className="absolute -top-16 md:-top-24 -left-6 md:-left-10 text-[120px] md:text-[200px] font-black text-neutral-200/50 leading-none select-none -z-10"
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    {num}
                </motion.span>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="relative z-10 pt-4"
                >
                    <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-neutral-900 mb-6">
                        {title}
                    </h3>
                    <p className="text-neutral-600 text-base md:text-lg leading-relaxed max-w-md">
                        {text}
                    </p>

                    <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer group text-neutral-900">
                        <span className="border-b border-black pb-0.5 group-hover:text-neutral-600 transition-colors">Read More</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}