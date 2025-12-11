"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Ticket } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStripe } from "@stripe/stripe-js";

import { useGetCartQuery, useCheckoutMutation } from "@/store/api/cartApi";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { InfoStep } from "@/components/checkout/steps/InfoStep";
import { ShippingStep } from "@/components/checkout/steps/ShippingStep";
import { PaymentStep } from "@/components/checkout/steps/PaymentStep";
import { checkoutSchema, CheckoutFormValues } from "@/schemas/checkout.schema";
import { PromoCode } from "@/types";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const promoCode = searchParams.get("promo");

    const [activeTab, setActiveTab] = useState("information");
    const [clientSecret, setClientSecret] = useState("");
    const [isInitializingPayment, setIsInitializingPayment] = useState(false);

    const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

    const { data: cartData, isLoading: loadingCart } = useGetCartQuery();
    const items = cartData?.items ?? [];
    const [checkout] = useCheckoutMutation();

    const {
        register,
        trigger,
        watch,
        getValues,
        setValue,
        formState: { errors }
    } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: { country: "Ukraine" }
    });

    const formData = watch();

    useEffect(() => {
        if (promoCode) {
            fetch("/api/cart/apply-promo", {
                method: "POST",
                body: JSON.stringify({ code: promoCode }),
                headers: { "Content-Type": "application/json" }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setAppliedPromo(data.data.promo);
                    }
                })
                .catch(err => console.error("Promo validation error:", err));
        }
    }, [promoCode]);

    const subtotal = useMemo(() => {
        return items.reduce((acc, item) => {
            const price = item.product.salePrice
                ? Number(item.product.salePrice)
                : Number(item.product.price);
            return acc + price * item.quantity;
        }, 0);
    }, [items]);

    let discountAmount = 0;
    let shipping = subtotal > 200 ? 0 : 15;

    if (appliedPromo) {
        if (appliedPromo.type === "FREE_SHIPPING") {
            shipping = 0;
        } else if (appliedPromo.type === "PERCENT") {
            discountAmount = subtotal * (appliedPromo.value / 100);
        } else if (appliedPromo.type === "FIXED") {
            discountAmount = appliedPromo.value;
        }
    }

    const total = Math.max(0, subtotal - discountAmount + shipping);

    const onNextStep = async (nextTab: string) => {
        let valid = false;

        if (activeTab === "information") {
            valid = await trigger();
        } else if (activeTab === "shipping") {
            valid = true;
            if (nextTab === "payment" && !clientSecret) {
                createPaymentIntent();
            }
        }

        if (valid) setActiveTab(nextTab);
    };

    const fillTestInfo = () => {
        setValue("email", "test@example.com");
        setValue("phone", "+1234567890");
        setValue("firstName", "John");
        setValue("lastName", "Doe");
        setValue("address", "123 Test St");
        setValue("city", "Kyiv");
        setValue("country", "Ukraine");
        setValue("zip", "10001");
    };

    const createPaymentIntent = async () => {
        setIsInitializingPayment(true);
        try {
            const res = await fetch("/api/payment/intent", {
                method: "POST",
                body: JSON.stringify({ promoCode }),
                headers: { "Content-Type": "application/json" }
            });

            const json = await res.json();

            if (json?.data?.clientSecret) {
                setClientSecret(json.data.clientSecret);
            } else {
                toast.error("Failed to initialize payment gateway");
            }
        } catch (error) {
            console.error(error);
            toast.error("Payment initialization error");
        } finally {
            setIsInitializingPayment(false);
        }
    };

    const handlePaymentSuccess = async () => {
        try {
            const data = getValues();

            await checkout({
                email: data.email,
                phone: data.phone,
                firstName: data.firstName,
                lastName: data.lastName,
                address: `${data.address}, ${data.firstName} ${data.lastName}`,
                city: data.city,
                country: data.country,
                zip: data.zip,

                promoCode: promoCode || undefined,
            }).unwrap();

            toast.success("Order placed successfully!");
            router.push("/profile");
        } catch (error: any) {
            console.error(error);
            toast.error("Order creation failed. Please contact support.");
        }
    };

    if (loadingCart) {
        return <div className="min-h-screen flex items-center justify-center"><Skeleton className="w-full max-w-4xl h-96" /></div>;
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9] text-center px-4">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Button asChild><Link href="/products">Continue Shopping</Link></Button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f9f9f9] text-neutral-900 px-6 md:px-10 lg:px-20 py-12 font-sans">
            <div className="max-w-6xl mx-auto mb-8">
                <Link href="/cart" className="inline-flex items-center text-sm text-neutral-500 hover:text-black transition mb-6">
                    <ArrowLeft size={16} className="mr-2" /> Back to Cart
                </Link>
                <h1 className="text-3xl font-extrabold tracking-tight uppercase">Checkout</h1>
            </div>

            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-start">

                <div className="flex-1 w-full">
                    <Tabs value={activeTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 mb-8 border-b border-gray-200">
                            <TabsTrigger value="information" disabled className="uppercase text-xs font-bold pb-3 data-[state=active]:border-b-2 border-black rounded-none">1. Info</TabsTrigger>
                            <TabsTrigger value="shipping" disabled className="uppercase text-xs font-bold pb-3 data-[state=active]:border-b-2 border-black rounded-none">2. Shipping</TabsTrigger>
                            <TabsTrigger value="payment" disabled className="uppercase text-xs font-bold pb-3 data-[state=active]:border-b-2 border-black rounded-none">3. Payment</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <form className="min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {activeTab === "information" && (
                                <motion.div key="info" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                    <InfoStep register={register} errors={errors} onNext={() => onNextStep("shipping")} onAutoFill={fillTestInfo} />
                                </motion.div>
                            )}
                            {activeTab === "shipping" && (
                                <motion.div key="ship" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                    <ShippingStep formData={formData} shippingCost={shipping} onBack={() => setActiveTab("information")} onNext={() => onNextStep("payment")} />
                                </motion.div>
                            )}
                            {activeTab === "payment" && (
                                <motion.div key="pay" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                                    <PaymentStep clientSecret={clientSecret} stripePromise={stripePromise} totalAmount={total} isInitializing={isInitializingPayment} onSuccess={handlePaymentSuccess} onBack={() => setActiveTab("shipping")} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-10 hidden lg:block">
                    <CheckoutOrderSummary
                        items={items}
                        subtotal={subtotal}
                        shipping={shipping}
                        total={total}
                        discountAmount={discountAmount}
                        appliedPromo={appliedPromo}
                    />

                    {promoCode && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
                        >
                            <Ticket size={20} className="text-green-600 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-green-700">Promo Applied!</p>
                                <p className="text-xs text-green-600 mt-1">
                                    Code <b>{promoCode}</b> will be applied to your final order.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>

            </div>
        </main>
    );
}