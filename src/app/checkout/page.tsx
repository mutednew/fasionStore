"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, Truck, MapPin, Loader2, CreditCard, Lock, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { useGetCartQuery, useCheckoutMutation } from "@/store/api/cartApi";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {StripePaymentForm} from "@/components/checkout/StripePaymentForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const checkoutSchema = z.object({
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is too short"),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    country: z.string().min(2, "Country is required"),
    zip: z.string().min(3, "ZIP code is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("information");

    const { data: cartData, isLoading: loadingCart } = useGetCartQuery();
    const items = cartData?.items ?? [];
    const [checkout] = useCheckoutMutation();

    const [clientSecret, setClientSecret] = useState("");
    const [isInitializingPayment, setIsInitializingPayment] = useState(false);

    const {
        register,
        handleSubmit,
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

    const subtotal = useMemo(() => {
        return items.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
    }, [items]);

    const shipping = subtotal > 200 ? 0 : 15;
    const total = subtotal + shipping;

    const onNextStep = async (nextTab: string) => {
        let valid = false;

        if (activeTab === "information") {
            valid = await trigger(["email", "phone", "firstName", "lastName", "address", "city", "country", "zip"]);
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
            const res = await fetch("/api/payment/intent", { method: "POST" });
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
            }).unwrap();

            toast.success("Order placed successfully!");
            router.push("/profile");
        } catch (error: any) {
            console.error(error);
            toast.error("Order creation failed. Please contact support.");
        }
    };

    if (loadingCart) return <div className="min-h-screen flex items-center justify-center"><Skeleton className="w-full max-w-4xl h-96" /></div>;

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
                                <motion.div
                                    key="info"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-8"
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2"><CheckCircle size={16} /> Contact</h3>
                                        <button type="button" onClick={fillTestInfo} className="text-xs text-blue-600 hover:underline flex items-center gap-1"><Wand2 size={12} /> Auto-fill</button>
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
                                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2"><MapPin size={16} /> Address</h3>
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
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-gray-500 mb-1.5 block">Country</Label>
                                                    <Input placeholder="Ukraine" {...register("country")} className={cn("bg-white", errors.country && "border-red-500")} />
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-gray-500 mb-1.5 block">ZIP</Label>
                                                    <Input placeholder="01001" {...register("zip")} className={cn("bg-white", errors.zip && "border-red-500")} />
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <div className="flex justify-end pt-4">
                                        <Button type="button" onClick={() => onNextStep("shipping")} className="px-8 bg-black text-white hover:bg-neutral-800">Continue to Shipping</Button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "shipping" && (
                                <motion.div
                                    key="ship"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-white p-4 border rounded-md text-sm text-gray-600 mb-6">
                                        <div className="flex justify-between border-b pb-2 mb-2"><span>Contact</span><span className="text-black font-medium">{formData.email}</span></div>
                                        <div className="flex justify-between"><span>Ship to</span><span className="text-black font-medium">{formData.address}, {formData.city}</span></div>
                                    </div>

                                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2"><Truck size={16} /> Method</h3>
                                    <div className="p-4 border rounded-md bg-white border-black ring-1 ring-black cursor-pointer flex items-center justify-between">
                                        <div className="flex items-center gap-3"><input type="radio" checked readOnly className="accent-black w-4 h-4" /><span className="text-sm font-medium">Standard Shipping</span></div>
                                        <span className="font-bold text-sm">{shipping === 0 ? "Free" : `$${shipping}`}</span>
                                    </div>

                                    <div className="flex justify-between pt-6">
                                        <Button type="button" variant="ghost" onClick={() => setActiveTab("information")}><ArrowLeft size={14} className="mr-2" /> Back</Button>
                                        <Button type="button" onClick={() => onNextStep("payment")} className="px-8 bg-black text-white hover:bg-neutral-800">Continue to Payment</Button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "payment" && (
                                <motion.div
                                    key="pay"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    {clientSecret ? (
                                        <Elements stripe={stripePromise} options={{
                                            clientSecret,
                                            appearance: { theme: 'stripe', variables: { colorPrimary: '#000000' } }
                                        }}>
                                            <StripePaymentForm
                                                totalAmount={total}
                                                onSuccess={handlePaymentSuccess}
                                                onBack={() => setActiveTab("shipping")}
                                            />
                                        </Elements>
                                    ) : (
                                        <div className="flex justify-center py-20 flex-col items-center gap-4">
                                            <Loader2 className="w-10 h-10 animate-spin text-neutral-300" />
                                            <p className="text-sm text-neutral-500">
                                                {isInitializingPayment ? "Connecting to secure payment..." : "Initializing..."}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>

                <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-10 hidden lg:block">
                    <Card className="border border-gray-200 bg-white p-6 shadow-sm rounded-lg overflow-hidden">
                        <h2 className="text-xs font-bold mb-6 uppercase tracking-wider text-gray-500">Order Summary ({items.length})</h2>
                        <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative w-16 h-20 border border-gray-100 rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                                        {item.product.imageUrl && <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />}
                                        <span className="absolute top-0 right-0 bg-gray-900 text-white text-[9px] w-4 h-4 flex items-center justify-center">{item.quantity}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{item.product.name}</p>
                                        <p className="text-xs text-neutral-500 mb-1">{item.size} {item.color ? `/ ${item.color}` : ""}</p>
                                        <p className="text-xs font-medium">${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Separator className="my-5" />
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-black">${subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span className="font-medium text-black">{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
                        </div>
                        <Separator className="my-5" />
                        <div className="flex justify-between items-center"><span className="font-bold text-lg">Total</span><span className="font-bold text-xl">${total.toFixed(2)}</span></div>
                    </Card>
                </div>
            </div>
        </main>
    );
}