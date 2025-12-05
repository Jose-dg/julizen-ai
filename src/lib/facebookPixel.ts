export const fbPixelPurchase = (value: number, currency: string = 'USD', orderId: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Purchase', {
            value: value,
            currency: currency,
            content_type: 'product',
            content_ids: [orderId],
        });
    }
};

export const fbPixelAddToCart = (value: number, contentName: string, contentId: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'AddToCart', {
            value: value,
            currency: 'USD',
            content_name: contentName,
            content_ids: [contentId],
            content_type: 'product',
        });
    }
};

export const fbPixelInitiateCheckout = (value: number, numItems: number) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
            value: value,
            currency: 'USD',
            num_items: numItems,
        });
    }
};

export const fbPixelViewContent = (value: number, contentName: string, contentId: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'ViewContent', {
            value: value,
            currency: 'USD',
            content_name: contentName,
            content_ids: [contentId],
            content_type: 'product',
        });
    }
};
