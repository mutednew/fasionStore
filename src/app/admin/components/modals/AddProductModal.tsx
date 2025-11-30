"use client";

import { FormEvent, useState, ChangeEvent } from "react";
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
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
    useAddProductMutation,
    useGetAdminCategoriesQuery,
} from "@/store/api/adminApi";

import { PlusCircle, X } from "lucide-react";
import { toast } from "sonner";

export function AddProductModal() {
    const [open, setOpen] = useState(false);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [stock, setStock] = useState("10");
    const [description, setDescription] = useState("");

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    const [colors, setColors] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);

    const [tempColor, setTempColor] = useState("");
    const [tempSize, setTempSize] = useState("");
    const [tempTag, setTempTag] = useState("");

    const { data: categoriesRes } = useGetAdminCategoriesQuery();
    const categories = categoriesRes?.data.categories ?? [];

    const [addProduct, { isLoading }] = useAddProductMutation();

    // ======================================================
    // =============== IMAGE HANDLERS =======================
    // ======================================================

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        setImages(files);
        setPreviews(files.map((f) => URL.createObjectURL(f)));

        setMainImageIndex(0); // первое фото по умолчанию — главное
    };

    // ======================================================
    // ==================== SUBMIT ==========================
    // ======================================================

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !price.trim()) {
            toast.error("Fill all required fields");
            return;
        }

        try {
            const uploadedUrls: string[] = [];

            for (const img of images) {
                const formData = new FormData();
                formData.append("file", img);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                });

                if (!res.ok) {
                    toast.error("Image upload failed");
                    return;
                }

                const data = await res.json();
                uploadedUrls.push(data?.data?.url || "");
            }

            // === Перенос главного фото в начало массива ===
            const ordered = [...uploadedUrls];
            if (mainImageIndex !== 0) {
                const main = ordered.splice(mainImageIndex, 1)[0];
                ordered.unshift(main);
            }

            await addProduct({
                name,
                price: Number(price),
                stock: Number(stock),
                categoryId: categoryId || categories[0]?.id,
                description: description || null,
                imageUrl: ordered[0], // главное
                images: ordered,
                colors,
                sizes,
                tags,
            }).unwrap();

            toast.success("Product added!");

            // reset
            setOpen(false);
            setImages([]);
            setPreviews([]);
            setColors([]);
            setSizes([]);
            setTags([]);
            setTempColor("");
            setTempSize("");
            setTempTag("");
            setDescription("");
            setName("");
            setPrice("");
            setStock("10");
            setCategoryId("");
            setMainImageIndex(0);

        } catch {
            toast.error("Failed to add product");
        }
    };

    // ======================================================
    // ====================== UI ============================
    // ======================================================

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Add Product
                </Button>
            </DialogTrigger>

            <DialogContent
                className="
                    max-w-[95vw] md:max-w-3xl lg:max-w-4xl
                    p-0 overflow-hidden
                "
            >
                <DialogHeader className="px-6 pt-5 pb-3 border-b">
                    <DialogTitle className="text-lg font-semibold tracking-tight">
                        Add New Product
                    </DialogTitle>
                </DialogHeader>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

                        <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">

                            {/* LEFT */}
                            <div className="space-y-5">

                                {/* NAME */}
                                <div className="space-y-1.5">
                                    <Label className="text-sm">Name</Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Jeans Carhartt WIP Brandon Pant"
                                    />
                                </div>

                                {/* DESCRIPTION */}
                                <div className="space-y-1.5">
                                    <Label className="text-sm">Description</Label>
                                    <Textarea
                                        placeholder="Paste or write a detailed description..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="min-h-[160px] resize-y text-sm leading-relaxed"
                                    />
                                </div>

                                {/* PRICE + STOCK */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-sm">Price ($)</Label>
                                        <Input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="160"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-sm">Stock</Label>
                                        <Input
                                            type="number"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            placeholder="10"
                                        />
                                    </div>
                                </div>

                                {/* CATEGORY */}
                                <div className="space-y-1.5">
                                    <Label className="text-sm">Category</Label>
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
                                    <Label className="text-sm">Images</Label>

                                    <Input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />

                                    {/* MAIN IMAGE */}
                                    {previews.length > 0 && (
                                        <div className="relative w-full aspect-[4/5] border rounded-md overflow-hidden bg-neutral-100">
                                            <Image
                                                src={previews[mainImageIndex]}
                                                alt="Preview"
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
                                                    className={`relative border rounded-md overflow-hidden cursor-pointer aspect-square ${
                                                        i === mainImageIndex ? "ring-2 ring-black" : ""
                                                    }`}
                                                    onClick={() => setMainImageIndex(i)}
                                                >
                                                    <Image
                                                        src={src}
                                                        alt=""
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* COLORS */}
                                <div className="space-y-2">
                                    <Label className="text-sm">Colors</Label>
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
                                                        setColors((prev) =>
                                                            prev.filter((x) => x !== c)
                                                        )
                                                    }
                                                />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* SIZES */}
                                <div className="space-y-2">
                                    <Label className="text-sm">Sizes</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="XS, S, M, L..."
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
                                                        setSizes((prev) =>
                                                            prev.filter((x) => x !== s)
                                                        )
                                                    }
                                                />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* TAGS */}
                                <div className="space-y-2">
                                    <Label className="text-sm">Tags</Label>
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
                                                        setTags((prev) =>
                                                            prev.filter((x) => x !== t)
                                                        )
                                                    }
                                                />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <DialogFooter className="border-t px-6 py-4 bg-white flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Adding..." : "Add Product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}