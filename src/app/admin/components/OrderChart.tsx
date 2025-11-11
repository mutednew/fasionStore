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

const data = [
    { name: "Pending", value: 10 },
    { name: "Shipped", value: 25 },
    { name: "Delivered", value: 50 },
    { name: "Cancelled", value: 5 },
    { name: "Returned", value: 10 },
];

const COLORS = ["#fbbf24", "#3b82f6", "#22c55e", "#ef4444", "#a855f7"];

export function OrderChart() {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Order Status Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}