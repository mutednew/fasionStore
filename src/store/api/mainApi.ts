import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const mainApi = createApi({
    reducerPath: "mainApi",

    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/api",
        credentials: "include",
    }),

    tagTypes: ["Products", "Product", "Categories", "Cart", "Orders", "User"],

    endpoints: () => ({}),
});