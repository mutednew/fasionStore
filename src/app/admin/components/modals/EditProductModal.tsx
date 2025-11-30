"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { useUpdateProductMutation, useGetAdminCategoriesQuery } from "@/store/api/adminApi";

import { Pencil, X } from "lucide-react";
import { toast } from "sonner";

import type { Product } from "@/types";

interface EditProductModalProps {
    product: Product;
}

export function EditProductModal({ product }: EditProductModalProps) {
    const [open, setOpen] = useState(false);

    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(String(product.price));
    const [stock, setStock] = useState(String(product.stock ?? 0));
    const [categoryId, setCategoryId] = useState(product.categoryId ?? "");
    const [description, setDescription] = useState(product.description ?? "");

    // EXISTING IMAGES
    const [gallery, setGallery] = useState<string[]>(product.images ?? []);
    const [mainImageIndex, setMainImageIndex] = useState(
        Math.max(gallery.indexOf(product.imageUrl ?? ""), 0)
    );

    // NEW FILES
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);

    // ATTRIBUTES
    const [colors, setColors] = useState<string[]>(product.colors ?? []);
    const [sizes, setSizes] = useState<string[]>(product.sizes ?? []);
    const [tags, setTags] = useState<string[]>(product.tags ?? []);

    const [tempColor, setTempColor] = useState("");
    const [tempSize, setTempSize] = useState("");
    const [tempTag, setTempTag] = useState("");

    const { data: categoriesRes } = useGetAdminCategoriesQuery();
    const categories = categoriesRes?.data.categories ?? [];

    const [updateProduct, { isLoading }] = useUpdateProductMutation();

    // ======================================================
    // =============== IMAGE HANDLERS =======================
    // ======================================================

    const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length === 0) return;

        const previews = files.map((f) => URL.createObjectURL(f));

        setNewFiles((prev) => [...prev, ...files]);
        setNewPreviews((prev) => [...prev, ...previews]);
    };

    const removeImage = (src: string) => {
        // remove from existing
        if (gallery.includes(src)) {
            const idx = gallery.indexOf(src);
            setGallery(gallery.filter((x) => x !== src));

            if (idx === mainImageIndex) setMainImageIndex(0);
            if (idx < mainImageIndex) setMainImageIndex((i) => i - 1);
        }

        // remove from new previews
        if (newPreviews.includes(src)) {
            const idx = newPreviews.indexOf(src);
            setNewPreviews(newPreviews.filter((x) => x !== src));
            setNewFiles(newFiles.filter((_, i) => i !== idx));

            if (gallery.length === 0 && idx === mainImageIndex) setMainImageIndex(0);
        }
    };

    // ======================================================
    // ==================== SUBMIT ==========================
    // ======================================================

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            // upload new files
            const uploadedUrls: string[] = [];

            for (const img of newFiles) {
                const formData = new FormData();
                formData.append("file", img);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const json = await uploadRes.json();
                if (uploadRes.ok && json?.data?.url) {
                    uploadedUrls.push(json.data.url);
                }
            }

            // combine existing urls + newly uploaded urls
            const finalImages = [...gallery, ...uploadedUrls];

            // combine previews for sorting by mainImageIndex
            const fullPreviewList = [
                ...gallery,
                ...newPreviews,
            ];

            // determine main by index
            let finalMain: string | null = null;

            const selected = fullPreviewList[mainImageIndex];

            // if selected is an uploaded preview → map it to uploaded url
            if (newPreviews.includes(selected)) {
                const idx = newPreviews.indexOf(selected);
                finalMain = uploadedUrls[idx] ?? null;
            } else {
                finalMain = selected;
            }

            // sort: move main image to index 0
            const orderedImages = [...finalImages];
            if (finalMain) {
                const idx = orderedImages.indexOf(finalMain);
                if (idx > 0) {
                    orderedImages.splice(idx, 1);
                    orderedImages.unshift(finalMain);
                }
            }

            await updateProduct({
                id: product.id,
                name,
                price: Number(price),
                stock: Number(stock),
                categoryId,
                description,

                imageUrl: orderedImages[0],
                images: orderedImages,

                colors,
                sizes,
                tags,
            }).unwrap();

            toast.success("Product updated!");
            setOpen(false);

        } catch (err) {
            toast.error("Failed to update product");
        }
    };

    // ======================================================
    // ====================== UI ============================
    // ======================================================

    const previews = [...gallery, ...newPreviews];

    const mainImage = previews[mainImageIndex];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[95vw] md:max-w-3xl lg:max-w-4xl p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-5 pb-3 border-b">
                    <DialogTitle className="text-lg font-semibold tracking-tight">
                        Edit Product
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

                        <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">

                            {/* LEFT */}
                            <div className="space-y-5">

                                {/* NAME */}
                                <div className="space-y-1.5">
                                    <Label>Name</Label>
                                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                                </div>

                                {/* DESCRIPTION */}
                                <div className="space-y-1.5">
                                    <Label>Description</Label>
                                    <Textarea
                                        className="min-h-[160px] resize-y text-sm leading-relaxed"
                                        placeholder="Product description..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                {/* PRICE + STOCK */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label>Price</Label>
                                        <Input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Stock</Label>
                                        <Input
                                            type="number"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* CATEGORY */}
                                <div className="space-y-1.5">
                                    <Label>Category</Label>
                                    <Select value={categoryId} onValueChange={setCategoryId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                            </div>

                            {/* RIGHT */}
                            <div className="space-y-6">

                                {/* IMAGES */}
                                <div className="space-y-2">
                                    <Label>Images</Label>

                                    <Input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImagesChange}
                                    />

                                    {/* MAIN PREVIEW */}
                                    {mainImage && (
                                        <div className="relative w-full aspect-[4/5] border rounded-md overflow-hidden bg-neutral-100">
                                            <Image
                                                src={mainImage}
                                                alt="Main"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* THUMBNAILS */}
                                    {previews.length > 1 && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {previews.map((src, i) => (
                                                <div
                                                    key={src}
                                                    onClick={() => setMainImageIndex(i)}
                                                    className={`relative border rounded-md overflow-hidden cursor-pointer aspect-square
                                                        ${i === mainImageIndex ? "ring-2 ring-black" : ""}
                                                    `}
                                                >
                                                    <Image src={src} alt="" fill className="object-cover" />

                                                    <button
                                                        type="button"
                                                        className="absolute top-1 right-1 bg-black/60 p-1 rounded"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeImage(src);
                                                        }}
                                                    >
                                                        <X className="w-3 h-3 text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* COLORS */}
                                <div className="space-y-2">
                                    <Label>Colors</Label>

                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="#000000 or Black"
                                            value={tempColor}
                                            onChange={(e) => setTempColor(e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                if (tempColor.trim()) {
                                                    setColors((prev) => [...prev, tempColor.trim()]);
                                                    setTempColor("");
                                                }
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {colors.map((c) => (
                                            <span
                                                key={c}
                                                className="px-2 py-1 bg-neutral-200 rounded-md text-xs flex items-center gap-1"
                                            >
                                                {c}
                                                <X
                                                    className="w-3 h-3 cursor-pointer"
                                                    onClick={() =>
                                                        setColors((prev) => prev.filter((x) => x !== c))
                                                    }
                                                />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* SIZES */}
                                <div className="space-y-2">
                                    <Label>Sizes</Label>

                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="XS, S, M..."
                                            value={tempSize}
                                            onChange={(e) => setTempSize(e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                if (tempSize.trim()) {
                                                    setSizes((prev) => [...prev, tempSize.trim()]);
                                                    setTempSize("");
                                                }
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {sizes.map((s) => (
                                            <span
                                                key={s}
                                                className="px-2 py-1 bg-neutral-200 rounded-md text-xs flex items-center gap-1"
                                            >
                                                {s}
                                                <X
                                                    className="w-3 h-3 cursor-pointer"
                                                    onClick={() =>
                                                        setSizes((prev) => prev.filter((x) => x !== s))
                                                    }
                                                />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* TAGS */}
                                <div className="space-y-2">
                                    <Label>Tags</Label>

                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Summer, trending..."
                                            value={tempTag}
                                            onChange={(e) => setTempTag(e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                if (tempTag.trim()) {
                                                    setTags((prev) => [...prev, tempTag.trim()]);
                                                    setTempTag("");
                                                }
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {tags.map((t) => (
                                            <span
                                                key={t}
                                                className="px-2 py-1 bg-neutral-200 rounded-md text-xs flex items-center gap-1"
                                            >
                                                {t}
                                                <X
                                                    className="w-3 h-3 cursor-pointer"
                                                    onClick={() =>
                                                        setTags((prev) => prev.filter((x) => x !== t))
                                                    }
                                                />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <DialogFooter className="border-t px-6 py-4 bg-white flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}