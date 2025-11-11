import { ReactNode } from "react";
import Sidebar from "./components/Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
            <Sidebar />

            <main className="flex-1 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
