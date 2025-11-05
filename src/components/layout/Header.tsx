"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Heart, ShoppingCart, User, LogIn, Shield } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { StoreLogo } from "@/components/icons/StoreLogo";

export default function Header() {
    const pathname = usePathname();
    const { items } = useAppSelector((state) => state.cart);
    const { profile } = useAppSelector((state) => state.user);

    console.log("profile", profile);

    const isAdmin = profile?.role === "ADMIN";
    const isAuth = !!profile;

    return (
        <header className="w-full border-b border-gray-200 bg-[#f9f9f9]">
            <div className="flex items-center justify-between px-10 py-5">
                {/* === LEFT: меню и навигация === */}
                <div className="flex items-center gap-8">
                    <button className="p-2 hover:opacity-70">
                        <Menu size={24} strokeWidth={2} />
                    </button>

                    <nav className="flex gap-8 text-sm font-semibold text-gray-900 tracking-wide">
                        <Link
                            href="/"
                            className={cn(
                                "hover:opacity-70",
                                pathname === "/" && "text-black font-bold"
                            )}
                        >
                            Home
                        </Link>

                        <Link
                            href="/collections"
                            className={cn(
                                "hover:opacity-70",
                                pathname.startsWith("/collections") && "text-black font-bold"
                            )}
                        >
                            Collections
                        </Link>

                        <Link
                            href="/products"
                            className={cn(
                                "hover:opacity-70",
                                pathname.startsWith("/products") && "text-black font-bold"
                            )}
                        >
                            Products
                        </Link>
                    </nav>
                </div>

                {/* === CENTER: логотип === */}
                <div className="flex items-center justify-center">
                    <StoreLogo />
                </div>

                {/* === RIGHT: иконки и профиль === */}
                <div className="flex items-center gap-5">
                    <button className="p-3 rounded-full bg-black text-white hover:opacity-80 transition">
                        <Heart size={18} strokeWidth={1.8} />
                    </button>

                    <Link
                        href="/cart"
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:opacity-80 transition relative"
                    >
                        <span className="text-sm">Cart</span>
                        <ShoppingCart size={18} strokeWidth={1.8} />
                        {items.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {items.length}
              </span>
                        )}
                    </Link>

                    {/* === условный рендер: авторизация === */}
                    {isAuth ? (
                        <>
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="p-3 rounded-full bg-black text-white hover:opacity-80 transition"
                                    title="Admin Panel"
                                >
                                    <Shield size={18} strokeWidth={1.8} />
                                </Link>
                            )}

                            <Link
                                href="/profile"
                                className="p-3 rounded-full bg-black text-white hover:opacity-80 transition"
                                title="Profile"
                            >
                                <User size={18} strokeWidth={1.8} />
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="p-3 rounded-full bg-black text-white hover:opacity-80 transition flex items-center gap-2"
                        >
                            <LogIn size={18} strokeWidth={1.8} />
                            <span className="text-sm font-semibold hidden sm:inline">
                Login
              </span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}