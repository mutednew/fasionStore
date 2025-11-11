"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/userSlice";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { LogOut, User, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { profile } = useAppSelector((state) => state.user);

    useEffect(() => {
        if (!profile) {
            router.push("/");
        }
    }, [profile, router]);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout", {}, { withCredentials: true });
        } catch (err) {
            console.warn("Logout request failed:", err);
        } finally {
            dispatch(logout());
            router.push("/login");
        }
    };

    if (!profile) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-500 text-sm font-medium">Loading profile...</p>
            </main>
        );
    }

    return (
        <main className="relative flex items-center justify-center min-h-screen bg-[#f4f5f7] overflow-hidden font-[Montserrat]">
            {/* ===== Мягкий фон ===== */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 left-0 w-[500px] h-[500px] bg-blue-200/40 blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-200/40 blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/10 blur-[180px]" />
            </div>

            {/* ===== Карточка профиля ===== */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-[420px] bg-white/60 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] p-10 text-center"
            >
                {/* Аватар */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center shadow-lg">
                        <User size={36} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mt-4 tracking-tight">
                        {profile.name}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back 👋</p>
                </div>

                {/* Информация */}
                <div className="bg-white/40 rounded-2xl py-5 px-6 text-left space-y-3 shadow-inner border border-white/30">
                    <div className="flex items-center gap-3 text-gray-700">
                        <Mail size={18} className="text-gray-500" />
                        <span className="text-sm">
              <strong>Email:</strong> {profile.email}
            </span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                        <Shield size={18} className="text-gray-500" />
                        <span className="text-sm">
              <strong>Role:</strong>{" "}
                            {profile.role ? profile.role : "CUSTOMER"}
            </span>
                    </div>
                </div>

                {/* Кнопка выхода */}
                <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-8 flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] text-white text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-[0_0_25px_rgba(255,75,43,0.4)] transition"
                >
                    <LogOut size={16} />
                    Logout
                </motion.button>
            </motion.div>
        </main>
    );
}