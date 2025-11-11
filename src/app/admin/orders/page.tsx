import { StatCard } from "../components/StatCard";
import { OrderChart } from "../components/OrderChart";
import { OrderActivity } from "../components/OrderActivity";
import { OrderFilters } from "../components/OrderFilters";

export default function AdminOrders() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold">Orders</h1>

            {/* Карточки статистики */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Orders" value="2 430" />
                <StatCard title="Pending" value="120" color="text-yellow-500" />
                <StatCard title="Completed" value="2 120" color="text-green-600" />
                <StatCard title="Cancelled" value="45" color="text-red-500" />
            </div>

            {/* Контент и фильтры */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Основная область */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <OrderActivity />
                        <OrderChart />
                    </div>
                </div>

                {/* Фильтры */}
                <div className="xl:col-span-1">
                    <OrderFilters />
                </div>
            </div>
        </div>
    );
}