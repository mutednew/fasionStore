import { mainApi } from "./mainApi";
import { Order } from "@/types";

export interface User {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "CUSTOMER";
}

interface UserApiResponse {
    success: boolean;
    data: {
        user: User;
    };
}

interface OrdersApiResponse {
    success: boolean;
    data: {
        orders: Order[];
    };
}

export const userApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<User, void>({
            query: () => "/me",
            providesTags: ["User"],
            transformResponse: (response: UserApiResponse) => response.data.user,
        }),

        getMyOrders: builder.query<Order[], void>({
            query: () => "/orders",
            providesTags: ["Orders"],
            transformResponse: (response: OrdersApiResponse) => response.data.orders,
        }),
    }),
});

export const { useGetMeQuery, useGetMyOrdersQuery } = userApi;