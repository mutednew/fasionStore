"use client";

import { Loader2 } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js";
import { StripePaymentForm } from "@/components/checkout/StripePaymentForm";

interface PaymentStepProps {
    clientSecret: string;
    stripePromise: Promise<Stripe | null>;
    totalAmount: number;
    isInitializing: boolean;
    onSuccess: () => Promise<void>;
    onBack: () => void;
}

export function PaymentStep({
    clientSecret,
    stripePromise,
    totalAmount,
    isInitializing,
    onSuccess,
    onBack
}: PaymentStepProps) {
    if (!clientSecret) {
        return (
            <div className="flex justify-center py-20 flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-neutral-300" />
                <p className="text-sm text-neutral-500">
                    {isInitializing ? "Connecting to secure payment..." : "Initializing..."}
                </p>
            </div>
        );
    }

    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret,
                appearance: { theme: "stripe", variables: { colorPrimary: "#000000" } },
            }}
        >
            <StripePaymentForm
                totalAmount={totalAmount}
                onSuccess={onSuccess}
                onBack={onBack}
            />
        </Elements>
    );
}