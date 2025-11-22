import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import cartReducer from "./slices/cartSlice";
import { adminApi } from "@/store/api/adminApi";
import {mainApi} from "@/store/api/mainApi";

export const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [mainApi.reducerPath]: mainApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(adminApi.middleware, mainApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;