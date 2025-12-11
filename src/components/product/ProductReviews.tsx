"use client";

import { User, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductReviews() {
    return (
        <div className="max-w-7xl mx-auto pt-16 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customer Reviews</h2>
                <Button variant="outline">Write a Review</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="col-span-1 bg-gray-50 p-6 rounded-lg h-fit">
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-5xl font-bold text-gray-900">4.8</span>
                        <span className="text-gray-500 mb-2">/ 5</span>
                    </div>
                    <div className="flex text-yellow-400 mb-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} size={20} fill="currentColor" />
                        ))}
                    </div>
                    <p className="text-sm text-gray-500">Based on 42 reviews</p>

                    <div className="mt-6 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                            <div key={stars} className="flex items-center gap-2 text-xs">
                                <span className="w-3">{stars}</span>
                                <Star size={10} className="text-gray-400" />
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-400"
                                        style={{ width: stars === 5 ? "70%" : stars === 4 ? "20%" : "5%" }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-8">
                    <div className="border-b border-gray-100 pb-8">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User size={16} className="text-gray-500" />
                                </div>
                                <span className="font-semibold text-sm">Alex M.</span>
                                <span className="text-xs text-gray-400 px-2 border-l border-gray-300">Verified Buyer</span>
                            </div>
                            <span className="text-xs text-gray-400">2 days ago</span>
                        </div>
                        <div className="flex text-yellow-400 mb-2">
                            {[1, 2, 3, 4, 5].map((i) => (<Star key={i} size={14} fill="currentColor" />))}
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-1">Great quality!</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Absolutely love this product. The material feels premium and the fit is perfect. Highly recommend!
                        </p>
                    </div>

                    <div className="text-center pt-4">
                        <Button variant="outline" disabled>Load More Reviews</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}