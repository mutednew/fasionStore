"use client";

import { FormEvent, useState } from "react";
import { z } from "zod";
import { Mail } from "lucide-react";
import { RegisterSchema } from "@/schemas/auth.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "@/store/api/authApi";

interface RegisterModalProps {
    onSwitch: () => void;
    onClose: () => void;
}

export default function RegisterModal({ onSwitch, onClose }: RegisterModalProps) {
    const [registerFn, { isLoading }] = useRegisterMutation();

    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const form = new FormData(e.currentTarget);
        const data = Object.fromEntries(form.entries());

        try {
            const parsed = RegisterSchema.parse(data);
            setEmail(parsed.email);

            await registerFn(parsed).unwrap();

            setIsSuccess(true);

        } catch (err: any) {
            if (err instanceof z.ZodError) {
                setError("Invalid form data");
            } else if (err?.data?.message) {
                setError(err.data.message);
            } else {
                setError("Something went wrong");
            }
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <Mail size={28} />
                </div>
                <h1 className="text-xl font-bold text-neutral-900 mb-2">Verify your email</h1>
                <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
                    We've sent a confirmation link to<br/>
                    <span className="font-medium text-neutral-900">{email}</span>.
                    <br/>Please check your inbox to activate your account.
                </p>
                <Button onClick={onClose} className="w-full bg-black hover:bg-neutral-800">
                    Got it
                </Button>
                <p className="text-xs text-neutral-400 mt-4">
                    Did not receive the email? Check your spam folder.
                </p>
            </div>
        );
    }

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
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="email" className="text-xs">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="password" className="text-xs">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="mt-1"
                    />
                </div>

                {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

                <Button disabled={isLoading} className="w-full mt-2" isLoading={isLoading}>
                    {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
            </form>

            <p className="text-xs text-neutral-600 mt-5 text-center">
                Already have an account?{" "}
                <span
                    className="text-black font-medium cursor-pointer underline hover:text-neutral-700"
                    onClick={onSwitch}
                >
                    Sign In
                </span>
            </p>
        </div>
    );
}