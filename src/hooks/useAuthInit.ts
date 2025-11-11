"use client"

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout, setProfile, setStatus } from "@/store/slices/userSlice";
import api from "@/lib/axios";

export const useAuthInit = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((s) => s.user.profile);

    useEffect(() => {
        if (user) return;

        (async () => {
            dispatch(setStatus("loading"));
            try {
                const res = await api.get("/me");
                dispatch(setProfile(res.data.data.user));
                dispatch(setStatus("idle"));
            } catch {
                dispatch(logout());
                dispatch(setStatus("error"));
            }
        })();
    }, [dispatch, user]);
};