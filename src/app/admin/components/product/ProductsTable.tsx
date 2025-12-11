"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Trash2, Percent, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { EditProductModal } from "@/app/admin/components/modals/EditProductModal";
import { Product, Category } from "@/types";

interface ProductsTableProps {
    products: Product[];
    categories: Category[];
    selectedIds: Set<string>;
    onSelectOne: (id: string) => void;
    onSelectAll: (checked: boolean) => void;
    onBulkDiscount: (percent: number) => void;
    onDelete: (id: string) => void;
    isBulkUpdating: boolean;
}

const rowVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: (index: number) => ({
        opacity: 1, y: 0,
        transition: { delay: index * 0.03, duration: 0.25, ease: "easeOut" }
    }),
    exit: { opacity: 0, transition: { duration: 0.1 } }
};

export function ProductsTable({
                                  products, categories, onDelete,
                                  selectedIds, onSelectOne, onSelectAll, onBulkDiscount, isBulkUpdating
                              }: ProductsTableProps) {

    const [discountInput, setDiscountInput] = useState("");

    const isAllSelected = products.length > 0 && products.every(p => selectedIds.has(p.id));

    return (
        <>
            <Card>
                <CardContent className="p-0 overflow-x-auto overflow-y-hidden">
                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-muted/40 text-left">
                        <tr>
                            <th className="px-4 py-3 w-[40px]">
                                <Checkbox
                                    checked={isAllSelected}
                                    onCheckedChange={(checked) => onSelectAll(!!checked)}
                                />
                            </th>
                            <th className="px-4 py-3 w-[70px]">Image</th>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Variants</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                        </thead>

                        <tbody className="relative">
                        <AnimatePresence initial={false}>
                            {products.length === 0 ? (
                                <motion.tr key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                                        No products found.
                                    </td>
                                </motion.tr>
                            ) : (
                                products.map((p, index) => (
                                    <motion.tr
                                        key={p.id}
                                        variants={rowVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        custom={index}
                                        className={`border-t transition group ${selectedIds.has(p.id) ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-muted/10"}`}
                                    >
                                        <td className="px-4 py-3">
                                            <Checkbox
                                                checked={selectedIds.has(p.id)}
                                                onCheckedChange={() => onSelectOne(p.id)}
                                            />
                                        </td>

                                        <td className="px-4 py-3">
                                            {p.imageUrl ? (
                                                <div className="relative w-12 h-12 rounded-md border shadow-sm overflow-hidden bg-white">
                                                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-xs text-neutral-400">—</div>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 font-medium">
                                            <div className="flex flex-col">
                                                <span>{p.name}</span>
                                                <span className="text-[10px] text-muted-foreground">ID: {p.id.slice(0, 8)}</span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className="font-normal">
                                                {categories.find((c) => c.id === p.categoryId)?.name ?? "Uncategorized"}
                                            </Badge>
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex flex-col gap-1.5">
                                                {p.colors?.length > 0 && <div className="flex gap-1 flex-wrap">{p.colors.map(c => <div key={c} className="w-3 h-3 rounded-full border ring-1 ring-border" style={{ backgroundColor: c }} />)}</div>}
                                                {p.sizes?.length > 0 && <div className="text-[10px] text-muted-foreground">{p.sizes.join(", ")}</div>}
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            {p.salePrice ? (
                                                <div className="flex flex-col items-start">
                                                    <span className="font-bold text-red-600">${Number(p.salePrice).toFixed(2)}</span>
                                                    <span className="text-xs text-muted-foreground line-through">${Number(p.price).toFixed(2)}</span>
                                                </div>
                                            ) : (
                                                <span className="font-semibold">${Number(p.price).toFixed(2)}</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            {p.stock > 0 ? (
                                                <Badge variant="default" className="bg-green-600 hover:bg-green-700">In Stock ({p.stock})</Badge>
                                            ) : (
                                                <Badge variant="destructive">Out</Badge>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <EditProductModal product={p} />
                                                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => onDelete(p.id)}>
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

            <AnimatePresence>
                {selectedIds.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 shadow-2xl rounded-xl p-4 flex items-center gap-6 min-w-[400px]"
                    >
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <div className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                {selectedIds.size}
                            </div>
                            <span>Selected</span>
                        </div>

                        <div className="h-8 w-px bg-gray-200" />

                        <div className="flex items-center gap-3 flex-1">
                            <div className="relative flex-1">
                                <Input
                                    placeholder="Discount %"
                                    type="number"
                                    min={0}
                                    max={100}
                                    className="pr-8"
                                    value={discountInput}
                                    onChange={(e) => setDiscountInput(e.target.value)}
                                />
                                <Percent className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                            </div>

                            <Button
                                size="sm"
                                className="bg-black hover:bg-neutral-800 gap-2"
                                disabled={!discountInput || isBulkUpdating}
                                onClick={() => {
                                    onBulkDiscount(Number(discountInput));
                                    setDiscountInput("");
                                }}
                            >
                                {isBulkUpdating ? "Applying..." : "Apply Sale"}
                            </Button>

                            <Button
                                size="sm"
                                variant="outline"
                                disabled={isBulkUpdating}
                                onClick={() => onBulkDiscount(0)}
                            >
                                Remove Sale
                            </Button>
                        </div>

                        <button
                            onClick={() => onSelectAll(false)}
                            className="absolute -top-2 -right-2 bg-gray-100 hover:bg-gray-200 rounded-full p-1 border shadow-sm"
                        >
                            <Trash2 size={12} className="text-gray-500" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}