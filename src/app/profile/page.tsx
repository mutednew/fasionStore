"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/userSlice";
import { useLogoutMutation } from "@/store/api/authApi";
import { useGetMeQuery, useGetMyOrdersQuery } from "@/store/api/userApi";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { Mail, Shield, LogOut, Package, User as UserIcon, Settings, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import {OrdersList} from "@/components/profile/OrderList";

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { profile: reduxProfile } = useAppSelector((state) => state.user);
    const { data: serverProfile, isLoading: isProfileLoading } = useGetMeQuery();

    const { data: orders, isLoading: isOrdersLoading } = useGetMyOrdersQuery();

    const [logoutServer, { isLoading: isLogoutLoading }] = useLogoutMutation();

    const user = serverProfile || reduxProfile;

    useEffect(() => {
        if (!user && !isProfileLoading) {
            router.push("/");
        }
    }, [user, isProfileLoading, router]);

    const handleLogout = async () => {
        try {
            await logoutServer().unwrap();
            dispatch(logout());
            router.push("/");
        } catch (err) {
            console.warn("Logout failed:", err);
            dispatch(logout());
            router.push("/");
        }
    };

    if (!user) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-neutral-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-neutral-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-neutral-200 rounded"></div>
                </div>
            </main>
        );
    }

    const safeEmail = user.email || "";
    const displayName = user.name || (safeEmail.includes("@") ? safeEmail.split("@")[0] : "User");
    const initials = displayName.slice(0, 2).toUpperCase();

    return (
        <main className="min-h-screen w-full bg-neutral-50 py-10 px-4 md:px-8">
            <div className="max-w-5xl mx-auto space-y-8">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                            <AvatarImage src="" alt={displayName} />
                            <AvatarFallback className="bg-neutral-900 text-white text-xl">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900">{displayName}</h1>
                            <p className="text-neutral-500">{user.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant={user.role === "ADMIN" ? "destructive" : "secondary"} className="text-xs">
                                    {user.role}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        disabled={isLogoutLoading}
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                        <LogOut size={16} />
                        {isLogoutLoading ? "Exiting..." : "Sign Out"}
                    </Button>
                </motion.div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Account Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2 bg-neutral-100 rounded-lg">
                                        <Mail size={16} className="text-neutral-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-neutral-500 text-xs">Email Address</span>
                                        <span className="font-medium">{user.email}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2 bg-neutral-100 rounded-lg">
                                        <Shield size={16} className="text-neutral-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-neutral-500 text-xs">Account ID</span>
                                        <span className="font-medium font-mono text-xs">
                                            {user.id ? user.id.slice(0, 8) : "..."}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2 bg-neutral-100 rounded-lg">
                                        <UserIcon size={16} className="text-neutral-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-neutral-500 text-xs">Member Since</span>
                                        <span className="font-medium">2024</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                                <Settings size={20} />
                                <span className="text-xs">Settings</span>
                            </Button>
                            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                                <CreditCard size={20} />
                                <span className="text-xs">Cards</span>
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2"
                    >
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                                <Package className="text-neutral-500" /> Order History
                            </h2>

                            {isOrdersLoading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-32 w-full rounded-lg" />
                                    <Skeleton className="h-32 w-full rounded-lg" />
                                </div>
                            ) : orders && orders.length > 0 ? (
                                <OrdersList orders={orders} />
                            ) : (
                                <Card className="h-64 flex flex-col items-center justify-center text-center border-dashed">
                                    <div className="bg-neutral-100 p-4 rounded-full mb-4">
                                        <Package size={32} className="text-neutral-400" />
                                    </div>
                                    <h3 className="font-medium text-neutral-900">No orders yet</h3>
                                    <p className="text-sm text-neutral-500 mt-1 mb-6 max-w-xs mx-auto">
                                        Looks like you haven't bought anything yet. Go ahead and explore our collection!
                                    </p>
                                    <Button onClick={() => router.push("/products")}>
                                        Start Shopping
                                    </Button>
                                </Card>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}