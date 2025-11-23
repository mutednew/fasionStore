import { Product } from "@/types";
import { mainApi } from "@/store/api/mainApi";

interface ProductsResponse {
    products: Product[];
}

interface ProductResponse {
    data: {
        product: Product;
    }
}

export const productsApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET /products
        getProducts: builder.query<ProductsResponse, void>({
            query: () => `/products`,
            transformResponse: (res: any): ProductsResponse => res.data,
        }),

        getProductsFiltered: builder.query<
            ProductsResponse,
            {
                search?: string;
                categoryId?: string;
                size?: string;
                tag?: string;
                price?: string;
            }
        >({
            query: ({ search, categoryId, size, tag, price }) => {
                const params = new URLSearchParams();

                if (search) params.append("search", search);
                if (categoryId) params.append("categoryId", categoryId);
                if (size) params.append("size", size);
                if (tag) params.append("tag", tag);
                if (price) params.append("price", price);

                return `/products?${params.toString()}`;
            },
            transformResponse: (res: any): ProductsResponse => res.data,
        }),

        // GET /products/[id]
        getProductById: builder.query<ProductResponse, string>({
            query: (id) => `/products/${id}`,
            transformResponse: (res: any): ProductResponse => res,
        }),

        // GET /products?categoryId=xxx
        getProductsByCategory: builder.query<ProductsResponse, string>({
            query: (catId) => `/products?categoryId=${catId}`,
            transformResponse: (res: any): ProductsResponse => res.data,
        }),

        // GET /products?search=xxx
        searchProducts: builder.query<ProductsResponse, string>({
            query: (term) => `/products?search=${term}`,
            transformResponse: (res: any): ProductsResponse => res.data,
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useGetProductsByCategoryQuery,
    useSearchProductsQuery,
    useGetProductsFilteredQuery,
} = productsApi;