"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/userSlice";
import { useLogoutMutation } from "@/store/api/authApi";
import { useGetMeQuery, useGetMyOrdersQuery } from "@/store/api/userApi";
import { User } from "@/types";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { AccountDetails } from "@/components/profile/AccountDetails";
import { OrdersList } from "@/components/profile/OrderList";

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { profile: reduxProfile } = useAppSelector((state) => state.user);
    const { data: serverProfile, isLoading: isProfileLoading } = useGetMeQuery();
    const { data: orders, isLoading: isOrdersLoading } = useGetMyOrdersQuery();
    const [logoutServer, { isLoading: isLogoutLoading }] = useLogoutMutation();

    const userData = serverProfile || reduxProfile;

    useEffect(() => {
        if (!userData && !isProfileLoading) {
            router.push("/");
        }
    }, [userData, isProfileLoading, router]);

    const handleLogout = async () => {
        try {
            await logoutServer().unwrap();
        } catch (err) {
            console.warn("Logout server error:", err);
        } finally {
            dispatch(logout());
            router.push("/");
        }
    };

    if (isProfileLoading || (!userData && isProfileLoading)) {
        return <ProfileSkeleton />;
    }

    if (!userData) return null;

    const user: User = {
        ...userData,
        role: userData.role || "CUSTOMER",
    };

    return (
        <main className="min-h-screen w-full bg-neutral-50 py-10 px-4 md:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <ProfileHeader
                    user={user}
                    onLogout={handleLogout}
                    isLogoutLoading={isLogoutLoading}
                />

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AccountDetails user={user} />

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
                                <EmptyOrdersState router={router} />
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

function ProfileSkeleton() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-neutral-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-20 w-20 bg-neutral-200 rounded-full mb-4"></div>
                <div className="h-6 w-48 bg-neutral-200 rounded mb-2"></div>
                <div className="h-4 w-32 bg-neutral-200 rounded"></div>
            </div>
        </main>
    );
}

function EmptyOrdersState({ router }: { router: any }) {
    return (
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
    );
}