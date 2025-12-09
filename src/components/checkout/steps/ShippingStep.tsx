"use client";

import { ArrowLeft, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutFormValues } from "@/schemas/checkout.schema";

interface ShippingStepProps {
    formData: CheckoutFormValues;
    shippingCost: number;
    onBack: () => void;
    onNext: () => void;
}

export function ShippingStep({ formData, shippingCost, onBack, onNext }: ShippingStepProps) {
    return (
        <div className="space-y-6">
            <div className="bg-white p-4 border rounded-md text-sm text-gray-600 mb-6">
                <div className="flex justify-between border-b pb-2 mb-2">
                    <span>Contact</span>
                    <span className="text-black font-medium">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                    <span>Ship to</span>
                    <span className="text-black font-medium">
                        {formData.address}, {formData.city}
                    </span>
                </div>
            </div>

            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Truck size={16} /> Method
            </h3>

            <div className="p-4 border rounded-md bg-white border-black ring-1 ring-black cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <input type="radio" checked readOnly className="accent-black w-4 h-4" />
                    <span className="text-sm font-medium">Standard Shipping</span>
                </div>
                <span className="font-bold text-sm">
                    {shippingCost === 0 ? "Free" : `$${shippingCost}`}
                </span>
            </div>

            <div className="flex justify-between pt-6">
                <Button type="button" variant="ghost" onClick={onBack}>
                    <ArrowLeft size={14} className="mr-2" /> Back
                </Button>
                <Button type="button" onClick={onNext} className="px-8 bg-black text-white hover:bg-neutral-800">
                    Continue to Payment
                </Button>
            </div>
        </div>
    );
}