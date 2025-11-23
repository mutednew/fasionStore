"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAddCategoryMutation } from "@/store/api/adminApi";
import { toast } from "sonner";

export function AddCategoryModal() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [addCategory, { isLoading }] = useAddCategoryMutation();

    // автофокус при открытии
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Please enter a category name");
            return;
        }

        try {
            await addCategory({ name }).unwrap();

            toast.success(`Category "${name}" added successfully!`);

            setName("");
            setOpen(false);
        } catch {
            toast.error("Failed to add category");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                    className="rounded-md px-4 py-2 font-medium"
                >
                    + Add Category
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[92vw] sm:max-w-sm rounded-xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Create New Category
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    <div className="space-y-2">
                        <Label className="text-sm">Name</Label>
                        <Input
                            ref={inputRef}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter category name"
                            className="h-10 text-sm"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto"
                        >
                            {isLoading ? "Adding..." : "Add Category"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}