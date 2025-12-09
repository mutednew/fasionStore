import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
    useGetCartQuery,
    useUpdateCartQuantityMutation,
    useRemoveFromCartMutation
} from "@/store/api/cartApi";

export const useCartPage = () => {
    const { data: cartData, isLoading } = useGetCartQuery();
    const items = cartData?.items ?? [];

    const [updateQuantity, { isLoading: isUpdating }] = useUpdateCartQuantityMutation();
    const [removeItem] = useRemoveFromCartMutation();

    const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
    const [showEmptyScreenDelay, setShowEmptyScreenDelay] = useState(false);

    // Очистка removingIds, если товар реально исчез из данных
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

    // Фильтрация товаров (скрываем те, что в процессе удаления)
    const visibleItems = useMemo(() =>
            items.filter(item => !removingIds.has(item.id)),
        [items, removingIds]);

    // Дебаунс для пустого экрана
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (visibleItems.length === 0 && !isLoading) {
            timer = setTimeout(() => setShowEmptyScreenDelay(true), 300);
        } else {
            setShowEmptyScreenDelay(false);
        }
        return () => clearTimeout(timer);
    }, [visibleItems.length, isLoading]);

    // Калькуляция
    const subtotal = useMemo(() => {
        return visibleItems.reduce((acc, item) => {
            const price = Number(item.product.price);
            return acc + price * item.quantity;
        }, 0);
    }, [visibleItems]);

    const shipping = subtotal > 200 ? 0 : 15;
    const total = subtotal + shipping;

    // Actions
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
        isUpdating,
        handleQuantityChange,
        handleRemove
    };
};