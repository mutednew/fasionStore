import { Category, Product } from "@/types";
import { mainApi } from "@/store/api/mainApi";

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

interface ProductsPayload {
    products: Product[];
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface CategoryPayload {
    category: Category;
}

interface CategoriesPayload {
    categories: Category[];
}

interface ProductResponse {
    data: {
        product: Product;
    }
}

export const productsApi = mainApi.injectEndpoints({
    endpoints: (builder) => ({

        getProducts: builder.query<ProductsPayload, void>({
            query: () => `/products`,
            transformResponse: (res: ApiResponse<ProductsPayload>) => res.data,
            providesTags: ["Products"],
        }),

        getProductsFiltered: builder.query<
            ProductsPayload,
            {
                search?: string;
                categoryId?: string;
                size?: string;
                tag?: string;
                price?: string;
                limit?: number;
                sort?: string;
                page?: number;
            }
        >({
            query: (paramsObj) => {
                const params = new URLSearchParams();

                if (paramsObj.search) params.append("search", paramsObj.search);
                if (paramsObj.categoryId) params.append("categoryId", paramsObj.categoryId);
                if (paramsObj.size) params.append("size", paramsObj.size);
                if (paramsObj.tag) params.append("tag", paramsObj.tag);
                if (paramsObj.price) params.append("price", paramsObj.price);

                if (paramsObj.limit) params.append("limit", paramsObj.limit.toString());
                if (paramsObj.sort) params.append("sort", paramsObj.sort);
                if (paramsObj.page) params.append("page", paramsObj.page.toString());

                return `/products?${params.toString()}`;
            },
            transformResponse: (res: ApiResponse<ProductsPayload>) => res.data,
            providesTags: ["Products"],
        }),

        getLatestProducts: builder.query<ProductsPayload, number>({
            query: (limit = 4) => `/products?limit=${limit}&sort=new`,
            transformResponse: (res: ApiResponse<ProductsPayload>) => res.data,
            providesTags: ["Products"],
        }),

        getProductById: builder.query<ProductResponse, string>({
            query: (id) => `/products/${id}`,
            transformResponse: (res: ProductResponse) => res,
            providesTags: (_result, _error, id) => [{ type: "Product", id }],
        }),

        getCategoryById: builder.query<CategoryPayload, string>({
            query: (id) => `/categories/${id}`,
            transformResponse: (res: ApiResponse<CategoryPayload>) => res.data,
            providesTags: (_result, _error, id) => [{ type: "Categories", id }],
        }),

        getCategories: builder.query<CategoriesPayload, void>({
            query: () => "/categories",
            transformResponse: (res: ApiResponse<CategoriesPayload>) => res.data,
            providesTags: ["Categories"],
        }),

        getProductsByCategory: builder.query<ProductsPayload, string>({
            query: (catId) => `/products?categoryId=${catId}`,
            transformResponse: (res: ApiResponse<ProductsPayload>) => res.data,
            providesTags: ["Products"],
        }),

        searchProducts: builder.query<ProductsPayload, string>({
            query: (term) => `/products?search=${term}`,
            transformResponse: (res: ApiResponse<ProductsPayload>) => res.data,
            providesTags: ["Products"],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductsFilteredQuery,
    useGetLatestProductsQuery,
    useGetProductByIdQuery,
    useGetCategoryByIdQuery,
    useGetCategoriesQuery,
    useGetProductsByCategoryQuery,
    useSearchProductsQuery,
} = productsApi;