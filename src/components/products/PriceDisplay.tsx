'use client';

import { useSession } from "next-auth/react";
import { useGlobal } from "@/lib/global-context";

interface PriceDisplayProps {
    retailPrice: number;
    wholesalePrice: number;
    currencyCode?: string;
}

export function PriceDisplay({ retailPrice, wholesalePrice, currencyCode = 'USD' }: PriceDisplayProps) {
    const { data: session } = useSession();
    const { formatPrice } = useGlobal();

    const isWholesale = session?.user?.user_type === "wholesale";
    const price = isWholesale ? wholesalePrice : retailPrice;

    // Note: formatPrice uses the global currency context, but here we might receive a specific currency price.
    // For simplicity in this demo, we assume the price passed matches the global context or we just format it simply if not using the global converter.
    // If the backend returns prices in USD, and we want to show them in COP, we rely on the GlobalContext conversion logic if implemented there.
    // However, the prompt implies the backend returns specific prices. Let's assume they are in the currency of the context or USD.

    // If we want to strictly follow the prompt's "Dynamic Pricing" from backend:
    // We display the price as is, formatted.

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
    }).format(price);

    return (
        <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold text-blue-600">{formattedPrice}</span>
            {isWholesale && (
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full w-fit">
                    Wholesale Price
                </span>
            )}
        </div>
    );
}
