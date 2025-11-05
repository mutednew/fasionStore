"use client"

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { logout, setProfile } from "@/store/slices/userSlice";
import api from "@/lib/axios";

export const useAuthInit = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/me", { withCredentials: true });
                dispatch(setProfile(res.data.data.user));
            } catch (err) {
                console.warn("Auth check failed:", err);
                dispatch(logout());
            }
        })();
    }, [dispatch]);
};