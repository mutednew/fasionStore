"use client";

import * as React from "react";
import { useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const toastVariants = cva(
    "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all",
    {
        variants: {
            variant: {
                default:
                    "border bg-background text-foreground",
                destructive:
                    "destructive group border-destructive/50 bg-destructive text-destructive-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface ToastProps extends VariantProps<typeof toastVariants> {
    id: string;
    title?: string;
    description?: string;
    duration?: number;
    onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
    id,
    title,
    description,
    variant,
    duration = 3000,
    onClose,
}) => {
    useEffect(() => {
        const timer = setTimeout(() => onClose?.(), duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            key={id}
            className={cn(
                toastVariants({ variant }),
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80"
            )}
        >
            <div className="flex flex-col space-y-1">
                {title && <p className="font-medium">{title}</p>}
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>
            <button
                onClick={onClose}
                className="absolute right-2 top-2 rounded-md p-1 hover:bg-muted"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};