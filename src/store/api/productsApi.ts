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
        // GET /products
        getProducts: builder.query<ProductsResponse, void>({
            query: () => `/products`,
        }),

        // GET /products/[id]
        getProductById: builder.query<ProductResponse, string>({
            query: (id) => `/products/${id}`,
        }),

        // GET /products?categoryId=xxx
        getProductsByCategory: builder.query<ProductsResponse, string>({
            query: (catId) => `/products?categoryId=${catId}`,
        }),

        // GET /products?search=xxx
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
