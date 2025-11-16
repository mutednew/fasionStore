"use client";

import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderFiltersProps {
    status: string;
    sort: string;
    onStatusChange: (value: string) => void;
    onSortChange: (value: string) => void;
    onReset: () => void;
}

export function OrderFilters({
    status,
    sort,
    onStatusChange,
    onSortChange,
    onReset,
}: OrderFiltersProps) {
    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

                {/* Order Status */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">Order Status</label>
                    <Select value={status} onValueChange={onStatusChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PAID">Paid</SelectItem>
                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                            <SelectItem value="CANCELED">Canceled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-1">
                    <label className="text-sm font-medium">Sort by</label>
                    <Select value={sort} onValueChange={onSortChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date-desc">Newest</SelectItem>
                            <SelectItem value="date-asc">Oldest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    variant="outline"
                    className="w-full"
                    onClick={onReset}
                >
                    Reset Filters
                </Button>
            </CardContent>
        </Card>
    );
}