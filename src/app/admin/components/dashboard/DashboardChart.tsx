"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface DashboardChartProps {
    stats: {
        pending: number;
        paid: number;
        shipped: number;
        delivered: number;
        canceled: number;
    };
}

// Цвета для разных статусов
const COLORS = {
    PENDING: "#EAB308", // yellow-500
    PAID: "#3B82F6", // blue-500
    SHIPPED: "#A855F7", // purple-500
    DELIVERED: "#22C55E", // green-500
    CANCELED: "#EF4444", // red-500
};

const RADIAN = Math.PI / 180;

// Кастомная метка внутри сегмента
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="text-xs font-bold pointer-events-none"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

// Кастомный тултип
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-2 border rounded-md shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                    <p className="text-sm font-medium">{data.name}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">Orders: <span className="font-bold text-black">{data.value}</span></p>
            </div>
        );
    }
    return null;
};

export function DashboardChart({ stats }: DashboardChartProps) {
    // Исправление ошибки SSR: Рендерим график только на клиенте
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <Card className="shadow-sm border-none bg-white h-full min-h-[300px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading chart...</p>
            </Card>
        );
    }

    const chartData = [
        { name: "Pending", value: stats.pending, color: COLORS.PENDING },
        { name: "Paid", value: stats.paid, color: COLORS.PAID },
        { name: "Shipped", value: stats.shipped, color: COLORS.SHIPPED },
        { name: "Delivered", value: stats.delivered, color: COLORS.DELIVERED },
        { name: "Canceled", value: stats.canceled, color: COLORS.CANCELED },
    ].filter(item => item.value > 0);

    return (
        <Card className="shadow-sm border-none bg-white h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Order Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                {chartData.length === 0 ? (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        No order data available to display.
                    </div>
                ) : (
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={100}
                                    innerRadius={40}
                                    fill="#8884d8"
                                    dataKey="value"
                                    paddingAngle={2}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" className="hover:opacity-80 transition-opacity cursor-pointer" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value, entry: any) => <span className="text-sm text-gray-600 ml-1">{value} ({entry.payload.value})</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}