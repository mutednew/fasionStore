import { Product } from "@/types";
import { mainApi } from "@/store/api/mainApi";

interface ProductsResponse {
    products: Product[];
}

interface ProductResponse {
    data: {
        product: Product;
    };
}

export const productsApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<ProductsResponse, void>({
            query: () => `/products`,
        }),

        getProductById: builder.query<ProductResponse, string>({
            query: (id) => `/products/${id}`,
        }),

        getProductsByCategory: builder.query<ProductsResponse, string>({
            query: (catId) => `/products?categoryId=${catId}`,
        }),

        searchProducts: builder.query<ProductsResponse, string>({
            query: (term) => `/products?search=${term}`,
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useGetProductsByCategoryQuery,
    useSearchProductsQuery,
} = productsApi;