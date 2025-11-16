"use client";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetOrderStatsQuery } from "@/store/api/adminApi";

const COLORS = ["#fbbf24", "#22c55e", "#ef4444", "#3b82f6"];

export function OrderChart() {
    const { data, isLoading } = useGetOrderStatsQuery();

    const stats = data?.data?.stats ?? {
        total: 0,
        pending: 0,
        delivered: 0,
        canceled: 0,
    };

    const chartData = [
        { name: "Pending", value: stats.pending },
        { name: "Delivered", value: stats.delivered },
        { name: "Canceled", value: stats.canceled },
    ];

    const hasData = chartData.some((item) => item.value > 0);

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Order Status Overview</CardTitle>
            </CardHeader>

            <CardContent className="h-80 flex items-center justify-center">
                {isLoading ? (
                    <p className="text-muted-foreground text-sm">Loading chart...</p>
                ) : !hasData ? (
                    <p className="text-muted-foreground text-sm">
                        No order data available.
                    </p>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={110}
                                dataKey="value"
                                label={({ name, value }) =>
                                    value > 0 ? `${name}: ${value}` : ""
                                }
                            >
                                {chartData.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}