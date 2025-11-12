"use client";

import { useCallback, useState } from "react";
import { Toast, ToastProps } from "./toast";

export function useToast() {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const toast = useCallback((options: Omit<ToastProps, "id">) => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { ...options, id }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, options.duration ?? 3000);
    }, []);

    const Toaster = useCallback(() => {
        return (
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
                {toasts.map((t) => (
                    <Toast key={t.id} {...t} onClose={() => {
                        setToasts((prev) => prev.filter((x) => x.id !== t.id));
                    }} />
                ))}
            </div>
        );
    }, [toasts]);

    return { toast, Toaster };
}