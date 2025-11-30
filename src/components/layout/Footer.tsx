import Link from "next/link";
import { FooterLogo } from "@/components/icons/FooterLogo"; // Твой логотип
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Youtube, ArrowRight, CreditCard } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative w-full bg-neutral-950 text-neutral-300 overflow-hidden">

            {/* === BACKGROUND IMAGE & OVERLAY === */}
            <div className="absolute inset-0 z-0">
                {/* Если картинки нет, будет просто черный фон. Если есть - она будет едва видна через оверлей */}
                <div className="absolute inset-0 bg-[url('/footerBg.png')] bg-cover bg-center opacity-30 grayscale mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-neutral-950/80" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-10">

                {/* === TOP SECTION: NEWSLETTER & BRAND === */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
                    <div className="max-w-md">
                        <div className="mb-6 text-white scale-110 origin-left">
                            <FooterLogo />
                        </div>
                        <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                            We create clothes for those who value style, quality, and individuality.
                            Join our community and be the first to know about new drops.
                        </p>

                        {/* SOCIALS */}
                        <div className="flex gap-4">
                            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
                                >
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* NEWSLETTER FORM */}
                    <div className="w-full lg:w-auto min-w-[300px]">
                        <h3 className="text-white font-semibold tracking-wide mb-4">SUBSCRIBE TO OUR NEWSLETTER</h3>
                        <p className="text-xs text-neutral-500 mb-4">Get 10% off your first order when you sign up.</p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Your email address"
                                className="bg-neutral-900/50 border-neutral-800 text-white placeholder:text-neutral-600 focus-visible:ring-white"
                            />
                            <Button className="bg-white text-black hover:bg-neutral-200 px-6">
                                <ArrowRight size={18} />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-neutral-900 mb-16" />

                {/* === MIDDLE SECTION: LINKS GRID === */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">

                    {/* Column 1 */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold text-sm tracking-wider mb-2">SHOP</h4>
                        <Link href="/products" className="text-sm hover:text-white transition-colors">New Arrivals</Link>
                        <Link href="/products" className="text-sm hover:text-white transition-colors">Best Sellers</Link>
                        <Link href="/collections" className="text-sm hover:text-white transition-colors">Collections</Link>
                        <Link href="/products?price=low" className="text-sm hover:text-white transition-colors">Sale</Link>
                    </div>

                    {/* Column 2 */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold text-sm tracking-wider mb-2">COMPANY</h4>
                        <Link href="#" className="text-sm hover:text-white transition-colors">About Us</Link>
                        <Link href="#" className="text-sm hover:text-white transition-colors">Careers</Link>
                        <Link href="#" className="text-sm hover:text-white transition-colors">Sustainability</Link>
                        <Link href="#" className="text-sm hover:text-white transition-colors">Press</Link>
                    </div>

                    {/* Column 3 */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold text-sm tracking-wider mb-2">SUPPORT</h4>
                        <Link href="#" className="text-sm hover:text-white transition-colors">Help Center</Link>
                        <Link href="#" className="text-sm hover:text-white transition-colors">Shipping & Returns</Link>
                        <Link href="#" className="text-sm hover:text-white transition-colors">Size Guide</Link>
                        <Link href="#" className="text-sm hover:text-white transition-colors">Contact Us</Link>
                    </div>

                    {/* Column 4 */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold text-sm tracking-wider mb-2">LEGAL</h4>
                        <Link href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-sm hover:text-white transition-colors">Terms of Service</Link>
                        <Link href="#" className="text-sm hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                </div>

                {/* === BOTTOM SECTION: COPYRIGHT & PAYMENTS === */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-neutral-900">
                    <p className="text-xs text-neutral-600">
                        © 2025 Fashion Store. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4 text-neutral-600">
                        <span className="text-xs">Secure Payment:</span>
                        <div className="flex gap-2">
                            <CreditCard size={20} />
                            <CreditCard size={20} />
                            <CreditCard size={20} />
                        </div>
                    </div>

                    <div className="flex gap-6 text-xs font-semibold text-neutral-500">
                        <span className="cursor-pointer hover:text-white transition-colors">ENG</span>
                        <span className="cursor-pointer hover:text-white transition-colors">USD</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}