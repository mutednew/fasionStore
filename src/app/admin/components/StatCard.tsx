import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
    title: string;
    value: string | number;
    color?: string;
}

export function StatCard({ title, value, color }: StatCardProps) {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className={`text-3xl font-bold ${color ?? ""}`}>{value}</p>
            </CardContent>
        </Card>
    );
}