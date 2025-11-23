"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ApproachSection() {
    return (
        <section className="w-full bg-white border-t border-neutral-200 py-32">

            {/* HEADER */}
            <div className="max-w-4xl mx-auto px-6 text-center mb-24">
                <h2 className="uppercase font-extrabold tracking-tight text-neutral-900 text-4xl md:text-6xl leading-tight">
                    The Art of Modern Fashion
                </h2>

                <p className="text-neutral-600 text-[15px] leading-relaxed mt-6 max-w-2xl mx-auto">
                    A unique perspective on essential silhouettes, crafted with precision,
                    intention, and a deep respect for timeless aesthetics. Our work blends
                    architecture, texture, and movement into a new generation of wearable art.
                </p>
            </div>

            {/* GRID */}
            <div className="max-w-7xl mx-auto px-6 grid gap-16">

                {/* ROW 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* TEXT BLOCK */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-5"
                    >
                        <h3 className="uppercase text-3xl font-bold tracking-tight text-neutral-900">
                            Precision & Craft
                        </h3>

                        <p className="text-neutral-600 leading-relaxed">
                            Each garment is designed through a lens of sculptural discipline.
                            We believe the future of fashion lies in purity—clean lines,
                            honest materials, and silhouettes that frame the human form
                            without distraction.
                        </p>
                    </motion.div>

                    {/* IMAGE 1 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="relative aspect-[4/5] overflow-hidden"
                    >
                        <Image
                            src="https://img2.ans-media.com/i/542x813/AW25-BLM0PK-99X_F1_PRM.webp?v=1758779933"
                            alt="Lookbook"
                            fill
                            className="object-cover hover:scale-105 transition duration-700"
                        />
                    </motion.div>
                </div>

                {/* ROW 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">

                    {/* IMAGE 2 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="relative aspect-[4/5] overflow-hidden"
                    >
                        <Image
                            src="https://img2.ans-media.com/i/542x813/AW25-BLM0PK-99X_F5_PRM.webp?v=1758779933"
                            alt="Fashion"
                            fill
                            className="object-cover hover:scale-105 transition duration-700"
                        />
                    </motion.div>

                    {/* TEXT BLOCK */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-5"
                    >
                        <h3 className="uppercase text-3xl font-bold tracking-tight text-neutral-900">
                            Material First
                        </h3>

                        <p className="text-neutral-600 leading-relaxed">
                            From organic cotton blends to structured knits and soft-touch
                            jersey—every fabric is selected for longevity and movement.
                            Fashion should not only be beautiful but also sustainable.
                        </p>
                    </motion.div>
                </div>

                {/* ROW 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    {/* TEXT BLOCK */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-5"
                    >
                        <h3 className="uppercase text-3xl font-bold tracking-tight text-neutral-900">
                            Movement & Flow
                        </h3>

                        <p className="text-neutral-600 leading-relaxed">
                            Clothing should move like a second skin. Every collection explores
                            the tension between structure and fluidity, drawing inspiration
                            from contemporary dance and architectural geometry.
                        </p>
                    </motion.div>

                    {/* IMAGE 3 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="relative aspect-[4/5] overflow-hidden"
                    >
                        <Image
                            src="https://img2.ans-media.com/i/542x813/AW25-BLM0PK-99X_F4_PRM.webp?v=1758780874"
                            alt="Editorial"
                            fill
                            className="object-cover hover:scale-105 transition duration-700"
                        />
                    </motion.div>
                </div>

            </div>
        </section>
    );
}