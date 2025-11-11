"use client";

import { FormEvent, useState } from "react";
import { z } from "zod";
import { RegisterSchema } from "@/schemas/auth.schema";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useAppDispatch } from "@/store/hooks";
import { setProfile } from "@/store/slices/userSlice";
import { motion } from "framer-motion";

interface RegisterModalProps {
    onSwitch: () => void;
    onClose: () => void;
}

export default function RegisterModal({ onSwitch, onClose }: RegisterModalProps) {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const form = new FormData(e.currentTarget);
        const data = Object.fromEntries(form.entries());

        try {
            const parsed = RegisterSchema.parse(data);
            const res = await api.post("/auth/register", parsed, { withCredentials: true });
            const { user } = res.data.data;
            dispatch(setProfile(user));
            onClose();
        } catch (err: unknown) {
            if (err instanceof z.ZodError) setError("Invalid form data");
            else if (err && typeof err === "object" && "response" in err) {
                const axiosErr = err as AxiosError<{ message?: string }>;
                setError(axiosErr.response?.data?.message || "Server error");
            } else setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            key="register"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
        >
            <h1 className="text-2xl font-bold mb-3 text-gray-900">Create Account</h1>
            <p className="text-sm text-gray-600 mb-6">Use your email for registration</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    name="name"
                    type="text"
                    placeholder="Name"
                    className="bg-white/60 border border-white/50 shadow-inner text-sm rounded-xl px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]/40"
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="bg-white/60 border border-white/50 shadow-inner text-sm rounded-xl px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]/40"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="bg-white/60 border border-white/50 shadow-inner text-sm rounded-xl px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]/40"
                />

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <button
                    disabled={loading}
                    className="mt-3 rounded-xl bg-[#FF4B2B] text-white text-sm font-bold px-8 py-3 uppercase tracking-wider hover:scale-[1.03] transition"
                >
                    {loading ? "..." : "Sign Up"}
                </button>
            </form>

            <p className="text-xs text-gray-600 mt-5">
                Already have an account?{" "}
                <span
                    onClick={onSwitch}
                    className="text-[#FF4B2B] font-semibold cursor-pointer hover:underline"
                >
          Sign In
        </span>
            </p>
        </motion.div>
    );
}