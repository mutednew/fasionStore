import { ProductType } from "@/schemas/product.schema";
import api from "@/lib/axios";

export const getAllProducts = async (): Promise<ProductType[]> => {
    const { data } = await api.get("/products");
    return data;
};

export const getProductById = async (id: string): Promise<ProductType> => {
    const { data } = await api.get(`/products/${id}`);
    return data;
};

export const getProductsByCategory = async (categoryId: string): Promise<ProductType[]> => {
    const { data } = await api.get(`/products/${categoryId}`);
    return data;
};