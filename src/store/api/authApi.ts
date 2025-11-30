import { LoginSchema, RegisterSchema } from "@/schemas/auth.schema";
import { z } from "zod";
import {mainApi} from "@/store/api/mainApi";

type LoginRequest = z.infer<typeof LoginSchema>
type RegisterRequest = z.infer<typeof RegisterSchema>

interface AuthResponse {
    data: {
        user: {
            id: string;
            email: string;
            name: string;
            role: "ADMIN" | "CUSTOMER";
        };
        token: string;
    };
    message: string;
}

export const authApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["User"],
        }),

        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["User"],
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["User", "Cart", "Orders"],
        })
    }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = authApi;