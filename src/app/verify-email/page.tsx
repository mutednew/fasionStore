import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VerifyEmailPageProps {
    searchParams: {
        success?: string;
        error?: string;
    };
}

export default function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
    const isSuccess = searchParams.success === "true";
    const errorMessage = searchParams.error;

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
            <Card className="max-w-md w-full p-8 text-center shadow-lg border-neutral-200">
                <div className="flex justify-center mb-6">
                    {isSuccess ? (
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                    )}
                </div>

                <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                    {isSuccess ? "Email Verified!" : "Verification Failed"}
                </h1>

                <p className="text-neutral-500 mb-8">
                    {isSuccess
                        ? "You have been successfully logged in. Welcome to LookLab!"
                        : "Invalid or expired token. Please try registering again."
                    }
                </p>

                <div className="space-y-3">
                    <Button asChild className="w-full h-12 text-base bg-black hover:bg-neutral-800">
                        <Link href={isSuccess ? "/profile" : "/"}>
                            {isSuccess ? "Go to Profile" : "Return Home"}
                        </Link>
                    </Button>
                </div>
            </Card>
        </div>
    );
}