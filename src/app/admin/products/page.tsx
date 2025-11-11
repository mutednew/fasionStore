"use client";

import { useState } from "react";
import {
    useGetProductsQuery,
    useAddProductMutation,
    useDeleteProductMutation,
    useUpdateProductMutation,
    useGetCategoriesQuery,
} from "@/store/api/adminApi";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import type { Product } from "@/types";
import {AddProductModal} from "@/app/admin/components/modals/AddProductModal";

export default function AdminProducts() {
    // 🔹 Локальные состояния
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");

    // 🔹 Запросы из RTK Query
    const { data: productsRes, isLoading } = useGetProductsQuery();
    const { data: categoriesRes } = useGetCategoriesQuery();
    const [addProduct] = useAddProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const [updateProduct] = useUpdateProductMutation();

    // 🔹 Извлекаем данные из ответов
    const products = productsRes?.data.products ?? [];
    const categories = categoriesRes?.data.categories ?? [];

    // 🔹 Фильтрация
    const filteredProducts = products.filter((p: Product) => {
        const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory =
            filterCategory === "all" || p.categoryId === filterCategory;
        return matchName && matchCategory;
    });

    // 🔹 Добавление тестового товара (для примера)
    const handleAdd = async () => {
        const name = prompt("Product name:");
        const price = prompt("Price:");
        const categoryId = prompt("Category ID:");
        if (!name || !price) return;

        await addProduct({
            name,
            price: Number(price),
            categoryId: categoryId || categories[0]?.id,
            stock: 10,
        }).unwrap();
    };

    // 🔹 Удаление товара
    const handleDelete = async (id: string) => {
        if (confirm("Delete this product?")) {
            await deleteProduct(id).unwrap();
        }
    };

    // 🔹 Обновление (только пример)
    const handleEdit = async (product: Product) => {
        const newPrice = prompt("New price:", String(product.price));
        if (newPrice) {
            await updateProduct({
                id: product.id,
                data: { price: Number(newPrice) },
            }).unwrap();
        }
    };

    // 🔹 Загрузка
    if (isLoading)
        return <div className="p-8 text-gray-500">Loading products...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Products</h1>
                <AddProductModal />
            </div>

            {/* 🔍 Панель фильтров */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4 items-center">
                    <Input
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-xs"
                    />
                    <Select onValueChange={setFilterCategory} value={filterCategory}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* 📦 Таблица товаров */}
            <Card>
                <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-muted/40 text-left">
                        <tr>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredProducts.map((p) => (
                            <tr key={p.id} className="border-t hover:bg-muted/20">
                                <td className="px-4 py-3 font-medium">{p.name}</td>
                                <td className="px-4 py-3">
                                    {categories.find((c) => c.id === p.categoryId)?.name ?? "—"}
                                </td>
                                <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                                <td className="px-4 py-3">{p.stock ?? 0}</td>
                                <td className="px-4 py-3">
                                    {p.stock && p.stock > 0 ? (
                                        <Badge variant="success">Active</Badge>
                                    ) : (
                                        <Badge variant="destructive">Out of stock</Badge>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(p)}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div className="p-6 text-center text-gray-500">No products found</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
