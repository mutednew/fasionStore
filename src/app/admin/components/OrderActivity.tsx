import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
    { id: 1, text: "Order #5234 shipped to John Doe", time: "2 h ago" },
    { id: 2, text: "Order #5230 delivered to Emily Clark", time: "5 h ago" },
    { id: 3, text: "Order #5228 cancelled by customer", time: "8 h ago" },
    { id: 4, text: "New order #5240 created", time: "10 h ago" },
];

export function OrderActivity() {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((item) => (
                        <div key={item.id} className="flex items-start gap-3">
                            <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
                            <div>
                                <p className="text-sm">{item.text}</p>
                                <p className="text-xs text-muted-foreground">{item.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}