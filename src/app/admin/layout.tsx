import { ReactNode } from "react";
import { cookies } from "next/headers";
import Sidebar from "./components/Sidebar";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) redirect("/");

    const user = verifyToken(token);

    if (!user || user.role !== "ADMIN") redirect("/");

    return (
        <div className="flex min-h-screen bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
            <Sidebar />

            <main className="flex-1 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}