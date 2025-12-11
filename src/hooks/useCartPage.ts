import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
    useGetCartQuery,
    useUpdateCartQuantityMutation,
    useRemoveFromCartMutation
} from "@/store/api/cartApi";
import { PromoCode } from "@/types";

export const useCartPage = () => {
    const { data: cartData, isLoading } = useGetCartQuery();
    const items = cartData?.items ?? [];

    const [updateQuantity, { isLoading: isUpdating }] = useUpdateCartQuantityMutation();
    const [removeItem] = useRemoveFromCartMutation();

    const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
    const [showEmptyScreenDelay, setShowEmptyScreenDelay] = useState(false);

    const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
    const [isPromoLoading, setIsPromoLoading] = useState(false);

    const applyPromo = async (code: string) => {
        setIsPromoLoading(true);
        try {
            const res = await fetch("/api/cart/apply-promo", {
                method: "POST",
                body: JSON.stringify({ code }),
            });
            const json = await res.json();

            if (!res.ok || !json.success) throw new Error(json.message || "Invalid code");

            setAppliedPromo(json.data.promo);
            toast.success("Promo applied!");
        } catch (err: any) {
            toast.error(err.message);
            setAppliedPromo(null);
        } finally {
            setIsPromoLoading(false);
        }
    };

    const removePromo = () => {
        setAppliedPromo(null);
        toast.info("Promo removed");
    };

    useEffect(() => {
        if (removingIds.size > 0 && items.length > 0) {
            setRemovingIds(prev => {
                const next = new Set(prev);
                const currentIds = new Set(items.map(i => i.id));
                let changed = false;
                next.forEach(id => {
                    if (!currentIds.has(id)) {
                        next.delete(id);
                        changed = true;
                    }
                });
                return changed ? next : prev;
            });
        }
    }, [items, removingIds.size]);

    const visibleItems = useMemo(() =>
            items.filter(item => !removingIds.has(item.id)),
        [items, removingIds]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (visibleItems.length === 0 && !isLoading) {
            timer = setTimeout(() => setShowEmptyScreenDelay(true), 300);
        } else {
            setShowEmptyScreenDelay(false);
        }
        return () => clearTimeout(timer);
    }, [visibleItems.length, isLoading]);

    const subtotal = useMemo(() => {
        return visibleItems.reduce((acc, item) => {
            const price = item.product.salePrice ? Number(item.product.salePrice) : Number(item.product.price);
            return acc + price * item.quantity;
        }, 0);
    }, [visibleItems]);

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

    const handleQuantityChange = async (itemId: string, currentQty: number, delta: number) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;
        try {
            await updateQuantity({ itemId, quantity: newQty }).unwrap();
        } catch {
            toast.error("Failed to update quantity");
        }
    };

    const handleRemove = async (itemId: string) => {
        setRemovingIds((prev) => {
            const next = new Set(prev);
            next.add(itemId);
            return next;
        });

        try {
            await removeItem(itemId).unwrap();
            toast.success("Item removed");
        } catch {
            setRemovingIds((prev) => {
                const next = new Set(prev);
                next.delete(itemId);
                return next;
            });
            toast.error("Failed to remove item");
        }
    };

    return {
        isLoading,
        visibleItems,
        showEmptyScreenDelay,
        subtotal,
        shipping,
        total,
        discountAmount,

        isUpdating,
        handleQuantityChange,
        handleRemove,

        appliedPromo,
        isPromoLoading,
        applyPromo,
        removePromo
    };
};