"use client";

import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, Loader2, Minus } from "lucide-react";
import { useGetSalesAnalyticsQuery } from "@/store/api/adminApi";
import { cn } from "@/lib/utils";

export function DashboardChart() {
    const [period, setPeriod] = useState("month");

    const { data, isLoading } = useGetSalesAnalyticsQuery(period);

    const chartData = data?.data?.sales ?? [];
    const percentageChange = data?.data?.percentageChange ?? 0;
    const totalRevenue = data?.data?.total ?? 0;

    const isPositive = percentageChange > 0;
    const isNeutral = percentageChange === 0;

    return (
        <Card className="col-span-4 h-full border-none shadow-md overflow-hidden relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
                <div className="space-y-1">
                    <CardTitle className="text-base font-bold text-gray-800">
                        Sales Trends
                    </CardTitle>

                    {isLoading ? (
                        <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
                    ) : (
                        <div className="flex flex-col">
                             <span className="text-2xl font-bold text-neutral-900">
                                ${totalRevenue.toFixed(2)}
                            </span>
                            <CardDescription className={cn(
                                "flex items-center gap-1 font-medium",
                                isPositive ? "text-green-600" : isNeutral ? "text-gray-500" : "text-red-600"
                            )}>
                                {isPositive && <ArrowUpRight className="h-4 w-4" />}
                                {isNeutral && <Minus className="h-4 w-4" />}
                                {!isPositive && !isNeutral && <ArrowDownRight className="h-4 w-4" />}

                                {Math.abs(percentageChange)}%
                                <span className="text-muted-foreground font-normal ml-1">
                                    vs last {period}
                                </span>
                            </CardDescription>
                        </div>
                    )}
                </div>

                <Tabs defaultValue="month" onValueChange={setPeriod} className="w-auto">
                    <TabsList className="h-8 bg-gray-100/80">
                        <TabsTrigger value="week" className="text-xs px-3 h-6">Week</TabsTrigger>
                        <TabsTrigger value="month" className="text-xs px-3 h-6">Month</TabsTrigger>
                        <TabsTrigger value="year" className="text-xs px-3 h-6">Year</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>

            <CardContent className="pl-0 pb-0 min-h-[300px] w-full relative">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-50/50 to-transparent pointer-events-none" />

                {isLoading ? (
                    <div className="flex h-[300px] items-center justify-center">
                        <Loader2 className="animate-spin text-blue-500" />
                    </div>
                ) : chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                                interval={period === "month" ? 4 : 0}
                            />

                            <Tooltip
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                }}
                                formatter={(value: number) => [`$${value}`, "Sales"]}
                                cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '5 5' }}
                            />

                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-[300px] items-center justify-center text-muted-foreground text-sm">
                        No sales data for this {period}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}