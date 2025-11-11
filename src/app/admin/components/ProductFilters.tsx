"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProductFilters() {
    return (
        <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2">
                <Input placeholder="Search products..." className="w-60" />

                <Select>
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder="Stock Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="in">In Stock</SelectItem>
                        <SelectItem value="out">Out of Stock</SelectItem>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">$0–50</SelectItem>
                        <SelectItem value="mid">$50–200</SelectItem>
                        <SelectItem value="high">$200+</SelectItem>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="home">Home & Kitchen</SelectItem>
                        <SelectItem value="apparel">Apparel</SelectItem>
                    </SelectContent>
                </Select>

                <Select>
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="stock">Stock</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                + Add Product
            </Button>
        </div>
    );
}