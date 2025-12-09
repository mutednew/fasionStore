"use client"

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthInit } from "@/hooks/useAuthInit";

const queryClient = new QueryClient();

function AuthInitializer({ children }: { children: ReactNode }) {
    useAuthInit();

    return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <AuthInitializer>{children}</AuthInitializer>
            </QueryClientProvider>
        </Provider>
    );
}