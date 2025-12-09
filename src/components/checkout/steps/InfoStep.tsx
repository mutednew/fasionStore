"use client";

import { CheckCircle, MapPin, Wand2 } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckoutFormValues } from "@/schemas/checkout.schema"; // Создадим схему отдельно ниже

interface InfoStepProps {
    register: UseFormRegister<CheckoutFormValues>;
    errors: FieldErrors<CheckoutFormValues>;
    onNext: () => void;
    onAutoFill: () => void;
}

export function InfoStep({ register, errors, onNext, onAutoFill }: InfoStepProps) {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle size={16} /> Contact
                </h3>
                <button
                    type="button"
                    onClick={onAutoFill}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                    <Wand2 size={12} /> Auto-fill
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label className="text-xs text-gray-500 mb-1.5 block">Email</Label>
                    <Input placeholder="you@example.com" {...register("email")} className={cn("bg-white", errors.email && "border-red-500")} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <Label className="text-xs text-gray-500 mb-1.5 block">Phone</Label>
                    <Input placeholder="+380..." {...register("phone")} className={cn("bg-white", errors.phone && "border-red-500")} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
            </div>

            <section>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MapPin size={16} /> Address
                </h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs text-gray-500 mb-1.5 block">First Name</Label>
                            <Input placeholder="John" {...register("firstName")} className={cn("bg-white", errors.firstName && "border-red-500")} />
                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                        </div>
                        <div>
                            <Label className="text-xs text-gray-500 mb-1.5 block">Last Name</Label>
                            <Input placeholder="Doe" {...register("lastName")} className={cn("bg-white", errors.lastName && "border-red-500")} />
                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Label className="text-xs text-gray-500 mb-1.5 block">Address</Label>
                        <Input placeholder="123 Main St" {...register("address")} className={cn("bg-white", errors.address && "border-red-500")} />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label className="text-xs text-gray-500 mb-1.5 block">City</Label>
                            <Input placeholder="Kyiv" {...register("city")} className={cn("bg-white", errors.city && "border-red-500")} />
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                        </div>
                        <div>
                            <Label className="text-xs text-gray-500 mb-1.5 block">Country</Label>
                            <Input placeholder="Ukraine" {...register("country")} className={cn("bg-white", errors.country && "border-red-500")} />
                            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                        </div>
                        <div>
                            <Label className="text-xs text-gray-500 mb-1.5 block">ZIP</Label>
                            <Input placeholder="01001" {...register("zip")} className={cn("bg-white", errors.zip && "border-red-500")} />
                            {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip.message}</p>}
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex justify-end pt-4">
                <Button type="button" onClick={onNext} className="px-8 bg-black text-white hover:bg-neutral-800">
                    Continue to Shipping
                </Button>
            </div>
        </div>
    );
}