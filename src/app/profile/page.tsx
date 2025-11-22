"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/userSlice";
import api from "@/lib/axios";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Mail, User, Shield, LogOut } from "lucide-react";
import { motion } from "framer-motion";

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
            console.warn("Logout failed:", err);
        } finally {
            dispatch(logout());
            router.push("/login");
        }
    };

    if (!profile) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-neutral-100">
                <p className="text-neutral-500 text-sm font-medium">Loading profile...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen w-full bg-neutral-100 flex items-center justify-center px-6 py-20">

            {/* CARD */}
            <motion.div
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
            >
                <Card className="w-[420px] bg-white border border-neutral-200 shadow-lg rounded-2xl">
                    <CardContent className="p-8">

                        {/* AVATAR */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-neutral-900 flex items-center justify-center">
                                <User size={36} className="text-white" />
                            </div>

                            <h1 className="text-xl font-semibold text-neutral-900 mt-4 tracking-tight">
                                {profile.name}
                            </h1>
                            <p className="text-sm text-neutral-500">Welcome back 👋</p>
                        </div>

                        <Separator className="my-6" />

                        {/* INFO BLOCK */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-neutral-700">
                                <Mail size={18} className="text-neutral-500" />
                                <span className="text-sm">
                  <strong className="font-medium">Email:</strong> {profile.email}
                </span>
                            </div>

                            <div className="flex items-center gap-3 text-neutral-700">
                                <Shield size={18} className="text-neutral-500" />
                                <span className="text-sm">
                  <strong className="font-medium">Role:</strong>{" "}
                                    {profile.role ?? "CUSTOMER"}
                </span>
                            </div>
                        </div>

                        {/* LOGOUT BUTTON */}
                        <Button
                            onClick={handleLogout}
                            className="w-full mt-8 flex items-center justify-center gap-2 bg-neutral-900 text-white hover:bg-neutral-800 py-3 rounded-full text-sm font-semibold tracking-wide"
                        >
                            <LogOut size={16} />
                            Logout
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </main>
    );
}