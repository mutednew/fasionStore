import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Product, Order, Category } from "@/types";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

interface OrdersResponse {
    orders: Order[];
}

interface ProductsResponse {
    products: Product[];
}

interface CategoriesResponse {
    categories: Category[];
}

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api",
        credentials: "include",
    }),
    tagTypes: ["Product", "Category", "Order"],
    endpoints: (builder) => ({
        getProducts: builder.query<ApiResponse<ProductsResponse>, void>({
            query: () => "/products",
            providesTags: ["Product"],
        }),

        getProductById: builder.query<ApiResponse<{ product: Product }>, string>({
            query: (id) => `/products/${id}`,
            providesTags: ["Product"],
        }),

        addProduct: builder.mutation<ApiResponse<{ product: Product }>, Omit<Product, "id" | "createdAt">>({
            query: (body) => ({
                url: "/products",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Product"],
        }),

        updateProduct: builder.mutation<
            ApiResponse<{ product: Product }>,
            Partial<Product> & { id: string }
        >({
            query: ({ id, ...data }) => ({
                url: `/products/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Product"],
        }),

        deleteProduct: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),

        getOrders: builder.query<ApiResponse<OrdersResponse>, void>({
            query: () => "/orders",
            providesTags: ["Order"],
        }),

        getOrderStats: builder.query<ApiResponse<{ stats: {
                total: number;
                pending: number;
                delivered: number;
                canceled: number;
            } }>, void>({
            query: () => "/orders/stats",
            providesTags: ["Order"],
        }),


        updateOrderStatus: builder.mutation<
            ApiResponse<{ order: Order }>,
            { id: string; status: string }
        >({
            query: ({ id, status }) => ({
                url: `/orders/${id}`,
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: ["Order"],
        }),

        getCategories: builder.query<ApiResponse<CategoriesResponse>, void>({
            query: () => "/categories",
            providesTags: ["Category"],
        }),

        addCategory: builder.mutation<ApiResponse<{ category: Category }>, { name: string }>({
            query: (body) => ({
                url: "/categories",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Category"],
        }),

        deleteCategory: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Category"],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetOrdersQuery,
    useGetOrderStatsQuery,
    useUpdateOrderStatusMutation,
    useGetCategoriesQuery,
    useAddCategoryMutation,
    useDeleteCategoryMutation,
} = adminApi;