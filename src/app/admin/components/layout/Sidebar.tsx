"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Settings,
    HelpCircle,
    MessageSquare, Home,
} from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-black text-white flex flex-col justify-between">
            <div>
                <div className="flex gap-4 p-6 font-semibold text-lg border-b border-white/10">
                    <Link href="/">
                        <Home/>
                    </Link>
                    Admin Panel
                </div>

                <nav className="mt-4 flex flex-col gap-1">
                    {navItems.map(({ name, href, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 px-5 py-3 rounded-md hover:bg-white/10 transition",
                                pathname === href ? "bg-white/20" : ""
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Нижняя часть */}
            <div className="flex flex-col gap-1 p-4 border-t border-white/10">
                <button className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-md transition">
                    <HelpCircle className="h-5 w-5" /> Help
                </button>
                <button className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-md transition">
                    <MessageSquare className="h-5 w-5" /> Feedback
                </button>
            </div>
        </aside>
    );
}
