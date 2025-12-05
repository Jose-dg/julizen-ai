// Purchase Event
export const trackPurchase = (orderId: string, value: number, currency: string = 'USD', items: any[]) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'purchase', {
            transaction_id: orderId,
            value: value,
            currency: currency,
            items: items,
        });
    }
};

// Add to Cart Event
export const trackAddToCart = (item: { id: string; name: string; price: number; quantity: number }) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'add_to_cart', {
            currency: 'USD',
            value: item.price * item.quantity,
            items: [item],
        });
    }
};

// View Item Event
export const trackViewItem = (item: { id: string; name: string; price: number; category: string }) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'view_item', {
            currency: 'USD',
            value: item.price,
            items: [item],
        });
    }
};

// Begin Checkout Event
export const trackBeginCheckout = (value: number, items: any[]) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'begin_checkout', {
            currency: 'USD',
            value: value,
            items: items,
        });
    }
};
