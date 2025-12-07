export interface User {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "CUSTOMER";
}

export interface Category {
    id: string;
    name: string;
}

export interface Product {
    id: string;
    name: string;
    price: number | string;
    stock: number;
    description?: string | null;
    imageUrl?: string | null;
    images: string[];
    colors: string[];
    sizes: string[];
    tags: string[];
    createdAt: string;
    categoryId?: string;
    category?: Category;
}

export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    size?: string;
    color?: string;
    product: Product;
}

export interface Order {
    id: string;
    userId: string;
    status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELED";
    total: number | string;
    createdAt: string;

    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    zip?: string;

    items: {
        id: string;
        quantity: number;
        price: number | string;
        size?: string | null;
        color?: string | null;
        product: {
            id: string;
            name: string;
            imageUrl?: string | null;
        };
    }[];
}