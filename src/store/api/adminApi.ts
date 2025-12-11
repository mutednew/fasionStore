import { mainApi } from "./mainApi";
import type { Product, Order, Category } from "@/types";
import { CreateProductDto } from "@/types/product.dto";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

interface ProductsResponse {
    products: Product[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface ProductResponse {
    product: Product;
}

interface CategoriesResponse {
    categories: Category[];
}

interface OrdersResponse {
    orders: Order[];
}

interface StatsResponse {
    stats: {
        total: number;
        pending: number;
        paid: number;
        shipped: number;
        delivered: number;
        canceled: number;
        revenue: number;
    };
}

interface AnalyticsResponse {
    sales: { name: string; value: number }[];
    percentageChange: number;
    total: number;
}

export const adminApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({

        getAdminProducts: builder.query<ApiResponse<ProductsResponse>, Record<string, any> | void>({
            query: (params) => ({
                url: "/products",
                method: "GET",
                params: params || {},
            }),
            providesTags: ["Products"],
        }),

        getAdminProductById: builder.query<ApiResponse<ProductResponse>, string>({
            query: (id) => `/products/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Product", id }],
        }),

        addProduct: builder.mutation<ApiResponse<ProductResponse>, CreateProductDto>({
            query: (body) => ({
                url: "/products",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Products"],
        }),

        updateProduct: builder.mutation<ApiResponse<ProductResponse>, Partial<Product> & { id: string }>({
            query: ({ id, ...data }) => ({
                url: `/products/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "Product", id: arg.id }, "Products"],
        }),

        applyBulkDiscount: builder.mutation<any, { ids: string[]; discountPercent: number }>({
            query: (body) => ({
                url: "/products/bulk",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Products"],
        }),

        deleteProduct: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Products"],
        }),

        getOrders: builder.query<ApiResponse<OrdersResponse>, void>({
            query: () => "/orders",
            providesTags: ["Orders"],
        }),

        getOrderStats: builder.query<ApiResponse<StatsResponse>, void>({
            query: () => "/orders/stats",
            providesTags: ["Orders"],
        }),

        getSalesAnalytics: builder.query<ApiResponse<AnalyticsResponse>, string>({
            query: (range) => `/orders/analytics?range=${range}`,
            providesTags: ["Orders"],
        }),

        updateOrderStatus: builder.mutation<ApiResponse<{ order: Order }>, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `/orders/${id}`,
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: ["Orders"],
        }),

        getAdminCategories: builder.query<ApiResponse<CategoriesResponse>, void>({
            query: () => "/categories",
            providesTags: ["Categories"],
        }),

        addCategory: builder.mutation<ApiResponse<{ category: Category }>, { name: string }>({
            query: (body) => ({
                url: "/categories",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Categories"],
        }),

        deleteCategory: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Categories"],
        }),
    }),
});

export const {
    useGetAdminProductsQuery,
    useGetAdminProductByIdQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,

    useGetOrdersQuery,
    useGetOrderStatsQuery,
    useGetSalesAnalyticsQuery,
    useUpdateOrderStatusMutation,

    useGetAdminCategoriesQuery,
    useAddCategoryMutation,
    useDeleteCategoryMutation,
    useApplyBulkDiscountMutation,
} = adminApi;