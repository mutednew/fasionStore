"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditProductModal } from "@/app/admin/components/modals/EditProductModal";
import { Product, Category } from "@/types";

interface ProductsTableProps {
    products: Product[];
    categories: Category[];
    onDelete: (id: string) => void;
}

export function ProductsTable({ products, categories, onDelete }: ProductsTableProps) {
    return (
        <Card>
            <CardContent className="p-0 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-muted/40 text-left">
                    <tr>
                        <th className="px-4 py-3 w-[70px]">Image</th>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Variants</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    <AnimatePresence mode="popLayout">
                        {products.length === 0 ? (
                            <motion.tr
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                    No products found matching your filters.
                                </td>
                            </motion.tr>
                        ) : (
                            products.map((p) => (
                                <motion.tr
                                    key={p.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-t hover:bg-muted/10 transition group"
                                >
                                    <td className="px-4 py-3">
                                        {p.imageUrl ? (
                                            <motion.img
                                                src={p.imageUrl}
                                                alt={p.name}
                                                className="w-12 h-12 object-cover rounded-md border shadow-sm group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-xs text-neutral-400">
                                                —
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 font-medium">
                                        <div className="flex flex-col">
                                            <span>{p.name}</span>
                                            <span className="text-[10px] text-muted-foreground">
                                                    ID: {p.id.slice(0, 8)}
                                                </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3">
                                        <Badge variant="outline" className="font-normal">
                                            {categories.find((c) => c.id === p.categoryId)?.name ?? "Uncategorized"}
                                        </Badge>
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1.5">
                                            {p.colors && p.colors.length > 0 && (
                                                <div className="flex gap-1 flex-wrap">
                                                    {p.colors.map((c) => (
                                                        <div key={c} className="w-3 h-3 rounded-full border ring-1 ring-border" style={{ backgroundColor: c }} title={c} />
                                                    ))}
                                                </div>
                                            )}
                                            {p.sizes && p.sizes.length > 0 && (
                                                <div className="flex gap-1 flex-wrap text-[10px] text-muted-foreground">
                                                    {p.sizes.join(", ")}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 font-semibold">
                                        ${Number(p.price).toFixed(2)}
                                    </td>

                                    <td className="px-4 py-3">
                                        {p.stock > 0 ? (
                                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">In Stock ({p.stock})</Badge>
                                        ) : (
                                            <Badge variant="destructive">Out of Stock</Badge>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <EditProductModal product={p} />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => onDelete(p.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </AnimatePresence>
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}