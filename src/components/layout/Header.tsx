"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Heart, ShoppingCart, User, LogIn, Shield, Loader2, ChevronDown } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { StoreLogo } from "@/components/icons/StoreLogo";
import { useState, useEffect } from "react";
import AuthModal from "@/components/modals/auth/AuthModal";
import { useGetCategoriesQuery } from "@/store/api/productsApi";
import { useGetCartQuery } from "@/store/api/cartApi";

export default function Header() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const pathname = usePathname();
    const { profile } = useAppSelector((state) => state.user);

    const { data: cartData } = useGetCartQuery();

    const cartCount = cartData?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const { data: catData, isLoading: loadingCats } = useGetCategoriesQuery();
    const categories = catData?.categories ?? [];

    useEffect(() => {
        setMounted(true);
    }, []);

    const isAuth = mounted && !!profile;
    const isAdmin = mounted && profile?.role === "ADMIN";

    const displayCount = mounted ? cartCount : 0;

    return (
        <>
            <header className="w-full border-b border-gray-200 bg-[#f9f9f9] sticky top-0 z-50">
                <div className="flex items-center justify-between px-6 md:px-10 py-4">
                    <div className="flex items-center gap-8">
                        <button className="lg:hidden p-2 hover:opacity-70">
                            <Menu size={24} strokeWidth={2} />
                        </button>

                        <nav className="hidden lg:flex gap-6 text-sm font-semibold text-gray-600 tracking-wide items-center relative">
                            <Link
                                href="/"
                                className={cn(
                                    "hover:text-black transition-colors",
                                    pathname === "/" && "text-black font-bold"
                                )}
                            >
                                Home
                            </Link>

                            <Link
                                href="/products"
                                className={cn(
                                    "hover:text-black transition-colors",
                                    pathname === "/products" && "text-black font-bold"
                                )}
                            >
                                Shop All
                            </Link>

                            <div className="group relative h-full flex items-center">
                                <button
                                    className={cn(
                                        "flex items-center gap-1 hover:text-black transition-colors py-2",
                                        pathname.startsWith("/categories") && "text-black font-bold"
                                    )}
                                >
                                    Categories
                                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                                </button>

                                <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50">
                                    <div className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden py-1">
                                        {loadingCats ? (
                                            <div className="flex justify-center py-4">
                                                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                                            </div>
                                        ) : categories.length > 0 ? (
                                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                                {categories.map((cat) => (
                                                    <Link
                                                        key={cat.id}
                                                        href={`/categories/${cat.id}`}
                                                        className={cn(
                                                            "block px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-black transition-colors capitalize",
                                                            pathname === `/categories/${cat.id}`
                                                                ? "text-black font-bold bg-gray-50"
                                                                : "text-gray-600"
                                                        )}
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="px-4 py-3 text-xs text-gray-400 text-center">
                                                No categories yet
                                            </div>
                                        )}
                                        <div className="border-t border-gray-100 mt-1 pt-1">
                                            <Link
                                                href="/products"
                                                className="block px-4 py-2 text-xs font-semibold text-center text-gray-500 hover:text-black transition-colors"
                                            >
                                                View All Products
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>

                    <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                        <Link href="/">
                            <StoreLogo />
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 md:gap-5">
                        <button className="p-2 md:p-3 rounded-full bg-black text-white hover:opacity-80 transition shadow-sm">
                            <Heart size={18} strokeWidth={1.8} />
                        </button>

                        <Link
                            href="/cart"
                            className="flex items-center gap-2 bg-black text-white px-3 md:px-4 py-2 rounded-full hover:opacity-80 transition relative shadow-sm"
                        >
                            <span className="text-sm font-medium hidden md:inline">Cart</span>
                            <ShoppingCart size={18} strokeWidth={1.8} />

                            {}
                            {displayCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white shadow-sm animate-in zoom-in duration-300">
                                    {displayCount}
                                </span>
                            )}
                        </Link>

                        {isAuth ? (
                            <div className="flex items-center gap-2">
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="p-2 md:p-3 rounded-full bg-black text-white hover:opacity-80 transition shadow-sm"
                                        title="Admin Panel"
                                    >
                                        <Shield size={18} strokeWidth={1.8} />
                                    </Link>
                                )}

                                <Link
                                    href="/profile"
                                    className="p-2 md:p-3 rounded-full bg-black text-white hover:opacity-80 transition shadow-sm"
                                    title="Profile"
                                >
                                    <User size={18} strokeWidth={1.8} />
                                </Link>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsLoginOpen(true)}
                                className="p-2 md:p-3 rounded-full bg-black text-white hover:opacity-80 transition flex items-center gap-2 shadow-sm"
                            >
                                <LogIn size={18} strokeWidth={1.8} />
                                <span className="text-sm font-semibold hidden md:inline">Login</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <AuthModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
}