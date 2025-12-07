"use client";

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface StripePaymentFormProps {
    totalAmount: number;
    onSuccess: () => void;
    onBack: () => void;
}

export function StripePaymentForm({ totalAmount, onSuccess, onBack }: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handlePaymentSubmit = async () => {
        if (!stripe || !elements) return;

        setIsLoading(true);
        setErrorMessage(null);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            setErrorMessage(error.message ?? "Payment failed");
            toast.error(error.message);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            onSuccess();
        } else {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    Secure Payment
                </h3>
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                    <Lock size={12} /> SSL Encrypted
                </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-white">
                <PaymentElement />
            </div>

            {errorMessage && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                    {errorMessage}
                </div>
            )}

            <div className="flex justify-between pt-4">
                <Button type="button" variant="ghost" onClick={onBack} disabled={isLoading}>
                    <ArrowLeft size={14} className="mr-2" /> Back
                </Button>

                <Button
                    type="button"
                    onClick={handlePaymentSubmit}
                    disabled={!stripe || isLoading}
                    className="px-8 bg-black text-white hover:bg-neutral-800 w-full sm:w-auto min-w-[160px]"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : `Pay $${totalAmount.toFixed(2)}`}
                </Button>
            </div>
        </div>
    );
}