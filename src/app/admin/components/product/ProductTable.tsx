import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockProducts = [
    {
        id: 1,
        name: "Wireless Earbuds",
        category: "Electronics",
        stock: 320,
        price: 79.99,
        status: "Active",
        image: "/images/earbuds.png",
    },
    {
        id: 2,
        name: "Yoga Mat",
        category: "Fitness",
        stock: 0,
        price: 25.0,
        status: "Out of Stock",
        image: "/images/yogamat.png",
    },
    {
        id: 3,
        name: "Smart Watch",
        category: "Electronics",
        stock: 210,
        price: 199.99,
        status: "Active",
        image: "/images/smartwatch.png",
    },
];

export function ProductTable() {
    return (
        <Card className="shadow-sm">
            <CardContent className="p-0 overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground border-b">
                    <tr>
                        <th className="px-6 py-3 font-medium">Product</th>
                        <th className="px-6 py-3 font-medium">Category</th>
                        <th className="px-6 py-3 font-medium">Stock</th>
                        <th className="px-6 py-3 font-medium">Price</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {mockProducts.map((p) => (
                        <tr key={p.id} className="border-b hover:bg-muted/30 transition">
                            <td className="flex items-center gap-3 px-6 py-4">
                                <Image
                                    src={p.image}
                                    alt={p.name}
                                    width={40}
                                    height={40}
                                    className="rounded-md border"
                                />
                                {p.name}
                            </td>
                            <td className="px-6 py-4">{p.category}</td>
                            <td className="px-6 py-4">{p.stock}</td>
                            <td className="px-6 py-4">${p.price.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                <Badge
                                    variant={p.status === "Active" ? "success" : "destructive"}
                                >
                                    {p.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 flex justify-center gap-2">
                                <button className="p-2 hover:bg-muted rounded">
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button className="p-2 hover:bg-muted rounded">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}