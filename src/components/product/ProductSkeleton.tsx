"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
    return (
        <main className="min-h-screen bg-white py-12 px-4 md:px-20 font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 flex gap-6">
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="w-24 h-32 rounded-md" />)}
                    </div>
                    <Skeleton className="flex-1 aspect-[3/4] rounded-lg" />
                </div>
                <div className="lg:col-span-5 flex flex-col gap-8 pt-4">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-8 w-1/4" />
                    </div>
                    <Skeleton className="h-px w-full" />
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-12" />
                            <div className="flex gap-3"><Skeleton className="w-8 h-8 rounded-full" /><Skeleton className="w-8 h-8 rounded-full" /></div>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-12" />
                            <div className="grid grid-cols-5 gap-2">
                                {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 rounded-md" />)}
                            </div>
                        </div>
                    </div>
                    <Skeleton className="h-12 w-full rounded-md mt-4" />
                </div>
            </div>
        </main>
    );
}