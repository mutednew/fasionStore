export interface Product {
    id: string;
    name: string;
    price: number;
    categoryId?: string;
    imageUrl?: string;
    stock: number;
    createdAt?: Date;
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