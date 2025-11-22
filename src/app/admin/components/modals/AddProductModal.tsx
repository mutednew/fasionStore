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
import {
    useAddProductMutation,
    useGetCategoriesQuery,
} from "@/store/api/adminApi";

import { PlusCircle, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";

export function AddProductModal() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [stock, setStock] = useState("10");

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const [colors, setColors] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);

    const [tempColor, setTempColor] = useState("");
    const [tempSize, setTempSize] = useState("");
    const [tempTag, setTempTag] = useState("");

    const { data: categoriesRes } = useGetCategoriesQuery();
    const categories = categoriesRes?.data.categories ?? [];

    const [addProduct, { isLoading }] = useAddProductMutation();

    // Upload multiple images
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages(files);
        setPreviews(files.map((f) => URL.createObjectURL(f)));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !price.trim()) {
            toast.error("Fill all required fields");
            return;
        }

        try {
            // upload each image
            const uploadedUrls: string[] = [];

            for (const img of images) {
                const formData = new FormData();
                formData.append("file", img);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                });

                if (!uploadRes.ok) {
                    toast.error("Image upload failed");
                    return;
                }

                const uploadData = await uploadRes.json();
                uploadedUrls.push(uploadData?.data?.url || "");
            }

            await addProduct({
                name,
                price: Number(price),
                categoryId: categoryId || categories[0]?.id,
                stock: Number(stock),
                imageUrl: uploadedUrls[0] || "",
                images: uploadedUrls,
                colors,
                sizes,
                tags,
            }).unwrap();

            toast.success("Product added!");

            setOpen(false);
            setImages([]);
            setPreviews([]);
            setColors([]);
            setSizes([]);
            setTags([]);
            setTempColor("");
            setTempSize("");
            setTempTag("");

        } catch {
            toast.error("Failed to add product");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Add Product
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-[95vw] sm:max-w-[550px] md:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Add New Product
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-2 sm:py-4">

                    {/* PRODUCT NAME */}
                    <div>
                        <Label className="block mb-1">Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Product name"
                        />
                    </div>

                    {/* PRICE + STOCK */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label className="block mb-1">Price ($)</Label>
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Enter price"
                            />
                        </div>

                        <div>
                            <Label className="block mb-1">Stock</Label>
                            <Input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                placeholder="Stock quantity"
                            />
                        </div>
                    </div>

                    {/* CATEGORY */}
                    <div>
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
                    <div>
                        <Label className="block mb-1">Images</Label>
                        <Input type="file" multiple accept="image/*" onChange={handleImageChange} />

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                            {previews.map((src) => (
                                <div key={src} className="relative w-full h-24 border rounded-md overflow-hidden">
                                    <Image src={src} alt="" fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COLORS */}
                    <div>
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

                        {/* LIST */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {colors.map((c) => (
                                <span
                                    key={c}
                                    className="px-2 py-1 bg-neutral-200 rounded-md text-sm flex items-center gap-1"
                                >
                                    {c}
                                    <X
                                        className="w-4 h-4 cursor-pointer"
                                        onClick={() =>
                                            setColors((prev) => prev.filter((x) => x !== c))
                                        }
                                    />
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* SIZES */}
                    <div>
                        <Label className="block mb-1">Sizes</Label>

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
                                        setSizes((prev) => [...prev, tempSize]);
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
                                        onClick={() =>
                                            setSizes((prev) => prev.filter((x) => x !== s))
                                        }
                                    />
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* TAGS */}
                    <div>
                        <Label className="block mb-1">Tags</Label>

                        <div className="flex gap-2">
                            <Input
                                placeholder="New, summer, trending..."
                                value={tempTag}
                                onChange={(e) => setTempTag(e.target.value)}
                            />
                            <Button
                                type="button"
                                onClick={() => {
                                    if (tempTag.trim()) {
                                        setTags((prev) => [...prev, tempTag]);
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
                                        onClick={() =>
                                            setTags((prev) => prev.filter((x) => x !== t))
                                        }
                                    />
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* SUBMIT */}
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? "Adding..." : "Add Product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}