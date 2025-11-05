"use client"

import { FormEvent, useState } from "react";
import { RegisterSchema } from "@/schemas/auth.schema";
import api from "@/lib/axios";
import { setProfile } from "@/store/slices/userSlice";
import { z } from "zod";
import Link from "next/link";
import { AxiosError } from "axios";
import { useAppDispatch } from "@/store/hooks";

export default function RegisterPage() {
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

            alert("Register successfully.");
        } catch (err: unknown) {
            if (err instanceof z.ZodError) {
                setError("Invalid form data");
            } else if (err && typeof err === "object" && "response" in err) {
                const axiosErr = err as AxiosError<{ message?: string }>;

                setError(axiosErr.response?.data?.message || "Server error");
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f6f5f7] flex flex-col justify-center items-center font-[Montserrat]">
            <div className="w-[400px] bg-white rounded-xl shadow-2xl px-8 py-10 text-center">
                <h1 className="text-2xl font-bold mb-4">Create Account</h1>
                <p className="text-sm text-gray-500 mb-6">Use your email for registration</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        name="name"
                        type="text"
                        placeholder="Name"
                        className="bg-gray-100 px-4 py-2 text-sm rounded"
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="bg-gray-100 px-4 py-2 text-sm rounded"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="bg-gray-100 px-4 py-2 text-sm rounded"
                    />

                    {error && <p className="text-red-500 text-xs">{error}</p>}

                    <button
                        disabled={loading}
                        className="mt-2 rounded-full bg-[#FF4B2B] text-white text-xs font-bold px-10 py-3 uppercase tracking-widest hover:scale-[1.03] transition"
                    >
                        {loading ? "..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-xs text-gray-500 mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#FF4B2B] font-semibold">
                        Sign In
                    </Link>
                </p>
            </div>
        </main>
    );
}