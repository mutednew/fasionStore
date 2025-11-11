import { StatCard } from "../components/StatCard";
import { ProductFilters } from "../components/ProductFilters";
import { ProductTable } from "../components/ProductTable";

export default function AdminProducts() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold">Products</h1>

            {/* Статистика */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="Total Products" value="1,250" />
                <StatCard title="Active Products" value="1,100" />
                <StatCard title="Out of Stock" value="35" color="text-red-500" />
            </div>

            {/* Фильтры */}
            <ProductFilters />

            {/* Таблица */}
            <ProductTable />
        </div>
    );
}