"use client";

import { FormEvent, useState, ChangeEvent } from "react";
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
import { PlusCircle, ImageIcon } from "lucide-react";
import { toast } from "sonner";

export function AddProductModal() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [stock, setStock] = useState("10");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { data: categoriesRes } = useGetCategoriesQuery();
    const categories = categoriesRes?.data.categories ?? [];

    const [addProduct, { isLoading }] = useAddProductMutation();

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !price.trim()) {
            toast.error("Fill all fields");
            return;
        }

        try {
            let imageUrl = "";

            // 🖼 Upload image
            if (image) {
                const formData = new FormData();
                formData.append("file", image);

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
                imageUrl = uploadData?.data?.url || "";
            }

            // 📦 Create product
            await addProduct({
                name,
                price: Number(price),
                categoryId: categoryId || categories[0]?.id,
                stock: Number(stock),
                imageUrl,
            }).unwrap();

            toast.success(`Product "${name}" added!`);

            // 🔄 Reset
            setName("");
            setPrice("");
            setStock("10");
            setCategoryId("");
            setImage(null);
            setPreview(null);
            setOpen(false);
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

            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            placeholder="Enter product name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <Label>Price ($)</Label>
                        <Input
                            type="number"
                            placeholder="Enter price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    {/* Stock */}
                    <div className="space-y-2">
                        <Label>Stock</Label>
                        <Input
                            type="number"
                            placeholder="Enter stock"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                        />
                    </div>

                    {/* Category */}
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

                    {/* Image */}
                    <div className="space-y-2">
                        <Label>Image</Label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="cursor-pointer"
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
                            {isLoading ? "Adding..." : "Add Product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}