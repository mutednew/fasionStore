import { mainApi } from "@/store/api/mainApi";
import { Product } from "@/types";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    size?: string;
    color?: string;
    product: Product;
}

export interface CartResponse {
    id: string;
    userId: string;
    items: CartItem[];
}

export const cartApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({

        getCart: builder.query<CartResponse, void>({
            query: () => "/cart",
            transformResponse: (res: ApiResponse<CartResponse>) => res.data,
            providesTags: ["Cart"],
        }),

        addToCart: builder.mutation<CartResponse, { productId: string; quantity: number; size?: string; color?: string }>({
            query: (body) => ({
                url: "/cart",
                method: "POST",
                body,
            }),
            transformResponse: (res: ApiResponse<CartResponse>) => res.data,
            invalidatesTags: ["Cart"],
        }),

        removeFromCart: builder.mutation<CartResponse, string>({
            query: (itemId) => ({
                url: `/cart/item/${itemId}`,
                method: "DELETE",
            }),
            transformResponse: (res: ApiResponse<CartResponse>) => res.data,
            invalidatesTags: ["Cart"],
        }),

        updateCartQuantity: builder.mutation<CartResponse, { itemId: string; quantity: number }>({
            query: ({ itemId, quantity }) => ({
                url: `/cart/item/${itemId}`,
                method: "PATCH",
                body: { quantity },
            }),
            transformResponse: (res: ApiResponse<CartResponse>) => res.data,
            invalidatesTags: ["Cart"],
        }),

        checkout: builder.mutation<any, void>({
            query: () => ({
                url: "/cart/checkout",
                method: "POST",
            }),
            invalidatesTags: ["Cart", "Orders"],
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useUpdateCartQuantityMutation,
    useCheckoutMutation,
} = cartApi;