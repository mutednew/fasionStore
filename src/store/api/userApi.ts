import { mainApi } from "@/store/api/mainApi";
import { User } from "@/types";

interface UserResponse {
    success: boolean;
    data: {
        user: User;
    };
}

export const userApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<User, void>({
            query: () => "/me",
            providesTags: ["User"],
            transformResponse: (response: UserResponse) => response.data.user,
        }),
    }),
});

export const { useGetMeQuery } = userApi;