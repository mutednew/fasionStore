"use client";

import { useState, ChangeEvent, FormEvent } from "react";
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
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { useUpdateProductMutation, useGetCategoriesQuery } from "@/store/api/adminApi";

import { Pencil, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";

interface EditProductModalProps {
    product: Product;
}

export function EditProductModal({ product }: EditProductModalProps) {
    const [open, setOpen] = useState(false);

    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(String(product.price));
    const [stock, setStock] = useState(String(product.stock || 0));
    const [categoryId, setCategoryId] = useState(product.categoryId || "");

    const [images, setImages] = useState<File[]>([]);
    const [gallery, setGallery] = useState<string[]>(product.images ?? []);
    const [previewMain, setPreviewMain] = useState(product.imageUrl ?? null);

    const [colors, setColors] = useState<string[]>(product.colors ?? []);
    const [sizes, setSizes] = useState<string[]>(product.sizes ?? []);
    const [tags, setTags] = useState<string[]>(product.tags ?? []);

    const [tempColor, setTempColor] = useState("");
    const [tempSize, setTempSize] = useState("");
    const [tempTag, setTempTag] = useState("");

    const { data: categoriesRes } = useGetCategoriesQuery();
    const categories = categoriesRes?.data.categories ?? [];

    const [updateProduct, { isLoading }] = useUpdateProductMutation();

    // Multiple images
    const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages(files);
        const previews = files.map((f) => URL.createObjectURL(f));
        setGallery((prev) => [...prev, ...previews]);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const uploadedUrls: string[] = [];

            // Upload all new images
            for (const img of images) {
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

            const finalImages = [...(product.images ?? []), ...uploadedUrls];
            const finalMainImage = uploadedUrls.length ? uploadedUrls[0] : product.imageUrl;

            await updateProduct({
                id: product.id,
                name,
                price: Number(price),
                stock: Number(stock),
                categoryId,
                imageUrl: finalMainImage,
                images: finalImages,
                colors,
                sizes,
                tags,
            }).unwrap();

            toast.success("Product updated!");
            setOpen(false);
        } catch {
            toast.error("Failed to update product");
        }
    };

    const removeGalleryImage = (img: string) => {
        setGallery((prev) => prev.filter((x) => x !== img));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[95vw] sm:max-w-[550px] md:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Edit Product
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-2 sm:py-4">

                    {/* NAME */}
                    <div className="space-y-1">
                        <Label className="block mb-1">Name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    {/* PRICE + STOCK */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="block mb-1">Price ($)</Label>
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="block mb-1">Stock</Label>
                            <Input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* CATEGORY */}
                    <div className="space-y-1">
                        <Label className="block mb-1">Category</Label>
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

                    {/* IMAGES */}
                    <div className="space-y-1">
                        <Label className="block mb-1">Add Images</Label>
                        <Input type="file" multiple accept="image/*" onChange={handleImagesChange} />

                        {/* Gallery preview */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                            {gallery.map((img) => (
                                <div
                                    key={img}
                                    className="relative w-full h-24 border rounded-md overflow-hidden"
                                >
                                    <img src={img} className="object-cover w-full h-full" />

                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-black/60 text-white p-[2px] rounded"
                                        onClick={() => removeGalleryImage(img)}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COLORS */}
                    <div className="space-y-1">
                        <Label className="block mb-1">Colors</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="#000000 or Red"
                                value={tempColor}
                                onChange={(e) => setTempColor(e.target.value)}
                            />
                            <Button
                                type="button"
                                onClick={() => {
                                    if (tempColor.trim()) {
                                        setColors((prev) => [...prev, tempColor]);
                                        setTempColor("");
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {colors.map((c) => (
                                <span
                                    key={c}
                                    className="px-2 py-1 bg-neutral-200 rounded-md text-sm flex items-center gap-1"
                                >
                                    {c}
                                    <X
                                        className="w-4 h-4 cursor-pointer"
                                        onClick={() => setColors((x) => x.filter((v) => v !== c))}
                                    />
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* SIZES */}
                    <div className="space-y-1">
                        <Label className="block mb-1">Sizes</Label>
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
                                        setSizes((x) => [...x, tempSize]);
                                        setTempSize("");
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {sizes.map((s) => (
                                <span
                                    key={s}
                                    className="px-2 py-1 bg-neutral-200 rounded-md text-sm flex items-center gap-1"
                                >
                                    {s}
                                    <X
                                        className="w-4 h-4 cursor-pointer"
                                        onClick={() => setSizes((x) => x.filter((v) => v !== s))}
                                    />
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* TAGS */}
                    <div className="space-y-1">
                        <Label className="block mb-1">Tags</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="New, summer..."
                                value={tempTag}
                                onChange={(e) => setTempTag(e.target.value)}
                            />
                            <Button
                                type="button"
                                onClick={() => {
                                    if (tempTag.trim()) {
                                        setTags((x) => [...x, tempTag]);
                                        setTempTag("");
                                    }
                                }}
                            >
                                Add
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((t) => (
                                <span
                                    key={t}
                                    className="px-2 py-1 bg-neutral-200 rounded-md text-sm flex items-center gap-1"
                                >
                                    {t}
                                    <X
                                        className="w-4 h-4 cursor-pointer"
                                        onClick={() => setTags((x) => x.filter((v) => v !== t))}
                                    />
                                </span>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}