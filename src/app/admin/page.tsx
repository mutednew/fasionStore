import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold">Dashboard</h1>

            {/* Верхние карточки статистики */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Total Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">$250,000</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Pending Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">35</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Low Stock Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-500">12</p>
                    </CardContent>
                </Card>
            </div>

            {/* Placeholder для будущих графиков и таблиц */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="h-64 flex items-center justify-center text-muted-foreground">
                    Sales Chart (to add later)
                </Card>
                <Card className="h-64 flex items-center justify-center text-muted-foreground">
                    Best Sellers (to add later)
                </Card>
            </div>
        </div>
    );
}