export interface User {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "CUSTOMER";
    emailVerified?: string | Date | null;

    avatarUrl?: string | null;
    createdAt?: string;
}

export interface Category {
    id: string;
    name: string;
}

export interface Product {
    id: string;
    name: string;
    price: number | string;
    salePrice?: number | string | null;
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
    updatedAt?: string;

    email?: string | null;
    phone?: string | null;

    firstName?: string | null;
    lastName?: string | null;

    address?: string | null;
    city?: string | null;
    country?: string | null;
    zip?: string | null;

    user?: User;

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

export interface PromoCode {
    id: string;
    code: string;
    type: "PERCENT" | "FIXED" | "FREE_SHIPPING";
    value: number;
}