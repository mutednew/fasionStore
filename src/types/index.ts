export interface Product {
    id: string;
    name: string;
    price: number;
    categoryId: string;
    image?: string;
    stock?: number;
}

export interface Category {
    id: string;
    name: string;
}

export interface Order {
    id: string;
    status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELED";
    total: number;
    userId: string;
    createdAt: string;
}