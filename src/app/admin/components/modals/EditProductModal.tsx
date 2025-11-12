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
import {
    useUpdateProductMutation,
    useGetCategoriesQuery,
} from "@/store/api/adminApi";
import { Pencil, ImageIcon } from "lucide-react";
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
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(product.imageUrl || null);

    const { data: categoriesRes } = useGetCategoriesQuery();
    const categories = categoriesRes?.data.categories ?? [];

    const [updateProduct, { isLoading }] = useUpdateProductMutation();

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        let imageUrl = product.imageUrl;

        try {
            if (image && product.imageUrl) {
                await fetch("/api/upload/delete", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageUrl: product.imageUrl }),
                });
            }

            if (image) {
                const formData = new FormData();
                formData.append("file", image);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                const uploadData = await uploadRes.json();
                if (uploadData?.data?.url) {
                    imageUrl = uploadData.data.url;
                }
            }

            await updateProduct({
                id: product.id,
                name,
                price: Number(price),
                stock: Number(stock),
                categoryId: categoryId || categories[0]?.id,
                imageUrl,
            }).unwrap();

            setOpen(false);
        } catch (err) {
            console.error("Edit product failed:", err);
            alert("Failed to update product");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Product name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Price ($)</Label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Product price"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Stock</Label>
                        <Input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="Stock quantity"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select onValueChange={setCategoryId} value={categoryId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Image</Label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="rounded-md mt-2 w-full max-h-64 object-cover border"
                            />
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}