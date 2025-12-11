import { cn } from "@/lib/utils";

interface ProductPriceProps {
    price: number | string;
    salePrice?: number | string | null;
    className?: string;
    align?: "left" | "right" | "center";
}

export function ProductPrice({ price, salePrice, className, align = "left" }: ProductPriceProps) {
    const originalPrice = Number(price);
    const finalPrice = salePrice ? Number(salePrice) : originalPrice;
    const isOnSale = salePrice && Number(salePrice) < originalPrice;

    const discountPercent = isOnSale
        ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
        : 0;

    return (
        <div className={cn("flex flex-col", align === "right" && "items-end", align === "center" && "items-center", className)}>
            <div className="flex items-baseline gap-2">
                {isOnSale && (
                    <span className="text-sm text-gray-400 line-through decoration-gray-400">
                        ${originalPrice.toFixed(2)}
                    </span>
                )}
                <span className={cn("font-bold text-neutral-900", isOnSale ? "text-red-600" : "")}>
                    ${finalPrice.toFixed(2)}
                </span>
            </div>

            {isOnSale && (
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded w-fit mt-0.5">
                    Save {discountPercent}%
                </span>
            )}
        </div>
    );
}