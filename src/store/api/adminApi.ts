import { mainApi } from "./mainApi"; // Импортируем наш главный API
import type { Product, Order, Category } from "@/types";
import { CreateProductDto } from "@/types/product.dto";

// Типы ответов (DTO)
interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

interface ProductsResponse {
    products: Product[];
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

export const adminApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({

        // ===============================
        // PRODUCTS (Админка)
        // ===============================

        getAdminProducts: builder.query<ApiResponse<ProductsResponse>, void>({
            query: () => "/products",
            // Используем тег, который обновляется при добавлении/удалении товаров
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
            // Инвалидируем список продуктов, чтобы он обновился
            invalidatesTags: ["Products"],
        }),

        updateProduct: builder.mutation<ApiResponse<ProductResponse>, Partial<Product> & { id: string }>({
            query: ({ id, ...data }) => ({
                url: `/products/${id}`,
                method: "PUT",
                body: data,
            }),
            // Инвалидируем конкретный продукт и общий список
            invalidatesTags: (_result, _error, arg) => [{ type: "Product", id: arg.id }, "Products"],
        }),

        deleteProduct: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Products"],
        }),

        // ===============================
        // ORDERS (Админка)
        // ===============================

        getOrders: builder.query<ApiResponse<OrdersResponse>, void>({
            query: () => "/orders",
            providesTags: ["Orders"],
        }),

        getOrderStats: builder.query<
            ApiResponse<{ stats: { total: number; pending: number; delivered: number; canceled: number } }>,
            void
        >({
            query: () => "/orders/stats",
            providesTags: ["Orders"],
        }),

        updateOrderStatus: builder.mutation<ApiResponse<{ order: Order }>, { id: string; status: string }>({
            query: ({ id, status }) => ({
                url: `/orders/${id}`,
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: ["Orders"], // Обновит список заказов и статистику
        }),

        // ===============================
        // CATEGORIES (Админка)
        // ===============================

        getCategories: builder.query<ApiResponse<CategoriesResponse>, void>({
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
    useUpdateOrderStatusMutation,

    useGetCategoriesQuery,
    useAddCategoryMutation,
    useDeleteCategoryMutation,
} = adminApi;