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

// Интерфейс данных, которые мы отправляем при чекауте
export interface CheckoutRequest {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    country: string;
    zip: string;
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

        // 👇 ИСПРАВЛЕНИЕ ЗДЕСЬ:
        // Раньше было builder.mutation<any, void>
        // Теперь builder.mutation<any, CheckoutRequest>
        checkout: builder.mutation<any, CheckoutRequest>({
            query: (shippingData) => ({
                url: "/cart/checkout",
                method: "POST",
                body: shippingData,
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