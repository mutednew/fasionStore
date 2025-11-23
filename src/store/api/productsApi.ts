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
                limit?: number;
                sort?: string;
            }
        >({
            query: (paramsObj) => {
                const params = new URLSearchParams();

                if (paramsObj.search) params.append("search", paramsObj.search);
                if (paramsObj.categoryId) params.append("categoryId", paramsObj.categoryId);
                if (paramsObj.size) params.append("size", paramsObj.size);
                if (paramsObj.tag) params.append("tag", paramsObj.tag);
                if (paramsObj.price) params.append("price", paramsObj.price);

                // New ↓↓↓
                if (paramsObj.limit) params.append("limit", paramsObj.limit.toString());
                if (paramsObj.sort) params.append("sort", paramsObj.sort);

                return `/products?${params.toString()}`;
            },
            transformResponse: (res: any): ProductsResponse => res.data,
        }),

        getLatestProducts: builder.query<ProductsResponse, number>({
            query: (limit = 4) => `/products?limit=${limit}&sort=new`,
            transformResponse: (res: any) => res.data,
        }),

        getProductById: builder.query<ProductResponse, string>({
            query: (id) => `/products/${id}`,
            transformResponse: (res: any): ProductResponse => res,
        }),

        getProductsByCategory: builder.query<ProductsResponse, string>({
            query: (catId) => `/products?categoryId=${catId}`,
            transformResponse: (res: any): ProductsResponse => res.data,
        }),

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
    useGetLatestProductsQuery,
} = productsApi;