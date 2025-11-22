"use client";

import { FormEvent, useState } from "react";
import { z } from "zod";
import { RegisterSchema } from "@/schemas/auth.schema";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { useAppDispatch } from "@/store/hooks";
import { setProfile } from "@/store/slices/userSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
            dispatch(setProfile(res.data.data.user));
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
        <div>
            <h1 className="text-xl font-semibold mb-2 text-neutral-900">Create Account</h1>
            <p className="text-sm text-neutral-600 mb-6">
                Use your email to register
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <Label htmlFor="name" className="text-xs">Name</Label>
                    <Input
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="email" className="text-xs">Email</Label>
                    <Input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="password" className="text-xs">Password</Label>
                    <Input
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="mt-1"
                    />
                </div>

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <Button disabled={loading} className="w-full mt-2">
                    {loading ? "Loading..." : "Sign Up"}
                </Button>
            </form>

            <p className="text-xs text-neutral-600 mt-5">
                Already have an account?{" "}
                <span
                    className="text-black font-medium cursor-pointer underline"
                    onClick={onSwitch}
                >
          Sign In
        </span>
            </p>
        </div>
    );
}