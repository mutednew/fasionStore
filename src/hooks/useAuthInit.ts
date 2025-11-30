"use client"

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout, setProfile, setStatus } from "@/store/slices/userSlice";
import {useGetMeQuery} from "@/store/api/userApi";

export const useAuthInit = () => {
    const dispatch = useAppDispatch();
    const { data: user, isError, isLoading, isSuccess } = useGetMeQuery();

    useEffect(() => {
        if (isLoading) {
            dispatch(setStatus("loading"));
        } else if (isSuccess && user) {
            dispatch(setProfile(user));
            dispatch(setStatus("idle"));
        } else if (isError) {
            dispatch(logout());
            dispatch(setStatus("error"));
        }
    }, [user, isError, isLoading, isSuccess]);
};