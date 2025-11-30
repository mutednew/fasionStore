export interface User {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "CUSTOMER";
}

export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;

    description?: string | null;

    imageUrl?: string;
    images: string[];

    colors: string[];
    sizes: string[];
    tags: string[];

    createdAt: string;
    updatedAt: string;

    categoryId?: string;
    category?: Category;
}

export interface Category {
    id: string;
    name: string;
}

export interface Order {
    id: string;
    userId: string;
    status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELED";
    total: number;
    createdAt: string;
    user?: {
        id: string;
        name: string;
        email?: string;
    };
    items?: {
        id: string;
        quantity: number;
        price: number;
        product: {
            id: string;
            name: string;
            imageUrl?: string;
        };
    }[];
}