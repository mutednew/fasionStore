"use client"

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/userSlice";
import api from "@/lib/axios";

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { profile } = useAppSelector((state) => state.user);

    useEffect(() => {
        if (!profile) {
            router.push("/login");
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
            <main className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Loading profile...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-[Montserrat]">
            <div className="bg-white shadow-xl rounded-2xl p-10 w-[380px] text-center">
                <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

                <div className="space-y-2 text-sm text-gray-700">
                    <p>
                        <span className="font-semibold">Name:</span> {profile.name}
                    </p>
                    <p>
                        <span className="font-semibold">Email:</span> {profile.email}
                    </p>
                    <p>
                        <span className="font-semibold">Role:</span>{" "}
                        {profile.role || "CUSTOMER"}
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="mt-8 w-full py-2.5 rounded-full bg-[#FF4B2B] text-white text-sm font-bold uppercase tracking-wider hover:scale-[1.03] transition"
                >
                    Logout
                </button>
            </div>
        </main>
    );
}