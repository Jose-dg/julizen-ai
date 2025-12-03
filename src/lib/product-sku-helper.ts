// Helper function to get SKU for a product based on its properties
export async function getProductSku(productName: string, region?: string, denomination?: string): Promise<string | null> {
    try {
        const response = await fetch('/product-skus.json');
        const data = await response.json();

        // Find matching product
        const product = data.products.find((p: any) => {
            // Match by name first
            if (p.name !== productName) return false;

            // If region is provided, match it
            if (region && p.region !== region) return false;

            // If denomination is provided, match it
            if (denomination && p.denomination !== denomination) return false;

            return true;
        });

        return product?.sku || null;
    } catch (error) {
        console.error('Error loading product SKUs:', error);
        return null;
    }
}

// Alternative: Get SKU by product ID if you have a mapping
export function getSkuFromProductId(productId: string, skuMap?: Record<string, string>): string {
    // If you have a mapping of product IDs to SKUs, use it
    if (skuMap && skuMap[productId]) {
        return skuMap[productId];
    }

    // Otherwise, return the product ID as fallback
    return productId;
}
