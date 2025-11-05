import axios from "axios";
import { store } from "@/store/store";
import { logout } from "@/store/slices/userSlice";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());
        }
        return Promise.reject(error);
    }
);

export default api;
